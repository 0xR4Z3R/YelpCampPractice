var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"), //should be before passport config
    seedDB          = require("./seeds"),
    validate        = require("validate.js"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride   = require("method-override"); 
    
    
mongoose.connect("mongodb://localhost/yelp_camp_v4");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();

//models Schema
var   Campground      = require("./models/campground"),
      Comment         = require("./models/comment"),
      User            = require("./models/user");


//requiering routes
var commentRoutes       = require("./routes/comments"),
    campgroundtRoutes   = require("./routes/campgrounds"),
    indexRoutes          = require("./routes/index");

//PASSPORT CONFIG

app.use(require("express-session")({
    
    secret: "Once again Secret",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundtRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});

