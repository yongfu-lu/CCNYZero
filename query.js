const mongoose = require("mongoose");
const schema = require(__dirname + "/schema.js");
const utility = require(__dirname+"/utility");

const userSchema = schema.getUserSchema();
const classSchema = schema.getClassSchema();
const applicantSchema = schema.getApplicantSchema();
const complaintSchema = schema.getComplaintSchema();

exports.getTopStudents = getTopStudents;
exports.getTopClasses = getTopClasses;
exports.getWorstClasses = getWorstClasses;
exports.getStudentApplications = getStudentApplications;
exports.getInstructorApplications = getInstructorApplications;
exports.changePassword = changePassword;
exports.getTotalStudents = getTotalStudents;
exports.getAvailableInstructors = getAvailableInstructors;
exports.getAllCurrentClasses = getAllCurrentClasses;
exports.getClassDetail = getClassDetail;
exports.getEnrolledClasses = getEnrolledClasses;
exports.getEnrolledSchedules = getEnrolledSchedules;
exports.addStudentToClass = addStudentToClass;
exports.addStudentToWaitList = addStudentToWaitList;
exports.getEnrolledClassObjects = getEnrolledClassObjects;
exports.giveWarning = giveWarning;
exports.checkWarningNumber = checkWarningNumber;
exports.suspendUser =suspendUser;
exports.ifDropAllClasses =ifDropAllClasses;
exports.calculateRating= calculateRating;
exports.createComplaint= createComplaint;
exports.getComplaints = getComplaints;
exports.deregister = deregister;
exports.getTeachingClasses = getTeachingClasses;
exports.assignGrade = assignGrade;
exports.didNotGradeAllStudents = didNotGradeAllStudents;
exports.analyzeClassGPA = analyzeClassGPA
exports.findStudentFailedTwice =findStudentFailedTwice
exports.analyzeStudentsGPA =analyzeStudentsGPA;
exports.getGraduationApplications  = getGraduationApplications;
exports.getStudentObjectsByEmails = getStudentObjectsByEmails;
exports.approveGraduation=approveGraduation;
exports.denyGraduation =denyGraduation;
exports.warnStudentsWithTooLessCourses =warnStudentsWithTooLessCourses;
exports.cancelClassesWithTooLessStudents =cancelClassesWithTooLessStudents;

function sleep() {
  return new Promise((resolve) => setTimeout(resolve, 500));
}

async function getTopStudents(User) {
  var topStudents;
  User.find({ role: "student" })
    .limit(3)
    .sort({ GPA: -1 })
    .exec(async function (err, foundStudents) {
      if (err) {
        console.log(err);
      } else {
        topStudents = foundStudents;
      }
    });
  await sleep();
  return topStudents;
}

async function getTopClasses(Class) {
  var topClasses;
  Class.find({rating:{$ne:null} })
    .limit(3)
    .sort({ rating: -1 })
    .exec(function (err, foundClasses) {
      if (err) {
        console.log(err);
      } else {
        topClasses = foundClasses;
      }
    });
  await sleep();
  return topClasses;
}

async function getWorstClasses(Class) {
  var worstClasses;
  Class.find({rating:{$ne:null} })
    .limit(3)
    .sort({ rating: 1 })
    .exec(function (err, foundClasses) {
      if (err) {
        console.log(err);
      } else {
        worstClasses = foundClasses;
      }
    });
  await sleep();
  return worstClasses;
}

async function getStudentApplications(Applicant) {
  var applications;
  Applicant.find(
    { decided: false, role: "student" },
    function (err, foundApplications) {
      if (err) {
        console.log(err);
      } else {
        applications = foundApplications;
      }
    }
  );
  await sleep();
  return applications;
}

async function getInstructorApplications(Applicant) {
  var applications;
  Applicant.find(
    { decided: false, role: "instructor" },
    function (err, foundApplications) {
      if (err) {
        console.log(err);
      } else {
        applications = foundApplications;
      }
    }
  );
  await sleep();
  return applications;
}

