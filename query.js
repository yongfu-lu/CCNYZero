const mongoose = require("mongoose");
const schema = require(__dirname + "/schema.js");

const userSchema = schema.getUserSchema();
const classSchema = schema.getClassSchema();
const applicantSchema = schema.getApplicantSchema();


exports.getTopStudents = getTopStudents;
exports.getTopClasses = getTopClasses;
exports.getWorstClasses = getWorstClasses;
exports.getApplications = getApplications;

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
  
  async function getApplications(Applicant) {
    var applications;
    Applicant.find({decided:false}, function(err, foundApplications){
      if(err){
        console.log(err);
      }else{
        applications = foundApplications;
      }
    })
    await sleep();
    return applications;
  } 