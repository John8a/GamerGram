var express         = require("express"),
  app               = express(),
  mongoose          = require("mongoose"),
  methodOverride    = require("method-override"),
  session           = require("express-session"),
  expressSanitizer  = require("express-sanitizer"),
  passport          = require("passport"),
  LocalStrategy     = require("passport-local"),
  nodemailer        = require("nodemailer");
    
var Abonnements     = require("./models/abonnements");
var Poll            = require("./models/poll");
var Contact         = require("./models/contacts");
var User            = require("./models/user");
var News            = require("./models/news");
var dashboard       = require("./routes/dashboard");
var catchAsync      = require("./utils/catchAsync");

const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://johnhardenberg:Lehecejo6!@cluster0.jhpnt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

require("dotenv").config({ path: "./"});

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const secret = process.env.SECRET || "thisshouldbeabettersecret!";

const sessionConfig = {
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");
app.use(require('express-session')({
    secret: "Gamergram",
    resave: false,
    saveUninitialized: false
}));
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.get("/", async (req, res) => {
    try {
        console.log(news);
        const news = await News.find();
        res.render("index", { news });
    } catch {
        res.render("index");
    }
});

app.get("/impressum", (req, res) => {
    res.render("impressum"); 
});

app.get("/datenschutz", (req, res) => {
    res.render("datenschutz"); 
});

app.post("/poll", async (req, res) => {
    const newPoll = new Poll(req.body);
    await newPoll.save();
    console.log(newPoll);
    res.redirect("/"); 
});

app.post("/abo", async (req, res) => {
    const newAbo = new Abonnements(req.body);
    await newAbo.save();
    console.log(newAbo);
    res.redirect("/");
});

app.get("/register", (req, res) => {
    res.render("authentication/register");
});

app.post("/register",  catchAsync(async (req, res) => {
    try {
        const { email, username, password, image, name, code } = req.body;
        if(code === "4891") {
            console.log("Test");
            const user = new User({ email, username, password, image, name });
            const registeredUser = await User.register(user, password);
            console.log(registeredUser);
            req.login(registeredUser, err => {
                if (err) return next(err);
                res.redirect('/dashboard');
            });
        } else {
            console.log(req.socket.remoteAddress);
        }
    } catch (e) {
        res.redirect('/register');
    }
}));

app.get("/login", (req, res) => {
    res.render("authentication/login"); 
});

app.post("/login", passport.authenticate('local', { 
        failureRedirect: '/login',
        successRedirect: '/dashboard'
    }), (req, res) => {
    res.redirect("/dashboard");
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

app.post("/send", async (req, res) => {
    const newContact = new Contact(req.body);
    await newContact.save();

    var output = "<h2>Nachricht von jemandem!</h2><table><tr><td><strong>Name: </strong></td><td>" + req.body.name + "</td></tr><tr><td><strong>E-Mail: </strong></td><td>" + req.body.email + "</td></tr><table><h3>Nachricht:</h3><p>" + req.body.message + "</p>";
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        }
    });

    let mailOptions = {
        from: req.body.email,
        to: process.env.EMAIL,
        subject: 'Kontakt',
        text: req.body.text,
        html: output
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if(err) {
            console.log("ERROR!", err, req.body);
        } else {
            console.log("Mail has been sent!", req.body.email);
        }
        res.redirect("/")
    });
});

app.post("/sendanswer", async (req, res) => {
    const { id } = req.params;
    var contact = await Contact.findOne(id);

    var output = "<p>" + req.body.message + "</p>";
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        }
    });

    let mailOptions = {
        from: process.env.EMAIL,
        to: contact.email,
        subject: 'Kontakt',
        text: req.body.message,
        html: output
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if(err) {
            console.log("ERROR!", err, req.body);
        } else {
            console.log("Mail has been sent!", req.body.email);
        }
        res.redirect("/")
    });
});

// UPLOAD

app.use(dashboard);


app.listen(process.env.PORT || 3000, () => {
    console.log("Server started!");
});