//change user password
function changePassword(User, username, newpassword) {
  User.findByUsername(username).then(
    function (sanitizedUser) {
      if (sanitizedUser) {
        sanitizedUser.setPassword(newpassword, function () {
          sanitizedUser.save();
          console.log("password reset success");
        });
      } else {
        console.log("Pass word reset fail");
      }
    },
    function (err) {
      console.error(err);
    }
  );
}

//get total students in program
async function getTotalStudents(User) {
  var total;
  User.find({ role: "student" }).exec(async function (err, foundStudents) {
    if (err) {
      console.log(err);
    } else {
      total = foundStudents.length;
    }
  });
  await sleep();
  return total;
}

async function getAvailableInstructors(User) {
  var instructors;
  User.find({ role: "instructor", suspended: false }).exec(async function (
    err,
    foundInstructors
  ) {
    if (err) {
      console.log(err);
    } else {
      instructors = foundInstructors;
    }
  });
  await sleep();
  return instructors;
}

async function getAllCurrentClasses(Class) {
  var classes;
  Class.find({year:2021, semester:"Fall", canceled:false}).exec(async function (err, foundClasses) {
    if (err) {
      console.log(err);
    } else {
      classes = foundClasses;
    }
  });
  await sleep();
  return classes;
}

async function getClassDetail(Class, ID) {
  var newClass;
  Class.findById(ID).exec(async function (err, foundClass) {
    if (err) {
      console.log(err);
    } else {
      newClass = foundClass;
    }
  });
   await sleep();
  
  return newClass;
}


async function getEnrolledClasses(User, username) {
  var classes;
  User.findOne({username:username}).exec(async function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      classes = foundUser.enrolled_class;
    }
  });
  await sleep();
  return classes;
}


async function getEnrolledSchedules(Class, ids){
  console.log("inside get schedules method");
  var schedules=[];
  for(var i = 0; i < ids.length; i++){
    Class.findById(ids[i]).exec(async function( err, foundClass){
      schedules.push([
        foundClass.schedule[0].day,
        foundClass.schedule[0].startTime,
        foundClass.schedule[0].endTime,
      ]);
      schedules.push([
        foundClass.schedule[1].day,
        foundClass.schedule[1].startTime,
        foundClass.schedule[1].endTime,
      ]);
      
    })
  }
  await sleep();
  return schedules;
}

async function addStudentToClass(Class, classID, username, fullname){
    Class.updateOne({_id:classID}, {$push:{students:{email: username, fullname:fullname, grade:""}}, 
    $pull:{wait_list:{email:username}}
  }, function(err){
      if(err){
        console.log(err);
      }
    })
}

async function addStudentToWaitList(User,Class,classID, username){
  User.findOne({username:username},function(err, foundUser){
    if(err) console.log(err);
    Class.updateOne({_id:classID}, {$push: {wait_list:{"fullname":foundUser.fullname,"email":username}}},function(err){
      if(err){
        console.log(err);
      }
    })
  })

}


async function getEnrolledClassObjects(Class, ids){
  var classes=[];
  for(var i = 0; i < ids.length; i++){
    Class.findById(ids[i]).exec(async function( err, foundClass){
        classes.push(foundClass);
    })
  }
  await sleep();
  return classes;
}


function giveWarning(User,username, warning){
    
    User.updateOne({username:username},{$push:{warning:warning}}, function(err){
      if(err) console.log(err);
      console.log("You are given one warning");
      checkWarningNumber(User,username);
    })
}

function checkWarningNumber(User,username){
    User.findOne({username:username}, function(err,foundUser){
      if(err) console.log(err)
      else{
        var warnings = foundUser.warning.length;
        if(warnings >= 3){
          console.log("Your have up to 3 warnings")
          suspendUser(User,username);
          return warnings;
        }
      }
    })
}

