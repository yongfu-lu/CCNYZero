const mongoose = require("mongoose");
const schema = require(__dirname + "/schema.js");

const userSchema = schema.getUserSchema();
const classSchema = schema.getClassSchema();
const applicantSchema = schema.getApplicantSchema();

exports.getTopStudents = getTopStudents;
exports.getTopClasses = getTopClasses;
exports.getWorstClasses = getWorstClasses;
exports.getStudentApplications = getStudentApplications;
exports.getInstructorApplications = getInstructorApplications;
exports.changePassword = changePassword;
exports.getTotalStudents = getTotalStudents;
exports.getAvailableInstructors = getAvailableInstructors;
exports.getAllClasses = getAllClasses;
exports.getClassDetail = getClassDetail;
exports.getEnrolledClasses = getEnrolledClasses;
exports.getEnrolledSchedules = getEnrolledSchedules;
exports.addStudentToClass = addStudentToClass;
exports.addStudentToWaitList = addStudentToWaitList;
exports.getEnrolledClassObjects = getEnrolledClassObjects;
exports.giveWarning = giveWarning;
exports.checkWarningNumber = checkWarningNumber;
exports.suspendUser =suspendUser;

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
  Class.find()
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
  Class.find()
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

async function getAllClasses(Class) {
  var classes;
  Class.find().exec(async function (err, foundClasses) {
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
    Class.updateOne({_id:classID}, {$push:{students:{email: username, fullname:fullname, grade:""}}}, function(err){
      if(err){
        console.log(err);
      }
    })
}

async function addStudentToWaitList(Class,classID, username){
  console.log("in query");
  console.log(username);
  console.log(classID);
  Class.updateOne({_id:classID}, {$push: {wait_list:username}},function(err){
    if(err){
      console.log(err);
    }
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

