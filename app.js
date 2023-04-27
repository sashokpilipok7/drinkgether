const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");

const config = require("./config")

const app = express();

mongoose.connect(config.MongoURL, {useNewUrlParser: true}).then((data) => {
    console.log('DB connected!')
}).catch((err) => {
    console.log(err,'err')
})

//Middleware
app.use(expressLayouts);
app.set('view engine', 'ejs')

// Body parser
app.use(express.urlencoded({extended: false}));

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));


const PORT = process.env.PORT || '5000';

app.listen(PORT, console.log(`App runnning on port ${PORT}`))