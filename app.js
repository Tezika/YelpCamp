var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    SeedDB = require("./seeds");

var campgroundRouter = require("./routes/campgrounds"),
    commentsRouter = require("./routes/comments"),
    authRouter = require("./routes/index");
    
mongoose.connect(process.env.DATABASEURL);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// SeedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Tezika win the cleverest pebple",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

// transfer the logged user to every individual route.
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.get("/", function(req, res) {
    res.render("landing");
});

app.use("/campgrounds", campgroundRouter);
app.use("/campgrounds/:id/comments", commentsRouter);
app.use("/", authRouter);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Open the YelpCamp server successfully!");
});