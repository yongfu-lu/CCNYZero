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


exports.passTabooWordsCheck = passTabooWordsCheck;
exports.gradeAnalyze = gradeAnalyze;
exports.calculateClassGPA = calculateClassGPA;

function passTabooWordsCheck(text){
    var count = 0;
    for(var i = 0; i<tabooWords.length; i++){
        var re = new RegExp(tabooWords[i],'g');
        count += (text.match(re) || []).length;
    }
    if(count > 2){
        return false;
    }else{
        for(var i = 0; i<tabooWords.length; i++){
            var re = new RegExp(tabooWords[i],'g');
            text = text.replace(re, '*');
        }
        return text;
    }
}


async function gradeAnalyze(Class, User, Complaint, year, semester){
    console.log("Analyzing grade")
    //1. after grading, if instructor did not grade all students, he will get warn
    query.didNotGradeAllStudents(Class, User, year, semester);
    
    //2. if class GPA is > 3.5 or <2.5, send message to admin, admin can decide warn or not
    query.analyzeClassGPA(Class, User, Complaint,year, semester);
}
 

function calculateClassGPA(classGrade){
    var sum = 0;
    for(var i = 0; i<classGrade.length; i++){
        sum += gradePoint[classGrade[i]];
    }
    
    return sum / classGrade.length
}