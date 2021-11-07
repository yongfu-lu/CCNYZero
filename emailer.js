const schema = require(__dirname + "/schema.js");
const userSchema = schema.getUserSchema();


const nodemailer = require("nodemailer");
const tranporter = nodemailer.createTransport({
        service: "hotmail",
        auth:{
            user:"ccnyzero@hotmail.com",
            pass:"brooklyn123"
        }
})

// const options = {
//     from: "ccnyzero@hotmail.com",
//     to:"reveiver's email address",
//     subject:"Email from nodemailer",
//     text:"This is an email sent by nodemailer!"
// };

// exports.sendEmail = function(){
//     tranporter.sendMail(options,function(err,info){
//         if(err){
//             console.log(err);
//             return;
//         }
//         console.log("sent : "+ info.response);
//     })
// }

exports.sendRejectEmail = function(email, name){
    const options = {
        from: "ccnyzero@hotmail.com",
        to:email,
        subject:"You are rejected by CCNY",
        text:"Hello "+ name + ", thank you for applying for CCNY. Unfortunately, we cannot accept you."
    };
    
    tranporter.sendMail(options, function(err,info){
        if(err){
            console.log(err);
            return;
        }
        console.log("sent : "+ info.response);
    })
}


exports.sendAcceptEmail = function(email, name, gpa, User){
    var newStudentID = Math.floor(Math.random()*10000).toString();
    var newStudentEmail = name+newStudentID+"@ccny";
    var password = "123";

    const options = {
        from: "ccnyzero@hotmail.com",
        to:email,
        subject:"You are Accepted by CCNY",
        text:"Congratulations "+ name + "! You are accepted by CCNY. Your CCNY ID is "+ newStudentID + ". Your CCNY email is "+ newStudentEmail + " and your password is "+ password
    };

    tranporter.sendMail(options, function(err,info){
        if(err){
            console.log(err);
            return;
        }
        console.log("sent : "+ info.response);
    })

    User.register({
        CCNYID:newStudentID,
        username:newStudentEmail,
        fullname:name,
        role:"student",
        GPA:0,
        warning:[],
        suspended:false,
        takan_class:[],
        enrolled_class:[],
        firstLogin:true,
        wrote_review :[],
        terminated : false,
        honor : [],
        masterDegreeObtained : false,
        specialPeriod : false,
        balanceOwe:0,
        }, password, function(err,user){
            if(err){
                console.log(err);
            }else{
            console.log("new CCNY User has been added")
            }
     })
     
}