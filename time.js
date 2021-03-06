
/*
Semester peroid:
  classSetUp : 2021/8/10 - 2021/8/15
  courseRegistration: 2021/8/16 - 2021/8/20
  classRunning: 2021/08/21 - 2021/12/20
  grading: 2021/12/21 - 2021/12-25
*/

var classSetUpBegin;
var classSetUpEnd;
var courseRegistrationBegin;
var courseRegistrationEnd;
var classRunningBegin;
var classRunningEnd;
var gradingPeroidBegin;
var gradingPeroidEnd;
var specialPeriodEnd;

exports.initializePeriod = function(){
  this.classSetUpBegin = new Date("2021-08-10T00:00:00");
  this.classSetUpEnd = new Date("2021-08-15T00:00:00")
  this.courseRegistrationBegin = new Date("2021-08-16T00:00:00")
  this.courseRegistrationEnd = new Date("2021-08-20T00:00:00")
  this.classRunningBegin = new Date("2021-08-21T00:00:00")
  this.classRunningEnd = new Date("2021-12-20T00:00:00")
  this.gradingPeriodBegin = new Date("2021-12-21T00:00:00")
  this.gradingPeriodEnd = new Date("2021-12-25T00:00:00")
  this.specialPeriodEnd = new Date("2021-08-25T00:00:00")
}


exports.isValidPeriod = function(classSetUpBegin, classSetUpEnd, courseRegistrationBegin, courseRegistrationEnd,
  classRunningBegin, classRunningEnd, gradingPeriodBegin, gradingPeriodEnd, specialPeriodEnd){
    return (classSetUpBegin < classSetUpEnd && classSetUpEnd < courseRegistrationBegin && courseRegistrationBegin < courseRegistrationEnd && 
      courseRegistrationEnd < classRunningBegin && classRunningBegin < classRunningEnd && classRunningEnd < gradingPeriodBegin && gradingPeriodBegin < gradingPeriodEnd && specialPeriodEnd >classRunningBegin)
}


exports.setPeriods = function(classSetUpBegin, classSetUpEnd, courseRegistrationBegin, courseRegistrationEnd,
   classRunningBegin, classRunningEnd, gradingPeriodBegin, gradingPeriodEnd, specialPeriodEnd){
   this.classSetUpBegin= new Date(classSetUpBegin + "T00:00:00");
   this.classSetUpEnd= new Date(classSetUpEnd + "T00:00:00");
   this.courseRegistrationBegin= new Date(courseRegistrationBegin + "T00:00:00");
   this.courseRegistrationEnd= new Date(courseRegistrationEnd + "T00:00:00");
   this.classRunningBegin= new Date(classRunningBegin + "T00:00:00");
   this.classRunningEnd= new Date(classRunningEnd + "T00:00:00");
   this.gradingPeriodBegin= new Date(gradingPeriodBegin + "T00:00:00");
   this.gradingPeriodEnd= new Date(gradingPeriodEnd + "T00:00:00");
   this.specialPeriodEnd= new Date(specialPeriodEnd + "T00:00:00");
}

// const classSetUpBegin = new Date("2021-08-10T00:00:00");
// const classSetUpEnd = new Date("2021-08-15T00:00:00")
// const courseRegistrationBegin = new Date("2021-08-16T00:00:00")
// const courseRegistrationEnd = new Date("2021-08-20T00:00:00")
// const classRunningBegin = new Date("2021-08-21T00:00:00")
// const classRunningEnd = new Date("2021-12-20T00:00:00")
// const gradingPeroidBegin = new Date("2021-12-21T00:00:00")
// const gradingPeroidEnd = new Date("2021-12-25T00:00:00")
// const specialPeriodEnd = new Date("2021-08-25T00:00:00")

exports.classSetUpBegin = classSetUpBegin;
exports.classSetUpEnd = classSetUpEnd;
exports.courseRegistrationBegin = courseRegistrationBegin;
exports.courseRegistrationEnd = courseRegistrationEnd;
exports.classRunningBegin = classRunningBegin;
exports.classRunningEnd = classRunningEnd;
exports.gradingPeriodBegin = gradingPeroidBegin;
exports.gradingPeriodEnd = gradingPeroidEnd;
exports.specialPeriodEnd = specialPeriodEnd;


exports.today = new Date();
exports.setToday = setToday;
exports.getPeriod = getPeriod;
exports.convertSchedule = convertSchedule;
exports.conflict = conflict;

//set today to custom date for testing purpose
function setToday(customDate){
    return new Date(customDate);
}


//find which period is today
function getPeriod(day){
   var period ="N/A";
   if(day >= this.classSetUpBegin && day <= this.classSetUpEnd ){
     period = "classSetUp";
   }else if (day >= this.courseRegistrationBegin && day <= this.courseRegistrationEnd){
     period = "courseRegistration";
   }else if (day >= this.classRunningBegin && day <= this.classRunningEnd){
     period = "classRunning";
   }else if (day >= this.gradingPeriodBegin && day <= this.gradingPeriodEnd){
     period = "grading";
   }else if (day > this.gradingPeriodEnd){
     period = "afterGrading";
   }else {
   
   }

   return period;
}

function convertSchedule(newClass){
  var newClassSchedule = [];
  newClassSchedule.push(  [newClass.schedule[0].day, newClass.schedule[0].startTime, newClass.schedule[0].endTime]  );
  newClassSchedule.push(  [newClass.schedule[1].day, newClass.schedule[1].startTime, newClass.schedule[1].endTime]  );
  return newClassSchedule;
}


function conflict(schedules, newClassSchedule){
    for (var i = 0; i < schedules.length; i++){
        temp = schedules[i];
        for( var j = 0; j < newClassSchedule.length; j++){
          //if scheduled day is different day, skip
           if(temp[0] != newClassSchedule[j][0]){
             continue;
           }else{
             //if new class start time is between any old class start and end time.
             //or new class end time is between any old class start and end time, conflit
             var begin_1 = parseInt(newClassSchedule[j][1].replace(":",""))
             var begin_2 = parseInt(temp[1].replace(":",""))
             var end_1 = parseInt(newClassSchedule[j][2].replace(":",""))
             var end_2 = parseInt(temp[2].replace(":",""));
             if( (begin_1 >= begin_2 && begin_1 < end_2) || (end_1 > begin_2 && end_1<= end_2)){
               return true;
             }
           }
        }
    }
    return false;
}