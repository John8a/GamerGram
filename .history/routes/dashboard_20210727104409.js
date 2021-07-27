const   express = require("express");
const   router  = express.Router,
        multer  = require("multer");


var upload = multer({ dest: "public/images/team/" });

const exportExcelData = (req, res, next) => {
  const workSheetColumnNames = ["Datum", "E-Mail"];
  exportData(workSheetColumnNames);
  next();
};

router.get("/dashboard", isLoggedIn, async (req, res) => {
  const emails = await Abonnements.find();
  const polls = await Poll.find();
  const contacts = await Contact.find();
  const news = await News.find();
  res.render("dashboard/index", { emails, polls, contacts, news });
});

router.get("/dashboard/contact", isLoggedIn, async (req, res) => {
  const contacts = await Contact.find();
  res.render("dashboard/contacts", { contacts });
});

router.get("/dashboard/abo", isLoggedIn, exportExcelData, async (req, res) => {
  const emails = await Abonnements.find();
  const currentUser = "asdasd";
  res.render("dashboard/abonnements", { emails, currentUser });
});

router.get("/dashboard/news", isLoggedIn, async (req, res) => {
  const news = await News.find().sort({ date: -1 });
  res.render("dashboard/news", { news });
});

router.get("/dashboard/poll", isLoggedIn, async (req, res) => {
  try {
    const polls = await Poll.find();
    res.render("dashboard/polls", { polls });
  } catch (error) {
    console.log("Fehler: " + error);
  }
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

router.put("/dashboard/:id", upload.single("uploadImage"), isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body });
    image = "/public/images/team/" + req.body.image;
    console.log(user);
    res.redirect("back");
});


// MIDDLEWARE

function isLoggedIn(req, res, next){
	if(!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    return next();
};


module.exports = router;