function suspendUser(User, username){
  User.updateOne({username:username},{suspended:true}, function(err){
    if(err) console.log(err);
    console.log("You are suspended");
  }) 
}


function ifDropAllClasses(User,username){
  User.findOne({username:username},function(err,foundUser){
    if (foundUser.enrolled_class.length == 0){
      suspendUser(User,username);
    }
  })
}

function calculateRating(User,Class, classID){
  var sumOfRating = 0;
  var numOfRating = 0;
  var reviews = [];
  Class.findOne({_id:classID}, function(err,foundClass){
      if(err) console.log(err);
      const originalRate = foundClass.rating;
      reviews = foundClass.review
      for(var i = 0; i<reviews.length; i++){
          sumOfRating += reviews[i].rate;
          numOfRating += 1;
      }
      if(numOfRating > 0){
        var overallRate = (sumOfRating / numOfRating).toFixed(2);
        Class.updateOne({_id:classID},{rating:overallRate},function(err){
          if(err) console.log(err);
          if(originalRate > 2 && overallRate < 2){
              User.findOne({fullname:foundClass.instructor}, function(error, foundUser){
                giveWarning(User,foundUser.username,"Class Rating Too Low");
              })
          }
        })
      }
  })
}


function createComplaint(Complaint,user,complaintAbout, complaintAboutRolo, className,detail){
    const newComplaint = new Complaint({
        complaintFrom: user.username,
        complaintFromName: user.fullname,
        complaintFromRole: user.role,
        complaintAbout:complaintAbout,
        complaintAboutRole:complaintAboutRolo,
        className:className,
        detail: detail,
        decided:false,
        isFromSystem:false
    })

    newComplaint.save();
}

async function getComplaints(Complaint) {
  var complaints;
  Complaint.find(
    { decided: false},
    function (err, foundComplaints) {
      if (err) {
        console.log(err);
      } else {
        complaints = foundComplaints
      }
    }
  );
  await sleep();
  return complaints;
}


async function deregister(User,Class, username,className){
  Class.findOne({course_shortname:className}, function(err, foundClass){
      const classId = foundClass._id.valueOf();
      User.findOneAndUpdate({username:username},{$pull:{enrolled_class:classId}}, function(err){
        if(err) console.log(err)
        else{
          Class.findOneAndUpdate({_id:classId},{$pull:{students:{email:username}}}, function(err){
            if(err) console.log(err);
          })
        }
      })
  })
}



async function getTeachingClasses(Class, instructorName,year, semester ) {
  var classes;
  Class.find(
    {year:year, semester: semester, instructor:instructorName},
    function (err, foundClasses) {
      if (err) {
        console.log(err);
      } else {
        classes = foundClasses
      }
    }
  );
  await sleep();
  return classes;
}
 
async function assignGrade(User, Class, studentEmail, className,classID, classCredit, grade,year, semester){
  User.findOne({username:studentEmail,"taken_class.course_shortname":className,"taken_class.year":year,"taken_class.semester":semester},function(err,foundUser){
    if(foundUser == null){
      User.findOneAndUpdate({username: studentEmail},
        {$push:{taken_class:{course_shortname:className, 
        year:year,
        semester:semester,
        credit:parseInt(classCredit),
        grade:grade}}},async function(err){
        if(err) console.log(err)
        else{
          Class.findOneAndUpdate({"_id":classID,"students.email" : studentEmail},{$set:{"students.$.grade":grade} }, async function(err){
            if(err) console.log(err);
        })
        }
      })
    }
    else{
      User.findOneAndUpdate({username: studentEmail,"taken_class.course_shortname":className,"taken_class.year": year, "taken_class.semester":semester},
      {$set:{"taken_class.$.grade":grade} }
      ,async function(err){
      if(err) console.log(err)
      else{
        Class.findOneAndUpdate({"_id":classID,"students.email" : studentEmail},{$set:{"students.$.grade":grade} }, async function(err){
          if(err) console.log(err);
      })
      }
    })     
    }
    updateGPA(User, studentEmail);
  })
  await sleep();
}

