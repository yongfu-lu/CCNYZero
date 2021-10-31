
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require("passport-local-mongoose");
const { giveWarning } = require('./query');
const schema = require(__dirname + "/schema.js");
const emailer = require(__dirname + "/emailer.js");
const query = require(__dirname + "/query.js");
const time = require(__dirname+"/time.js");
const utility = require(__dirname+"/utility");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(session({
    secret : process.env.SECRET,
    resave:false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://TeamQ:brooklyn2021@cluster0.w84rk.mongodb.net/CCNYZeroDB");

const userSchema = schema.getUserSchema();
const classSchema = schema.getClassSchema();
const applicantSchema = schema.getApplicantSchema();
const complaintSchema = schema.getComplaintSchema();

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
const Class = new mongoose.model("Class", classSchema);
const Applicant = new mongoose.model("Applicant", applicantSchema);
const Complaint = new mongoose.model('Complaint', complaintSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var topStudents;
var topClasses;
var worstClasses;
var instructors;
const programQuota = 30;
var currentSemester = "Fall";
//var today = time.today;

/**************** do testing code here **********/
var today = new Date("2021-12-30T00:00:00")

/*********** All route from here ********/

//if user is not login yet, go to normal visitor homepage, otherwise go to their homepage
app.get("/",async function(req, res){
    if(req.user){
        res.redirect("/" + req.user.role +"home");
    }else{
         topStudents = await query.getTopStudents(User);
         topClasses = await query.getTopClasses(Class);
         worstClasses = await query.getWorstClasses(Class);
        res.render("visitorHome",{ topStudents: topStudents, topClasses:topClasses, worstClasses:worstClasses, today:today});
    }
})

//if user already login, redirect to their homepage, no need to log in again
app.get("/login", function(req,res){
    if(req.user){
        res.redirect("/" + req.user.role +"home");
    } else{
        res.render("login");
    }
})

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})

//if non-student user try to access student homepage by typing url in the broswer, user will be directed to visitor homepage 
app.get("/studentHome",async function(req,res){
    if(!req.isAuthenticated() || req.user.role != 'student'){
        res.redirect("/logout");
    }else{
        topStudents = await query.getTopStudents(User);
         topClasses = await query.getTopClasses(Class);
         worstClasses = await query.getWorstClasses(Class);
        res.render("studentHome",{ myname:req.user.fullname,topStudents: topStudents, topClasses:topClasses, worstClasses:worstClasses,today:today});
    }
})

app.get("/registrarHome",async function(req,res){
    if(!req.isAuthenticated() || req.user.role != 'registrar'){
        res.redirect("/logout");
    }else{
        topStudents = await query.getTopStudents(User);
         topClasses = await query.getTopClasses(Class);
         worstClasses = await query.getWorstClasses(Class);
        res.render("registrarHome",{ myname:req.user.fullname, topStudents: topStudents, topClasses:topClasses, worstClasses:worstClasses,today:today});

    }
})


app.get("/instructorHome",async function(req,res){
    if(!req.isAuthenticated() || req.user.role !='instructor'){
        res.redirect("/logout");
    }else{
        topStudents = await query.getTopStudents(User);
         topClasses = await query.getTopClasses(Class);
         worstClasses = await query.getWorstClasses(Class);
        res.render("instructorHome",{ myname:req.user.fullname,
            topStudents: topStudents, 
            topClasses:topClasses, 
            worstClasses:worstClasses,
            today:today
        });
    }
})


app.get("/changePassword", function(req,res){
    if(!req.isAuthenticated()){
        res.redirect("/logout");
    }else{
        res.render("changePassword");
    }
})

app.post("/login", function(req,res){
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req, res, function(){
                User.findOne({username:user.username}, function(err, foundUser){
                    if(err){
                        console.log(err)
                    }else{
                        if(foundUser.firstLogin){
                            res.redirect("/changePassword");
                        }else{
                            res.redirect("/" + foundUser.role +"home");
                        }
                    }
                })
            })
        }
    })
})


app.post("/changePassword", function(req, res){
    const username = req.user.username
    const newPassword = req.body.newpassword;
    const role = req.user.role;
    query.changePassword(User, username, newPassword);
    User.findOneAndUpdate({username:username},{firstLogin:false},function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/" + role +"home");
        }
    })
})

