
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require("passport-local-mongoose");
const schema = require(__dirname + "/schema.js");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(session({
    secret : process.env.SECRET,
    resave:false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://TeamQ:brooklyn2021@cluster0.w84rk.mongodb.net/CCNYZeroDB");

const userSchema = schema.getUserSchema();
const classSchema = schema.getClassSchema();

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
const Class = new mongoose.model("Class", classSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/**************** add and update data for testing here **********/

//this object is created for avoiding typo purpose. Used when create new users
const userRoles = {
    registrar: "registrar",
    instructor: "instructor",
    student:"student",
    visitor:"visitor"
}
 
/*********** All route from here ********/
app.get("/",function(req, res){
    if(req.user){
        res.redirect("/" + req.user.role +"home");
    }else{
        res.render("login");
    }
})

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})

// app.get("/home", function(req,res){
//     User.find({role:"student"}, function(err,foundStudents){
//         if(err){
//             console.log(err);
//         }else{
//             res.render("home",{myname:req.user.fullname, allStudents:foundStudents, myrole:req.user.role});
//         }
//     })
// })

app.get("/studentHome",function(req,res){
    if(!req.isAuthenticated() || req.user.role != 'student'){
        res.redirect("/logout");
    }else{
        res.render("studentHome", {myname:req.user.fullname});
    }
})

app.get("/registrarHome",function(req,res){
    if(!req.isAuthenticated() || req.user.role != 'registrar'){
        res.redirect("/logout");
    }else{
        res.render("registrarHome", {myname:req.user.fullname});
    }
})

app.get("/visitorHome",function(req,res){
    if(!req.isAuthenticated() || req.user.role !='visitor'){
        res.redirect("/logout");
    }else{
        res.render("visitorHome", {myname:req.user.fullname});
    }
})

app.get("/instructorHome",function(req,res){
    if(!req.isAuthenticated() || req.user.role !='instructor'){
        res.redirect("/logout");
    }else{
        res.render("instructorHome", {myname:req.user.fullname});
    }
})

app.get("/register",function(req, res){
    res.render("register");
})


app.post("/register", function(req, res){
    //when user register, default role is visotor, default GPA is 3.0
    User.register({username:req.body.username, fullname:req.body.fullname,role:userRoles.visitor,GPA:3.0}, req.body.password, function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
                res.redirect("/");
        }
    })
})


app.post("/", function(req,res){
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req, res, function(){
                
                User.findOne({username:user.username}, function(err, foundUser){
                    if(err){
                        console.log(err)
                    }else{
                        res.redirect("/" + foundUser.role +"home");
                    }
                })
            })
        }
    })
})


app.listen(3000, function(){
    console.log("Server is running on part 3000");
})