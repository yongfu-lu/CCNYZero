
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require("passport-local-mongoose");
const schema = require(__dirname + "/schema.js");
const emailer = require(__dirname + "/emailer.js");
const query = require(__dirname + "/query.js");

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

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
const Class = new mongoose.model("Class", classSchema);
const Applicant = new mongoose.model("Applicant", applicantSchema);


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var topStudents;
var topClasses;
var worstClasses;
//this object is created for avoiding typo purpose. Used when create new users
const userRoles = {
    registrar: "registrar",
    instructor: "instructor",
    student:"student",
    visitor:"visitor"
}
/**************** add and update data for testing here **********/


/*********** All route from here ********/

//if user is not login yet, go to normal visitor homepage, otherwise go to their homepage
app.get("/",async function(req, res){
    if(req.user){
        res.redirect("/" + req.user.role +"home");
    }else{
         topStudents = await query.getTopStudents(User);
         topClasses = await query.getTopClasses(Class);
         worstClasses = await query.getWorstClasses(Class);
        res.render("visitorHome",{ topStudents: topStudents, topClasses:topClasses, worstClasses:worstClasses});
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
app.get("/studentHome",function(req,res){
    if(!req.isAuthenticated() || req.user.role != 'student'){
        res.redirect("/logout");
    }else{
        res.render("studentHome",{ myname:req.user.fullname,topStudents: topStudents, topClasses:topClasses, worstClasses:worstClasses});
    }
})

app.get("/registrarHome",function(req,res){
    if(!req.isAuthenticated() || req.user.role != 'registrar'){
        res.redirect("/logout");
    }else{
        res.render("registrarHome",{ myname:req.user.fullname, topStudents: topStudents, topClasses:topClasses, worstClasses:worstClasses});

    }
})


app.get("/instructorHome",function(req,res){
    if(!req.isAuthenticated() || req.user.role !='instructor'){
        res.redirect("/logout");
    }else{
        res.render("instructorHome",{ myname:req.user.fullname,topStudents: topStudents, topClasses:topClasses, worstClasses:worstClasses});
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
                        res.redirect("/" + foundUser.role +"home");
                    }
                })
            })
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



/**************************** MessageBox related methods */
app.get("/adminMessage", async function(req,res){
    
    var studentApplications = await query.getStudentApplications(Applicant);
    var instructorApplications = await query.getInstructorApplications(Applicant);

    res.render("adminMessage", {studentApplications:studentApplications, instructorApplications:instructorApplications});
})

    //when admin make dicision about applications
app.post("/adminMessage", function(req,res){
    var dicision = req.body.dicision;
    if(dicision == "reject"){
        emailer.sendRejectEmail(req.body.email,req.body.fullname);
        res.redirect("/adminMessage");
    }else{
        emailer.sendAcceptEmail(req.body.email,req.body.fullname, req.body.GPA, User);
        Applicant.findOneAndUpdate({email:req.body.email, role:req.body.role},{decided:true}, function(err){
            if(err){
                console.log(err)
            }else{
                res.redirect("/adminMessage");
            }
        })
    }
})



/** server port **/
app.listen(3000, function(){
    console.log("Server is running on part 3000");
})