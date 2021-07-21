var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override"),
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
// require("mongoose-type-url");
// require('mongoose-type-email');


// try {
//     // mongoose.connect('mongodb://localhost/gamergram', { useNewUrlParser: true, useUnifiedTopology: true});
//     mongoose.connect("mongodb+srv://johnhardenberg:Lehecejo6!@cluster0.jhpnt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
// } catch (error) {
//     handleError(error);
// }

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
    // reconnectTries: 30, // Retry up to 30 times
    // reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
	useNewUrlParser: true,
	// useCreateIndex: true,
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

// const contactSeed = new Contact({
//     name: "John",
//     email: "johnvhardenberg@googlemail.com",
//     message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint quisquam eum, nostrum quidem facilis a non temporibus placeat tempora eligendi aperiam. Debitis assumenda deserunt earum suscipit voluptate sapiente, vitae quod non vel, odit placeat reiciendis molestiae expedita sit, est autem?"
// });

// contactSeed.save();

require("dotenv").config();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
    function(username, passowrd, done) {
    User.findOne({ username: username }, function (err, user) {
        return done(null, user);
    });
}));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.set("view engine", "ejs");
app.use(require('express-session')({
    secret: "Gamergram",
    resave: false,
    saveUninitialized: false
}));


const authenticateMe = (req, res, next) => {
    const { pw } = req.query;
    if (pw == "pw?") {
        next();
    } else {
        res.redirect("/");
    }
}

// const user = new User({
//     name: "Ele",
//     username: "ele.mosel",
//     password: "m0nkey!"
// });

// user.save();

// const article = new News({
//     title: "Entwicklung der App startet!",
//     image: "https://images.unsplash.com/photo-1542831371-d531d36971e6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
//     theme: "light",
//     text: "Nachdem wir das richtige Entwicklerstudio gefunden haben, beginnen wir mit der Programmierung der App. Gerne halten wir euch während des gesamten Prozesses auf dem Laufenden. <\br> Falls ihr selbst gute Programmierer kennt oder selbst einer seid, könnt ihr gerne mit uns Kontakt aufnehmen. Wir freuen uns über jede Hilfe die wir bekommen können."
// });

// article.save();

const exportExcelData = (req, res, next) => {
    const workSheetColumnNames = [
        "Datum",
        "E-Mail",
    ]
    exportData(workSheetColumnNames);
    next();
};

app.get("/", async function(req, res) {
    try {
        const news    = await News.find();
        res.render("index", { news });
    } catch {

    }
    res.render("index");
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

app.get("/register",  async (req, res) => {
    res.render("authentication/register");
});

app.post("/register",  async (req, res) => {
    try {
        const { email, username, password, image, name, code } = req.body;
        if(code === "4891") {
            console.log("Test");
            const user = new User({ email, username });
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
});

app.get("/login", (req, res) => {
    res.render("authentication/login"); 
});

app.post("/login", passport.authenticate("local"), (req, res) => {
    console.log(req.body.username);
    res.redirect("/dashboard");
});

app.get("/dashboard", async (req, res) => {
    const emails  = await Abonnements.find();
    const polls   = await Poll.find();
    const contacts = await Contact.find();
    const news    = await News.find();
    res.render("dashboard/index", { emails, polls, contacts, news });
});

app.get("/dashboard/abo", exportExcelData, async (req, res) => {
    const emails = await Abonnements.find();
    res.render("dashboard/abonnements", { emails });
});

app.get("/dashboard/news", async (req, res) => {
    const news = await News.find().sort({date: -1});
    res.render("dashboard/news", { news });
});

app.post("/dashboard/news", async (req, res) => {
    const newArticle = new News(req.body);
    await newArticle.save();
    console.log(newArticle);
    res.redirect("/");
});

app.put("/dashboard/news/:id", async (req, res) => {
    const { id } = req.params;
    const article = await News.findByIdAndUpdate(id, { ...req.body });
    console.log(article);
    res.redirect("/dashboard/news");
});

app.delete('/dashboard/news/:id', async (req, res) => {
    const { id } = req.params;
    await News.findByIdAndDelete(id);
    res.redirect('/dashboard/news');
})

app.delete("/abo/:id", async (req, res) => {
    const { id } =  req.params; 
    console.log(id);
    await Abonnements.findByIdAndDelete(id);
    res.redirect("/dashboard/abo");
});

app.delete("/poll/:id", async (req, res) => {
    const { id } =  req.params; 
    await Poll.findByIdAndDelete(id);
    res.redirect("/dashboard/poll");
});

app.get("/dashboard/poll", async (req, res) => {
    const polls   = await Poll.find();
    res.render("dashboard/polls", { polls });
});

app.get("/dashboard/contact", async (req, res) => {
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
	if(req.isAuthenticated()){
	  return next();
	}
  	res.redirect('/login');
};



app.listen(process.env.PORT || 3000, () => {
    console.log("Server started!");
});