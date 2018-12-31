var express = require('express'),
    mongoose = require('mongoose'),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    localStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    user = require("./models/user");

mongoose.connect("mongodb://localhost/auth_demo_app");

var app = express();
app.set('view engine', 'ejs'); 

app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
    secret: "It me",
    resave: false,
    saveUninitialized: false
}));

//Initializing passportJs

app.use(passport.initialize());
app.use(passport.session());

//Serialization
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//Routes

app.get("/register", function(req, res) {
    res.render("register");
});

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});

app.get("/", function(req, res) {
    res.render("home");
});

app.post("/register", function(req,res) {
    req.body.username
    req.body.password
    user.register(new user({username: req.body.username}), req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/secret");
        });
    });
});


app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res) {
    
});

app.get("/logout", function(req, res) {
    req.logOut();
    res.redirect("/");
});

//Middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect("/login");
}

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log("App is running on port " + port);
});