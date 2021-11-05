const query = require(__dirname + "/query.js");
const tabooWords = ["fuck","shit"];
const gradePoint = {
    "A+":4,
    "A":4,
    "A-":3.7,
    "B+":3.3,
    "B":3.0,
    "B-":2.7,
    "C+":2.3,
    "C":2.0,
    "C-":1.7,
    "D+":1.3,
    "D":1.0,
    "D-":0.7,
    "F":0
}

exports.required_courses = ["CSC10300","CSC11300",
"CSC21700","CSC22000",
"CSC22100", "CSC30100",
"CSC33200","CSC33500"]

exports.passTabooWordsCheck = passTabooWordsCheck;
exports.gradeAnalyze = gradeAnalyze;
exports.calculateClassGPA = calculateClassGPA;
exports.ifFailedTwice = ifFailedTwice;
exports.calculateGPAFromTakenClasses = calculateGPAFromTakenClasses;
exports.classAnalyze = classAnalyze;
exports.editTabooWord =editTabooWord;

function passTabooWordsCheck(text){
    var count = 0;
    for(var i = 0; i<tabooWords.length; i++){
        var re = new RegExp(tabooWords[i],'g');
        count += (text.match(re) || []).length;
    }
    return count;
}

function editTabooWord(text){
    for(var i = 0; i<tabooWords.length; i++){
        var re = new RegExp(tabooWords[i],'g');
        text = text.replace(re, '*');
    }
    return text;  
}

/** after grade period, analyze grade **/
async function gradeAnalyze(Class, User, Complaint, year, semester){
    console.log("Analyzing grade")
    //1. after grading, if instructor did not grade all students, he will get warn
    query.didNotGradeAllStudents(Class, User, year, semester);
    
    //2. if class GPA is > 3.5 or <2.5, send message to admin, admin can decide warn or not
    query.analyzeClassGPA(Class, User, Complaint,year, semester);

    /*3. student GPA less than 2 will be terminate, 
      between 2 and 2.25 will receive a warning demanding interview
      currentSemester GPA > 3.75 or overall GPA > 3.6 receive a honor, one honor cancel one warning. */
    query.analyzeStudentsGPA(Class,User,Complaint,year, semester);
    
    
    //4. student fail same course twice will be terminated
    query.findStudentFailedTwice(Class, User, Complaint, year, semester);
}
 

function calculateClassGPA(classGrade){
    var sum = 0;
    for(var i = 0; i<classGrade.length; i++){
        sum += gradePoint[classGrade[i]];
    }
    
    return sum / classGrade.length
}

function ifFailedTwice(student){
    taken_class = student.taken_class;
    failed_class = []
    for(var i = 0; i<taken_class.length; i++){
        if(taken_class[i].grade == 'F'){
            if(failed_class.includes(taken_class[i].course_shortname)){
                return true;
            }
            failed_class.push(taken_class[i].course_shortname);
        }
    }
    return false;
}

function calculateGPAFromTakenClasses(classes){
    var totalPoint = 0;
    var totalCredit = 0;
    for(var i = 0; i<classes.length; i++){
        if(classes[i].grade =='W'){
            continue;
        }
        totalCredit += classes[i].credit
        totalPoint += classes[i].credit * gradePoint[classes[i].grade]
    }
    return (totalPoint / totalCredit).toFixed(3);
}


/** When class running period starts, analyze classes **/
function classAnalyze(Class, User, Complaint, year, semester){
    console.log("Inside classAnalyze")
    //1. students with less than 2 coourses will be warned
    //query.warnStudentsWithTooLessCourses(Class, User, Complaint, year, semester);

    //2. course less than 5 students will be canceled.
    //query.cancelClassesWithTooLessStudents(Class, User,Complaint,year, semester);
}