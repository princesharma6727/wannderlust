if(process.env.NODE_ENV!="production"){
  require('dotenv').config()
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const session=require("express-session");
const flash=require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const ExpressError=require("./utils/ExpressError.js");


const listingsRouter=require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");



const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true // Prevents client-side access to cookies
  },
};
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Passport Config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});



app.get("/demouser", async (req, res) => {
  try {
      let fakeUser = new User({
          email: "student@gmail.com",
          username: "fake-student",
      });

      let registeredUser = await User.register(fakeUser, "helloworld");
      res.send(registeredUser);
  } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).send({ message: "Error creating user", error: error.message });
  }
});



app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render("listings/error", { message: err.message });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("listings/error", { message: err.message });
});








app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
