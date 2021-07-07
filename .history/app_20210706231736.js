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
var exportData      = require("./routes/exportExcelData");
// require("mongoose-type-url");
// require('mongoose-type-email');

// var workbook = new exceljs.Workbook();
// var worksheet = workbook.addWorksheet("Abonennten");
// worksheet.state = 'visible';


try {
    mongoose.connect('mongodb://localhost/gamergram', { useNewUrlParser: true, useUnifiedTopology: true});
} catch (error) {
    handleError(error);
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
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.set("view engine", "ejs");
app.use(require('express-session')({
    secret: "Gamergram",
    resave: false,
    saveUninitialized: false
}));
// app.use(function(req, res, next){
// 	res.locals.currentUser 	= req.user;
// 	res.locals.success 		= req.flash('success');
// 	res.locals.error 		= req.flash('error');
// 	next();
// });


// const authenticateMe = (req, res, next) => {
//     const { pw } = req.query;
//     if (pw == "pw?") {
//         next();
//     } else {
//         res.redirect("/");
//     }
// }

// const user = new User({
//     name: "Ele",
//     username: "ele.mosel",
//     password: "m0nkey!"
// });

// user.save();

const exportExcelData = (req, res, next) => {
    const workSheetColumnNames = [
        "Datum",
        "E-Mail",
    ]
    exportData(workSheetColumnNames);
    next();
};

// app.use(async (req, res, next) => {
//     const abos = await Abonnements.find();
//     worksheet.colums = [
//         {header: 'Datum', key: 'date'}, 
//         {header: 'E-Mail', key: 'email'}
//     ];
//     abos.forEach(function(email) {
//         worksheet.addRow([
//             email.date, 
//             email.email,
//         ]);
//         console.log(worksheet.getRow(0));
//     });
//     console.log(worksheet.getRows());
//     await workbook.xlsx.writeFile('abonements.xlsx').then(console.log("Saved!"));
//     next();
// });

app.get("/", function(req, res) {
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

app.get("/login", (req, res) => {
    res.render("dashboard/login"); 
});


app.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
    }), function(req, res){
        res.redirect("/dashboard");
});

app.get("/dashboard", isLoggedIn, async (req, res) => {
    const emails  = await Abonnements.find();
    const polls   = await Poll.find();
    const contacts = await Contact.find();
    res.render("dashboard/index", { emails, polls, contacts });
});

app.get("/dashboard/abo", exportExcelData, async (req, res) => {
    const emails = await Abonnements.find();
    res.render("dashboard/abonnements", { emails });
});

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
	req.flash("error", "Please Login First!");
  	res.redirect('/login');
};



app.listen(process.env.PORT || 3000, () => {
    console.log("Server started!");
});