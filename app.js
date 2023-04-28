const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport")

const keys = require("./config/keys")

const app = express();

const pass = require("./config/passport");
pass(passport);

mongoose.connect(keys.MongoURL, {useNewUrlParser: true}).then((data) => {
    console.log('DB connected!')
}).catch((err) => {
    console.log(err,'err')
})

//Middleware
app.use(expressLayouts);
app.set('view engine', 'ejs')

// Body parser
app.use(express.urlencoded({extended: false}));

// Session

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// Passport init

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Custom middleware creates global variables

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");

    next();
})

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));


const PORT = process.env.PORT || '5000';

app.listen(PORT, console.log(`App runnning on port ${PORT}`))