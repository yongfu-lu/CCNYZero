const nodemailer = require("nodemailer");
const tranporter = nodemailer.createTransport({
        service: "hotmail",
        auth:{
            user:"ccnyzero@hotmail.com",
            pass:"brooklyn123"
        }
})

const options = {
    from: "ccnyzero@hotmail.com",
    to:"reveiver's email address",
    subject:"Email from nodemailer",
    text:"This is an email sent by nodemailer!"
};

exports.sendEmail = function(){
    tranporter.sendMail(options,function(err,info){
        if(err){
            console.log(err);
            return;
        }
        console.log("sent : "+ info.response);
    })
}