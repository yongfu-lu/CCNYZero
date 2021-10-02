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
    var newStudentID = Math.floor(Math.random()*1000).toString();
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
        username:newStudentEmail,
        fullname:name,
        role:"student",
        GPA:gpa,
        firstLogin:true,
        }, password, function(err,user){
            if(err){
                console.log(err);
            }else{
            console.log("new CCNY User has been added")
            }
     })
     
}