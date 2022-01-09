const express = require("express");
const router = express.Router(),
      fs = require("fs"),
      multer = require("multer");

var Abonnements = require("../models/abonnements");
var Poll = require("../models/poll");
var Contact = require("../models/contacts");
var User = require("../models/user");
var News = require("../models/news");
var exportData = require("./exportExcelData");

var photos = fs.readdirSync("public/images/team");
var logo = fs.readdirSync("public/images/logo");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/team/");
      },
      filename: function(req, file, cb) {
        cb(null, req.body.image);
        photos.push(req.body.image);
    }
});

var logoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/logo/");
    },
    filename: function(req, file, cb) {
        cb(null, "gamergram.png");
    }
});
var upload = multer({ storage: storage });
var logoUpload = multer({ storage: logoStorage });

router.get("/dashboard", isLoggedIn, async (req, res) => {
  const emails = await Abonnements.find();
  const polls = await Poll.find();
  const contacts = await Contact.find();
  const news = await News.find();
  res.render("dashboard/index", { emails, polls, contacts, news });
});

router.get("/dashboard/images", isLoggedIn, async (req, res) => {
  if (photos[0] == ".DS_Store") {
    photos.shift();
  }
  if (logo[0] == ".DS_Store") {
    logo.shift();
  }
  
  res.render("dashboard/images", { photos, logos : logo })
});

router.post("/dashboard/images",  async (req, res) => {
    const { image } = req.body;
    const index = photos.indexOf(image);

    if (index < 0) {
      return res.redirect("/dashboard/photos");
    }

    fs.unlink("public/images/team/" + image, (err) => {
      err ? console.log(err) : res.redirect("/dashboard/images");
    });
    photos.splice(index, 1);
});

router.get("/dashboard/contact", isLoggedIn, async (req, res) => {
  const filename = req.url.split("/")[2];
  const contacts = await Contact.find();
  exportData.exportUsersToExcel(contacts, Contact, filename);
  res.render("dashboard/contacts", { contacts });
});

router.get("/dashboard/abo", isLoggedIn, async (req, res) => {
  const filename = req.url.split("/")[2];
  const abos = await Abonnements.find();
  exportData.exportUsersToExcel(abos, Abonnements, filename);
  res.render("dashboard/abonnements", { emails: abos });
});

router.get("/dashboard/news", isLoggedIn, async (req, res) => {
  const news = await News.find().sort({ date: -1 });
  res.render("dashboard/news", { news });
});

router.get("/dashboard/poll", isLoggedIn, async (req, res) => {
  try {
    const filename = req.url.split("/")[2];
    const polls = await Poll.find();
    exportData.exportUsersToExcel(polls, Poll, filename);
    res.render("dashboard/polls", { polls });
  } catch (error) {
    console.log("Fehler: " + error);
  }
});

router.delete("/abo/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  console.log(id);
  await Abonnements.findByIdAndDelete(id);
  res.redirect("/dashboard/abo");
});

router.delete("/poll/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await Poll.findByIdAndDelete(id);
  res.redirect("/dashboard/poll");
});

router.post("/dashboard/news", isLoggedIn, async (req, res) => {
  const newArticle = new News(req.body);
  await newArticle.save();
  console.log(newArticle);
  res.redirect("/");
});

router.put("/dashboard/news/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const article = await News.findByIdAndUpdate(id, { ...req.body });
  console.log(article);
  res.redirect("/dashboard/news");
});

router.delete("/dashboard/news/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await News.findByIdAndDelete(id);
  res.redirect("/dashboard/news");
});

router.get("/dashboard/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).sort({ date: -1 });
  res.render("dashboard/user", { user });
});

router.put("/dashboard/:id", isLoggedIn, upload.single("uploadImage"), async (req, res) => {
    try {
      const { id } = req.params;
      console.log(req.body);
      const user = await User.findByIdAndUpdate(id, { ...req.body });
      console.log(user);
      user.save();
      res.redirect("back");
    } catch {
      console.log("Fehler!");
      res.redirect("back");
    }
  }
);


// MIDDLEWARE

function isLoggedIn(req, res, next){
	if(!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    return next();
};


module.exports = router;