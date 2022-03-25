const express = require('express');
const app = express();
const ejs = require('ejs');
const router = require('./routers/router.js');
const flash = require('connect-flash');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');

const sessionOptions = session({
    secret: "learn js from scratch",
    store: new MongoStore({
        client: require('./db'),
        httpOnly: true
    }),
    resave: false,
    saveUninitialized: true,
    maxAge: 1000*60*60*24,
    cookies: {secure:true}
})

app.use(sessionOptions);
app.use(cookieParser());
app.use(flash());

app.use(express.static('public'))

app.set('view engine', 'ejs');
app.set("views", "views");

// aby bylo widac req.body
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// na koncu niech bedzie
app.use('/', router);


module.exports = app;

