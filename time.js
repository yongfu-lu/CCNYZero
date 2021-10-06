
/*
Semester peroid:
  class set up : 2021/8/10 - 2021/8/15
  register: 2021/8/16 - 2021/8/20
  class running: 2021/08/21 - 2021/12/20
  grading: 2021/12/21 - 2021/12-25
*/


const classSetUpBegin = new Date("2021-08-10T00:00:00");
const classSetUpEnd = new Date("2021-08-15T00:00:00")
const courseRegistrationBegin = new Date("2021-08-16T00:00:00")
const courseRegistrationEnd = new Date("2021-08-20T00:00:00")
const classRunningBegin = new Date("2021-08-21T00:00:00")
const classRunningEnd = new Date("2021-12-20T00:00:00")
const gradingPeroidBegin = new Date("2021-12-21T00:00:00")
const gradingPeroidEnd = new Date("2021-12-25T00:00:00")

exports.classSetUpBegin = classSetUpBegin;
exports.classSetUpEnd = classSetUpEnd;
exports.courseRegistrationBegin = courseRegistrationBegin;
exports.courseRegistrationEnd = courseRegistrationEnd;
exports.classRunningBegin = classRunningBegin;
exports.classRunningEnd = classRunningEnd;
exports.gradingPeroidBegin = gradingPeroidBegin;
exports.gradingPeroidEnd = gradingPeroidEnd;

exports.today = new Date();
exports.setToday = setToday;
exports.getPeriod = getPeriod;

//set today to custom date for testing purpose
function setToday(customDate){
    return new Date(customDate);
}


//find which period is today
function getPeriod(day){
   var period;
   if(day >= classSetUpBegin && day <= classSetUpEnd ){
     period = "classSetUp";
   }else if (day >= courseRegistrationBegin && day <= courseRegistrationEnd){
     period = "courseRegistration";
   }else if (day >= classRunningBegin && day <= classRunningEnd){
     period = "classRunning";
   }else if (day >= gradingPeroidBegin && day <= gradingPeroidEnd){
     period = "grading";
   }else {
     period = "break";
   }

   return period;
}