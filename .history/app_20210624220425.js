var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override"),
    expressSanitizer= require("express-sanitizer"),
    LocalStrategy   = require("passport-local"),
    flash           = require("connect-flash"),
    nodemailer      = require("nodemailer");

// require("mongoose-type-url");
// require('mongoose-type-email');

try {
    mongoose.connect('mongodb://localhost:27017/gamergram', { useNewUrlParser: true });
} catch (error) {
    handleError(error);
}


require("dotenv").config();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(require('express-session')({
    secret: "Gamergram",
    resave: false,
    saveUninitialized: false
}));

app.get("/", function(req, res) {
    res.render("index");
});



app.listen(process.env.PORT || 3000, () => {
    console.log("Server started!");
});