function updateGPA(User, studentEmail){
  User.findOne({username:studentEmail}, function(err, foundUser){
    console.log(foundUser);
    var new_GPA = utility.calculateGPAFromTakenClasses(foundUser.taken_class);
    console.log(new_GPA);
    User.findOneAndUpdate({username:studentEmail},{GPA:new_GPA}, function(err){
      if(err) console.log(err);
    })
  })
}

async function didNotGradeAllStudents(Class, User, year, semester){
  var instructors = new Set();
  console.log("this is inside didNotGradeAllStudents method")
  Class.find({year:year, semester:semester}, async function(err,foundClasses){
      for(var i = 0; i<foundClasses.length; i++){
          for(var j = 0; j < foundClasses[i].students.length; j++){
            if (foundClasses[i].students[j].grade == ""){
              instructors.add(foundClasses[i].instructor) 
            }
          }
      }
      for (let instructor of instructors){
        User.findOne({fullname:instructor, role:"instructor"}, function(err, foundInstructor){
          giveWarning(User,foundInstructor.username,"Did not grade all students.")
        })
      }
  }) 
}


async function analyzeClassGPA (Class, User,Complaint, year, semester){
  Class.find({year:year, semester:semester}, function(err, foundClasses){
    for(var i = 0; i<foundClasses.length; i++){
      var classGPA = 0;
      var classGrade = [];
      for(var j = 0; j < foundClasses[i].students.length; j++){
          if(foundClasses[i].students[j].grade != 'W' && foundClasses[i].students[j].grade !=''){
            classGrade.push(foundClasses[i].students[j].grade);
          }
      }
      
      if(classGrade.length > 0){
        classGPA = utility.calculateClassGPA(classGrade)
        if(classGPA > 3.5 || classGPA < 2.5){
          reportObnormalGrade(Complaint, 
            foundClasses[i].course_shortname,
            foundClasses[i].section,
            foundClasses[i].instructor,
            classGPA)
        }
      }
  }   
  })
}


function reportObnormalGrade(Complaint,className, section,instructor, GPA){
    const newComplaint = new Complaint({
        title:"Detected Obnormal Grade! ",
        complaintFrom:"System",
        complaintAbout:instructor,
        className:className,
        detail: "Class " + className + section + " has obnormal grade from " + instructor+ ".\n Class GPA: " + GPA,
        decided:false,
        isFromSystem :true
    })

    newComplaint.save();
}


function findStudentFailedTwice(Class, User,Complaint, year, semester){
  User.find({role:"student"},function(err, foundStudents){
      if(err) console.log(err);
      else{
        for(var i = 0; i<foundStudents.length; i++){
          if(utility.ifFailedTwice(foundStudents[i])){
              terminateStudent(User,foundStudents[i]);
          }
        } 
      }
  })
}

function terminateStudent(User,student){
  console.log(student.fullname + " will be terminated ")
  User.findOneAndUpdate({username:student.username}, {terminated:true},function(err){
    if(err) console.log(err);
  });
}

function analyzeStudentsGPA(Class,User,Complaint,year, semester){
    User.find({role:"student"}, function(err, foundStudents){
        for(var i = 0; i< foundStudents.length; i++){
          if(foundStudents[i].taken_class.length > 0){
              currentSemesterClasses = []  
              allTakanClasses = []
              for(var j = 0; j<foundStudents[i].taken_class.length; j++){
                allTakanClasses.push(foundStudents[i].taken_class[j]);
                if(foundStudents[i].taken_class[j].year == year && foundStudents[i].taken_class[j].semester == semester){
                  currentSemesterClasses.push(foundStudents[i].taken_class[j])
                }
              }  
              currentSemesterGPA = utility.calculateGPAFromTakenClasses(currentSemesterClasses)
              overallGPA = utility.calculateGPAFromTakenClasses(allTakanClasses)
              if(overallGPA < 2){
                terminateStudent(User,foundStudents[i]);
              }else if (overallGPA >= 2 && overallGPA <= 2.25){
                giveWarning(User, foundStudents[i].username,"Your GPA is low, Please make an appointment of interview with registrar.")
              }else if (currentSemesterGPA > 3.75 || overallGPA > 3.5){
                giveHonor(User, foundStudents[i].username, "Your academic record is excellen. -- "+ year.toString() +", " + semester );
              }else{}
              User.findOneAndUpdate({username:foundStudents[i].username}, {GPA:overallGPA}, function(err){});
          }
        } 
    })  
}   

