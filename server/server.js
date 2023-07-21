const express = require("express");
const cors = require('cors');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const authRouter = require('./auth');
const pizzasRouter = require('./pizzas');
const ingredientsRouter = require('./ingredients');
const cartRouter = require('./cart');
const addPizzaRouter = require('./addPizza');
const userRouter = require('./user')
const orderRouter = require('./orders')

const app = express()

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "REQUEST"],
    credentials: true
}));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    key: "userID",
    secret: "skodafabia1",
    resave: false,
    saveUninitialized: false,
    cookie: {
        // expires: 60 * 60 * 24, // (24 godziny)
        expires: 7 * 24 * 60 * 60 * 1000, // (7 dni w milisekundach)
    },
}))

app.use(authRouter);
app.use(pizzasRouter);
app.use(ingredientsRouter);
app.use(cartRouter);
app.use(addPizzaRouter);
app.use(userRouter);
app.use(orderRouter);

app.listen(5000, () => { console.log("Server start on port 5000") })