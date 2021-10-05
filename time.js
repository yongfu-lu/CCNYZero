
/*
Semester peroid:
  class set up : 2021/8/10 - 2021/8/15
  register: 2021/8/16 - 2021/8/20
  class running: 2021/08/21 - 2021/12/20
  grading: 2021/12/21 - 2021/12-25
*/

exports.classSetUpBegin = new Date("2021-08-10T00:00:00");
exports.classSetUpEnd = new Date("2021-08-15T00:00:00")
exports.courseRegistrationBegin = new Date("2021-08-16T00:00:00")
exports.courseRegistrationEnd = new Date("2021-08-20T00:00:00")
exports.classRunningBegin = new Date("2021-08-21T00:00:00")
exports.classRunningEnd = new Date("2021-12-20T00:00:00")
exports.gradingPeroidBegin = new Date("2021-12-21T00:00:00")
exports.gradingPeroidEnd = new Date("2021-12-25T00:00:00")
exports.today = new Date();
exports.setToday = setToday;

//set today to custom date for testing purpose
function setToday(customDate){
    return new Date(customDate);
}