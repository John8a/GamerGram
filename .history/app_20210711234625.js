var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override"),
    session         = require('express-session'),
    expressSanitizer= require("express-sanitizer"),
    passport		= require("passport"),
	LocalStrategy	= require("passport-local"),
    nodemailer      = require("nodemailer");

var Abonnements     = require("./models/abonnements");
var Poll            = require("./models/poll");
var Contact         = require("./models/contacts");
var User            = require("./models/user");
var News            = require("./models/news");
var exportData      = require("./routes/exportExcelData");
var catchAsync      = require("./utils/catchAsync");


mongoose.connect('mongodb+srv://johnhardenberg:Lehecejo6!@cluster0.jhpnt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});

const options = {
    autoIndex: false, // Don't build indexes
    poolSize: 10, // Maintain up to 10 socket connections
    bufferMaxEntries: 0,
	useNewUrlParser: true,
	useUnifiedTopology: true
  }

const connectWithRetry = () => {
  console.log('MongoDB connection with retry')
  mongoose
    .connect(
      "mongodb+srv://johnhardenberg:Lehecejo6!@cluster0.jhpnt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      options
    )
    .then(() => {
      console.log("MongoDB is connected");
    })
    .catch((err) => {
      console.log("MongoDB connection unsuccessful, retry after 5 seconds.");
      setTimeout(connectWithRetry, 5000);
    });
}

require("dotenv").config();

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


const exportExcelData = (req, res, next) => {
    const workSheetColumnNames = [
        "Datum",
        "E-Mail",
    ]
    exportData(workSheetColumnNames);
    next();
};

app.get("/", async (req, res) => {
    try {
        const news    = await News.find();
        res.render("index", { news });
    } catch {
        res.render("index");
    }
});

app.post("/poll", async (req, res) => {
    // const message = "Danke für Deine Hilfe!"
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

app.get("/dashboard", isLoggedIn, async (req, res) => {
    const emails = await Abonnements.find();
    const polls = await Poll.find();
    const contacts = await Contact.find();
    const news = await News.find();
    res.render("dashboard/index", { emails, polls, contacts, news });
});

app.get("/dashboard/abo", exportExcelData, isLoggedIn, async (req, res) => {
    const emails = await Abonnements.find();
    res.render("dashboard/abonnements", { emails });
});

app.get("/dashboard/news", isLoggedIn, async (req, res) => {
  const news = await News.find().sort({ date: -1 });
  res.render("dashboard/news", { news });
});

app.post("/dashboard/news", isLoggedIn, async (req, res) => {
  const newArticle = new News(req.body);
  await newArticle.save();
  console.log(newArticle);
  res.redirect("/");
});

app.put("/dashboard/news/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const article = await News.findByIdAndUpdate(id, { ...req.body });
    console.log(article);
    res.redirect("/dashboard/news");
});

app.delete("/dashboard/news/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await News.findByIdAndDelete(id);
    res.redirect("/dashboard/news");
});

app.delete("/abo/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    console.log(id);
    await Abonnements.findByIdAndDelete(id);
    res.redirect("/dashboard/abo");
});

app.delete("/poll/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await Poll.findByIdAndDelete(id);
    res.redirect("/dashboard/poll");
});

app.get("/dashboard/poll", isLoggedIn, async (req, res) => {
    const polls = await Poll.find();
    res.render("dashboard/polls", { polls });
});

app.get("/dashboard/contact", isLoggedIn, async (req, res) => {
    const contacts = await Contact.find();
    res.render("dashboard/contacts", { contacts });
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

// MIDDLEWARE

function isLoggedIn(req, res, next){
	if(!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    console.log(req.isAuthenticated());
    return next();
};



app.listen(process.env.PORT || 3000, () => {
    console.log("Server started!");
});