// ********************** apply-related methods *******************
app.get("/applyStudent", function(req, res) {
    res.render("applyStudent");
  })
  
app.get("/applyInstructor", function(req, res) {
    res.render("applyInstructor");
  })
  
  
 app.post("/applyStudent", function(req, res) {
    const newApplicant = new Applicant({
      email: req.body.applicantEmail,
      fullname: req.body.applicantName,
      major: req.body.major,
      role:"student",
      GPA: req.body.applicantGPA,
      decided: false
    });
    newApplicant.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Add a new applicant successfully.");
        res.redirect("/");
      }
    });
  });

    
 app.post("/applyInstructor", function(req, res) {
    const newApplicant = new Applicant({
      email: req.body.applicantEmail,
      fullname: req.body.applicantName,
      department: req.body.department,
      role:"instructor",
      selfStatement:req.body.selfStatement,
      decided: false
    });
    newApplicant.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Add a new instructor applicant successfully.");
        res.redirect("/");
      }
    });
  });



/**************************** admin related methods */

app.get("/message", async function(req,res){
    if(!req.isAuthenticated() || req.user.role != 'registrar')
        res.redirect("/logout");
    else{
        var complaints = await query.getComplaints(Complaint);
        res.render("message", {complaints : complaints});
    }

})

//when admin make dicision about a complaint
app.post("/message", function(req,res){
    var decision = req.body.decision;
    var complaintId = req.body.complaintId;
    var fullName = req.body.fullName;
    var className = req.body.className;
    if(decision == "issueWarning" || decision == "deregister"){
        res.render("sendWarning", {decision:decision, complaintId: complaintId, fullName: fullName,className:className})
    }else{
        Complaint.updateOne({_id:complaintId},{decided:true}, function(err){
            if(err) console.log(err);
            res.redirect("/message");
        })
    }
 })

app.post("/sendWarning", async function(req,res){
    User.findOne({fullname:req.body.fullName},function(err, foundUser){
        if ( req.body.decision == 'issueWarning'){
            query,giveWarning(User,foundUser.username,req.body.reason);
        } else{
            query.deregister(User,Class, foundUser.username,req.body.className);
        }
        Complaint.updateOne({_id:req.body.complaintId},{decided:true}, function(err){
            if(err) console.log(err);
            res.redirect("/message");
        })

    })
})

app.get("/application", async function(req,res){
    var studentApplications = await query.getStudentApplications(Applicant);
    var instructorApplications = await query.getInstructorApplications(Applicant);
    var totalStudents = await query.getTotalStudents(User);
    res.render("application", {studentApplications:studentApplications, 
        instructorApplications:instructorApplications,
        programQuota:programQuota,
        totalStudents:totalStudents});
})

    //when admin make dicision about applications
app.post("/application", function(req,res){
    var decision = req.body.decision;
    if(decision == "reject"){
        emailer.sendRejectEmail(req.body.email,req.body.fullname);
    }else{
        emailer.sendAcceptEmail(req.body.email,req.body.fullname, req.body.GPA, User);
    }
    Applicant.findOneAndUpdate({email:req.body.email, role:req.body.role},{decided:true}, function(err){
        if(err){
            console.log(err)
        }else{
            res.redirect("/application");
        }
    })
})

/**************************** Time related methods **********/
app.post("/setToday", function(req,res){
    //"2021-12-21T00:00:00"
    const newToday = req.body.settoday + "T00:00:00";
    today = time.setToday(newToday);
    res.redirect("/registrarHome");
})


/******************************* Class related route  ***************/
app.get("/classSetUp", async function(req,res){
    if(!req.isAuthenticated() || req.user.role != 'registrar'){
        res.redirect("/logout");
    }else{
        instructors = await query.getAvailableInstructors(User);
        res.render("classSetUp", {period:time.getPeriod(today), instructors:instructors, justAdded:false});
    }
})


app.get("/classSignUp", async function(req,res){
    if(!req.isAuthenticated() || req.user.role != 'student'){
        res.redirect("/logout");
    }else{
        const classes = await query.getAllCurrentClasses(Class);
        res.render("classSignUp",{period:time.getPeriod(today),classes:classes});
    }
})

