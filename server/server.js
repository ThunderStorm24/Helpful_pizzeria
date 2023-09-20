const express = require("express");
const cors = require('cors');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const authRouter = require('./Routes/LoginRegisterOperations/auth');
const pizzasRouter = require('./Routes/PizzaOperations/pizzas');
const ingredientsRouter = require('./Routes/UserOperations/ingredients');
const cartRouter = require('./Routes/UserOperations/cart');
const favPizza = require('./Routes/PizzaOperations/favPizza');
const likePizza = require('./Routes/PizzaOperations/likePizza');
const addUser = require('./Routes/UserOperations/addUser');
const editUser = require('./Routes/UserOperations/editUser');
const deleteUser = require('./Routes/UserOperations/deleteUser');
const addPizzaRouter = require('./Routes/PizzaOperations/addPizza');
const editPizzaRouter = require('./Routes/PizzaOperations/editPizza')
const deletePizzaRouter = require('./Routes/PizzaOperations/deletePizza')
const confirmationPizzaRouter = require('./Routes/PizzaOperations/confirmationPizza')
const userRouter = require('./Routes/UserOperations/user')
const orderRouter = require('./Routes/OrdersOperations/orders')

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
app.use(favPizza);
app.use(likePizza);
app.use(addUser);
app.use(editUser);
app.use(deleteUser);
app.use(addPizzaRouter);
app.use(editPizzaRouter);
app.use(deletePizzaRouter);
app.use(confirmationPizzaRouter);
app.use(userRouter);
app.use(orderRouter);

app.listen(5000, () => { console.log("Server start on port 5000") })