function giveHonor(User, username, reason){
    User.updateOne({username:username}, {$push:{ honor : reason }, $pop:{warning:-1}}, function(err){
      if(err) console.log(err);
      else console.log("You are rewarded," + username);
    })
}


async function getGraduationApplications(GraduationApplication){
    var applications;
    GraduationApplication.find({decided:false}, async function(err, foundApplications){
      if(err) console.log(err);
      else{
        applications = foundApplications;
      }
    })
    await sleep();
    return applications;
}


async function getStudentObjectsByEmails(User, emails){
  var students = [];
  for(var i = 0; i<emails.length; i++){
    User.find({username:emails[i]}, function(err, foundStudent){
      students.push(foundStudent);
    })
  }
  await sleep();
  return students;
}

async function approveGraduation(GraduationApplication, User, applicationID, studentEmail){
  GraduationApplication.findOneAndUpdate({_id:applicationID},{decided:true},function(err){
    if(err) console.log(err);
    else{
      User.findOneAndUpdate({username:studentEmail}, {masterDegreeObtained: true},function(err){
        if(err) console.log(err);
      })
    }
  })
}


async function denyGraduation(GraduationApplication, User, applicationID, studentEmail){
 
  GraduationApplication.findOneAndUpdate({_id:applicationID},{decided:true},function(err){
    if(err) console.log(err);
    else{
      giveWarning(User,studentEmail,"Reckless graduation application. ")
    }
  })
}


function warnStudentsWithTooLessCourses(Class, User, Complaint,year, semester){
  console.log("inside warnStudents with too less courses method")
  User.find({role:"student"}, function(err, foundStudents){
    if(err) console.log(err);
    else{
      for (var i = 0; i < foundStudents.length; i++){
        if(foundStudents[i].enrolled_class.length == 1){
          console.log()
          giveWarning(User,foundStudents[i].username,"You number of classes you enrolled is too less.")
        }
      }
    }
  })
}

function cancelClassesWithTooLessStudents(Class, User, Complaint, year, semester){
    Class.find({year:year, semester:semester}, function(err, foundClasses){
      if(err) console.log(err);

      for(var i = 0; i < foundClasses.length; i++){
        if(foundClasses[i].students.length < 5){
          Class.findOneAndUpdate({_id:foundClasses[i].id}, {canceled:true, students:[]}, function(err){})

          for(var j = 0; j<foundClasses[i].students.length; j++){
            User.updateOne({username:foundClasses[i].students[j].email},
              {specialPeriod:true, $pull:{enrolled_class:foundClasses[i]._id.valueOf()}}, function(err){})
          }

          User.findOneAndUpdate({fullname:foundClasses[i].instructor}, {$pull:{assigned_class:foundClasses[i]._id.valueOf()}}, function(err){})

          User.findOne({fullname:foundClasses[i].instructor}, function(err, foundInstructor){
            if(err) console.log(err)
            else{
              if(foundInstructor.assigned_class.length == 0){
                  suspendUser(User, foundInstructor.username)
              }else{
                giveWarning(User, foundInstructor.username,"Your class has been cancel because there were less than 5 students enrolled")
              }
            }
          }) 
        }
      }
    })
}
