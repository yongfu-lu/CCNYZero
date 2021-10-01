require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require("passport-local-mongoose");
const schema = require(__dirname + "/schema.js");
const emailer = require(__dirname + "/emailer.js");

const app = express();

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://TeamQ:brooklyn2021@cluster0.w84rk.mongodb.net/CCNYZeroDB");
// mongoose.connect("mongodb://localhost:27017/LocalCunyZeroDB",{useNewUrlParser: true});

const userSchema = schema.getUserSchema();
const classSchema = schema.getClassSchema();
const applicantSchema = schema.getApplicantSchema();

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
const Class = new mongoose.model("Class", classSchema);
const Applicant = new mongoose.model("Applicant", applicantSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/**************** add and update data for testing here **********/

//this object is created for avoiding typo purpose. Used when create new users
const userRoles = {
  registrar: "registrar",
  instructor: "instructor",
  student: "student",
  visitor: "visitor"
}

// three grobal variables that use in vistor homepage
var topStudents;
var topClasses;
var worstClasses;

//tempelate to add a user to user collection
// User.register({
//    username:"spider@ccny",
//    fullname:"Spider Man",
//    role:userRoles.instructor,
//    assigned_class:["CSC22000","CSC21700"]
//    }, "123", function(err,user){
//        if(err){
//            console.log(err);
//        }else{
//        console.log("new user has been added")
//        }
// })

/*********** All route from here ********/

//if user is not login yet, go to normal visitor homepage, otherwise go to their homepage
app.get("/", findTopStudents, findTopClasses, findworstClasses, renderHomePage);


//*********************Followings are methods to seach the top items from DB **************

//build the grobal var topStudents
function findTopStudents(req, res, next) {
  User.find({
    role: "student"
  }).limit(3).sort({
    GPA: -1
  }).exec(function(err, foundStudents) {
    if (err) {
      console.log(err);
    } else {
      topStudents = foundStudents;
      return next();
    }
  });
}

//build the grobal var TopClasses
function findTopClasses(req, res, next) {
  Class.find().limit(3).sort({
    rating: -1
  }).exec(function(err, foundClasses) {
    if (err) {
      console.log(err);
    } else {
      topClasses = foundClasses;
      return next();
    }
  });
}

//build the grobal var worstClasses
function findworstClasses(req, res, next) {
  Class.find().limit(3).sort({
    rating: 1
  }).exec(function(err, foundClasses) {
    if (err) {
      console.log(err);
    } else {
      worstClasses = foundClasses;
      return next();
    }
  })
}


function renderHomePage(req, res) {
  if (req.user) {
    res.redirect("/" + req.user.role + "home");
  } else {
    res.render("visitorHome", {
      topStudents: topStudents,
      worstClasses: worstClasses,
      topClasses: topClasses
    });
  }
}


//********************************************************************************




//if user already login, redirect to their homepage, no need to log in again
app.get("/login", function(req, res) {
  if (req.user) {
    res.redirect("/" + req.user.role + "home");
  } else {
    res.render("login");
  }
})

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
})

//if non-student user try to access student homepage by typing url in the broswer, user will be directed to visitor homepage
app.get("/studentHome", function(req, res) {
  if (!req.isAuthenticated() || req.user.role != 'student') {
    res.redirect("/logout");
  } else {
    res.render("studentHome", {
      myname: req.user.fullname
    });
  }
})

app.get("/registrarHome", function(req, res) {
  if (!req.isAuthenticated() || req.user.role != 'registrar') {
    res.redirect("/logout");
  } else {
    res.render("registrarHome", {
      myname: req.user.fullname
    });
  }
})


app.get("/instructorHome", function(req, res) {
  if (!req.isAuthenticated() || req.user.role != 'instructor') {
    res.redirect("/logout");
  } else {
    res.render("instructorHome", {
      myname: req.user.fullname
    });
  }
})


app.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {

        User.findOne({
          username: user.username
        }, function(err, foundUser) {
          if (err) {
            console.log(err)
          } else {
            res.redirect("/" + foundUser.role + "home");
          }
        })
      })
    }
  })
})

// ********************** apply-related methods *******************

app.get("/applyStudent", function(req, res) {
  res.render("applyStudent");
})

app.get("/applyInstructor", function(req, res) {
  res.render("applyInstructor");
})

app.post("/applyStudent", function(req, res) {

  const newApplicant = new Applicant({
    email: req.body.applicantEmail,
    fullname: req.body.applicantName,
    major: req.body.major,
    GPA: req.body.applicantGPA
  });
  newApplicant.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Add a new applicant successfully.");
      res.redirect("/");
    }
  });

});








app.listen(3000, function() {
  console.log("Server is running on part 3000");
})
