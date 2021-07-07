var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override"),
    expressSanitizer= require("express-sanitizer"),
    exceljs         = require("exceljs"),
    nodemailer      = require("nodemailer");

var Abonnements     = require("./models/abonnements");
// require("mongoose-type-url");
// require('mongoose-type-email');

var workbook = new exceljs.Workbook();
var worksheet = workbook.addWorksheet("Abonennten");
worksheet.state = 'visible';


try {
    mongoose.connect('mongodb://localhost/gamergram', { useNewUrlParser: true, useUnifiedTopology: true});
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

app.use(require('./routes/exportExcelData'));

app.get("/", function(req, res) {
    res.render("index");
});

app.post("/abo", async (req, res) => {
    const newAbo = new Abonnements(req.body);
    await newAbo.save();
    console.log(newAbo);
    res.redirect("/");
});

app.get("/dashboard/abo", async (req, res) => {
    const emails = await Abonnements.find();
    res.render("dashboard/abonnements", { emails });
});

app.delete("/abo/:id", async (req, res) => {
    const { id } =  req.params; 
    console.log(id);
    await Abonnements.findByIdAndDelete(id);
    res.redirect("/dashboard/abo");
});

app.post("/send", (req, res) => {
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
})


app.listen(process.env.PORT || 3000, () => {
    console.log("Server started!");
});