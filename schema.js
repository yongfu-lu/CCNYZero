
const mongoose = require("mongoose");

exports.getClassSchema = function(){
    //console.log("getting classSchema");
    return new mongoose.Schema({
        department:String,            //example: computer science 
        course_fullname:String,       //example: Algorithm
        course_shortname:String,      // CSC22000
        section: String,              //example: A, B, K
        credit: Number,         
        instructor:String,            // name of professor ??
        students: [],           // array of student's name or id??
        max_capacity: Number,   
        schedule: [],      
        rating: Number,
        prerequisites: [],      // [array of course_name] ??
        review:[],              //class review _id ??
        wait_list:[]
    });
}


exports.getApplicantSchema = function(){
    //console.log("This is applicant schema from schema.js")
    return new mongoose.Schema ({
        email:String,
        fullname:String,
        role:String,        //admin, student, instructor, visitor
        major: String,
        GPA:Number,
        decided: Boolean,   //only show undecided application to admin's message box
        department:String,
        selfStatement:String,
    });

}

exports.getUserSchema = function(){
    //console.log("This is user schema from schema.js")
    return new mongoose.Schema ({
        email:String,
        password: String,
        fullname:String,
        role:String,        //admin, student, instructor, visitor
        GPA:Number,         
        enrolled_class: [],
        taken_class: [],
        required_course: [],      //required courses for graduation
        assigned_class:[],        //when user role is professor, assigned class is what class he teaching
        wrote_review:[],
        firstLogin: Boolean,
        suspended:Boolean,
        warning:[],
        honor:Number
    });
    
}


exports.getClassReviewSchema = function(){
    //console.log("getting classReviewSchema");
    return new mongoose.Schema({
        writer_name:String,           //student name
        writer_email:String,          //student email
        write_to_classID: String,  // class id??
        write_to_className: String, //class name??
        rate: Number,
        review: String
    })
}

exports.getComplaintSchema = function(){
    return new mongoose.Schema({
        complaintFrom: String,
        complaintFromName: String,
        complaintFromRole:String,
        complaintAbout: String,
        complaintAboutRole: String,
        className: String,
        detail:String,
        decided: Boolean
    });
}