app.post("/classSetUp", function(req,res){      
    const newClass = new Class({
        department:req.body.department,           
        course_fullname:req.body.classFullName,    
        course_shortname:req.body.classShortName,    
        section:req.body.classSection,          
        credit: req.body.classCredit,         
        instructor:req.body.instructor,
        year: today.getFullYear(),
        semester: "Fall",
        max_capacity: req.body.classSize,   
        schedule: [
        {
            day: req.body.day1,
            startTime: req.body.startTime1,
            endTime: req.body.endTime1
        },
        {
            day: req.body.day2,
            startTime: req.body.startTime2,
            endTime: req.body.endTime2
        }]
    });
    //After set up new class, update instructor collection too, add new class to assigned_class of the instructor
    newClass.save(function(err,doc){
        User.updateOne({fullname:req.body.instructor}, {$push:{assigned_class:doc.id}}, function(err, user){
            if(err) console.log(err);
            else{
                console.log("Updated class to instructor");
            }
        });
    });
    res.render("classSetUp", {period:time.getPeriod(today), instructors:instructors, justAdded:true});

})


app.post("/classSignUp", async function(req,res){
    const newClass = await query.getClassDetail(Class,req.body.classID);
    const classShortName = newClass.course_shortname;
    const takenClasses = req.user.taken_class;
    const studentsAlreadyInClass = newClass.students.length;
    const classSize = newClass.max_capacity;
    const enrolledClasses = await query.getEnrolledClasses(User,req.user.username);
    const schedules = await query.getEnrolledSchedules(Class, enrolledClasses);
    var newClassSchedule = time.convertSchedule(newClass);

    //maximun enroll class is 4 classes
    if(req.user.enrolled_class.length >= 4){
        res.render("classSignUpResult", {result:"Fail", detail:"You cannot sign up more than 4 classes"});
        return;
    }else{
        //if student already pass this class, cannot take it again
        for(var i = 0; i<takenClasses.length; i++){
            if(takenClasses[i].course_shortname == classShortName && takenClasses[i].grade != 'F' && takenClasses[i].grade != 'W'){
                res.render("classSignUpResult", {result:"Fail", detail:"You already passed this class"});
                return;
            }
        }
    }
    //if student schedule time conflit with new class, add class will fail
    if(time.conflict(schedules, newClassSchedule)){
        res.render("classSignUpResult", {result:"Fail", detail:"Schedule Conflict"});
    }else if (studentsAlreadyInClass >= classSize){
        query.addStudentToWaitList(Class,req.body.classID, req.user.username);
        res.render("classSignUpResult", {result:"This class is full", detail:"You will be put in wait list."})
    }else{
        User.updateOne({username:req.user.username}, {$push:{enrolled_class:req.body.classID}}, function(err, user){
            if(err) console.log(err);
            else{
                console.log("Add enrolled class to student");
                query.addStudentToClass(Class,req.body.classID, req.user.username, req.user.fullname);
                res.render("classSignUpResult", {result:"Success", detail:"You added new class to your schedule."});
            }
        });
    }
})


app.post("/dropClass",function(req,res){
    const confirm = req.body.confirm;
    if(confirm == 'no'){
        res.redirect("/studentMyClasses")
    }else{
        User.findOneAndUpdate({username:req.user.username}, {$pull:{enrolled_class:req.body.classID}},function(err){
            if(err)  console.log(err)
            else{
                if(time.getPeriod(today) == "classRunning"){
                    //take off class from student
                    User.findOneAndUpdate({username:req.user.username},
                        {$push:{taken_class:{course_shortname:req.body.className, 
                            year:req.body.year,
                            semester:req.body.semester,
                            credit:0,
                            grade:"W"}}},function(err){
                            if(err) console.log(err)
                            query.ifDropAllClasses(User,req.user.username);
                        })
                }
                //take off student from class
                Class.findOneAndUpdate({_id:req.body.classID}, {$pull:{students:{email:req.user.username}}},function(err){
                    if(err)console.log(err)
                    else{
                        res.redirect("/studentMyClasses");
                    }
                })
            }
        })
        
    }
})


