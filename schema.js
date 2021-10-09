
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
        prerequisites: [String],      // [array of course_name] ??
        review:[String],              //class review _id ??
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
        suspended:Boolean
    });
    
}


exports.getClassReviewSchema = function(){
    //console.log("getting classReviewSchema");
    return new mongoose.Schema({
        writer:String,          //student name ?? id??
        write_to_class: String,  // class id??
        ranking: Number,
        review: String
    })
}