
const mongoose = require("mongoose");

exports.getClassSchema = function(){
    return new mongoose.Schema({
        department:String,            
        course_fullname:String,       
        course_shortname:String,      
        section: String,              
        credit: Number,         
        instructor:String,            
        year: Number,
        semester: String,
        students: [],           
        max_capacity: Number,   
        schedule: [],      
        rating: Number,
        prerequisites: [],      
        review:[],              
        wait_list:[],
        canceled:Boolean
    });
}


exports.getApplicantSchema = function(){
    return new mongoose.Schema ({
        email:String,
        fullname:String,
        role:String,        
        major: String,
        GPA:Number,
        decided: Boolean,   
        department:String,
        selfStatement:String,
    });

}

exports.getUserSchema = function(){
    return new mongoose.Schema ({
        CCNYID:String,
        email:String,
        password: String,
        fullname:String,
        role:String,        
        GPA:Number,         
        enrolled_class: [],
        taken_class: [],
        required_course: [],      
        assigned_class:[],        
        wrote_review:[],
        firstLogin: Boolean,
        suspended:Boolean,
        warning:[],
        honor:[],
        terminated:Boolean,
        masterDegreeObtained: Boolean,
        specialPeriod:Boolean,
        balanceOwe:Number,
        tabooWords: [],
    });
    
}


exports.getClassReviewSchema = function(){
    return new mongoose.Schema({
        writer_name:String,           
        writer_email:String,          
        write_to_classID: String,  
        write_to_className: String, 
        rate: Number,
        review: String
    })
}

exports.getComplaintSchema = function(){
    return new mongoose.Schema({
        title:String,
        complaintFrom: String,
        complaintFromName: String,
        complaintFromRole:String,
        complaintAbout: String,
        complaintAboutRole: String,
        className: String,
        detail:String,
        decided: Boolean,
        isFromSystem:Boolean
    });
}

exports.getGraduationApplycationSchema = function(){
    return new mongoose.Schema({
        studentEmail: String,
        studentName: String,
        graduationYear:Number,
        graduationSemester:String,
        decided:Boolean
    })
}