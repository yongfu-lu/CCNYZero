
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

const userRoles = {
    registrar: "registrar",
    instructor: "instructor",
    student:"student",
    visitor:"visitor"
}
/**************** add and update data for testing here **********/

 

/*********** All route from here ********/
app.get("/",function(req, res){
    res.render("login");
})

app.get("/home", function(req,res){
    User.find({role:"student"}, function(err,foundStudents){
        if(err){
            console.log(err);
        }else{
            res.render("home",{myname:req.user.fullname, allStudents:foundStudents});
        }
    })
    
})

app.get("/register",function(req, res){
    res.render("register");
})

app.get("/test", function(req,res){
    res.render("test", {myname: req.user.fullname});
})


app.post("/register", function(req, res){
    User.register({username:req.body.username}, req.body.password, function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/");
            })
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
                console.log(user.username);
                res.redirect("/home");
                
            })
        }
    })
})


app.listen(3000, function(){
    console.log("Server is running on part 3000");
})