app.post("/rateClass",function(req,res){
    var review = req.body.review;
    if(!utility.passTabooWordsCheck(review)){
        query,giveWarning(User,req.user.username,"Taboo Warning");
        query,giveWarning(User,req.user.username,"Taboo Warning");
        res.redirect("/studentMyClasses");
        return;
    }else{
        review = utility.passTabooWordsCheck(review);
    }
    var newReview = {
        writer_name:req.user.fullname,
        writer_email:req.user.username,
        write_to_classID:req.body.classID,
        write_to_className:req.body.className,
        instructor:req.body.instructor,
        rate:parseInt(req.body.numberOfStar),
        review:review
    }
    
    User.updateOne({username:req.user.username},{$push:{wrote_review:newReview}},function(err){
        if(err) console.log(err);
        Class.updateOne({_id:req.body.classID},{$push:{review:newReview}},function(err){
            if(err) console.log(err);
            query.calculateRating(User,Class,req.body.classID);
            res.redirect("/studentMyClasses");
        })
    })
    
    
})

/******************************** student's pages ***********************/
app.get("/myAcademics", function(req,res){
    if(!req.isAuthenticated() || req.user.role != 'student'){
        res.redirect("/logout");
    }else{
        res.render("myAcademics",{userRole:"student",studentName:req.user.fullname,taken_classes:req.user.taken_class, GPA:req.user.GPA});
    }
})


app.get("/studentMyClasses",async function(req,res){
    if(!req.isAuthenticated() || req.user.role != 'student'){
        res.redirect("/logout");
    }else{
        const classIds = req.user.enrolled_class;
        const enrolledClass = await query.getEnrolledClassObjects(Class, classIds);
        const period = time.getPeriod(today);
        res.render("studentMyClasses", {enrolledClasses:enrolledClass, period:period});
    }
})

app.post("/studentMyClasses", async function(req,res){
    const action = req.body.action;
    const classID = req.body.classID;
    const className = req.body.classShortName;
    const classSection = req.body.classSection;
    const classCredit = req.body.classCredit;
    const instructor = req.body.instructor;
    const year = req.body.year;
    const semester = req.body.semester;
    if(action == "drop"){
        res.render("dropClass", {classID: classID, className:className, classSection: classSection, classCredit : classCredit, year:year, semester:semester});
    }else{
        res.render("rateClass",{classID: classID, className:className,classSection:classSection, instructor:instructor});
    }
})


app.get("/fileComplaint", function(req,res){
    if(!req.isAuthenticated()){
        res.redirect("/logout");
    }else{
        res.render("fileComplaint", {userRole:req.user.role});
    }
})


app.post("/fileComplaint", function(req,res){

    query.createComplaint(Complaint,req.user,req.body.complaintAboutName, req.body.complaintAboutRole,
        req.body.className, req.body.complaintDetail);
    
    res.redirect("/");
})


/**********************  instructor's pages *********/
app.get("/instructorMyClasses", async function(req,res){
    if(!req.isAuthenticated() || req.user.role != 'instructor'){
        res.redirect("/logout");
    }else{
        teachingClasses = await query.getTeachingClasses(Class,req.user.fullname,today.getFullYear(),currentSemester);
        res.render("instructorMyClasses", {period: time.getPeriod(today), teachingClasses:teachingClasses})
    }
})

app.post("/instructorMyClasses", async function(req, res){
    const studentEmail = req.body.studentEmail;
    User.findOne({username:studentEmail}, function(err, foundStudent){
        if(err) console.log(err);
        else if(req.body.action == "record"){
            res.render("myAcademics",{userRole:"instructor",studentName: foundStudent.fullname, taken_classes:foundStudent.taken_class, GPA:foundStudent.GPA})
        }
        else{
            res.render("instructorGrading",{studentName:foundStudent.fullname,
                studentEmail:studentEmail,
                className:req.body.className,
                classID:req.body.classID,
                classCredit:req.body.classCredit
            });
        }
    })
})


app.post("/instructorGrading", async function(req, res){
    await query.assignGrade(User, Class, req.body.studentEmail, 
        req.body.className, req.body.classID, req.body.classCredit, 
        req.body.grade,today.getFullYear(), currentSemester)
    
        res.redirect("/instructorMyClasses")
})


/*****   These methods will be call after grading period end             *****/
/*****   It will send warning or honor to students or instructors        *****/
var gradeAnalyzed = false;
if(time.getPeriod(today) == "afterGrading" && !gradeAnalyzed){
    //year, semester, Class, User,
    utility.gradeAnalyze(Class, User, Complaint, today.getFullYear(), currentSemester);
    gradeAnalyzed = true;
}



/** server port **/
app.listen(3000, function(){
    console.log("Server is running on part 3000");
})