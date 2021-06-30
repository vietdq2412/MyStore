const express = require("express");
const hbs = require("hbs");
const dbHandle = require('./dbHandle');
const session = require('express-session');

var app = express();

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'abcc##$$0911233$%%%32222',
    cookie: { maxAge: 60000 }
}));

app.set('view engine', 'hbs');

// var MongoClient = require('mongodb').MongoClient;
// var dburl = "mongodb+srv://viettt:123456@cluster0.mvbjz.mongodb.net/test";

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/add', (req, res) => {
    res.render('addForm');
});

app.post('/add', async(req, res) => {
    let nameInput = req.body.nameTxT;
    let priceInput = req.body.priceTxT;
    let newProduct = { name: nameInput, price: priceInput };
    await dbHandle.insertOneIntoCollection(newProduct, "product");
    res.redirect('/product');
});

app.get('/product', async(req, res) => {
    const products = await dbHandle.showAllCollection('', "product");
    var userName = 'Not logged In';
    if (req.session.username) {
        userName = req.session.username;
    }
    res.render('listProduct', { model: products, username: userName });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async(req, res) => {
    const nameInput = req.body.username;
    const passInput = req.body.password;
    const found = await dbHandle.checkLogin(nameInput, passInput);
    if (found) {
        req.session.username = nameInput;
        res.render('index', { username: nameInput })
    } else {
        res.render('index', { errorMsg: "Login failed!" })
    }
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async(req, res) => {
    const nameInput = req.body.username;
    const passInput = req.body.password;
    const newUser = { username: nameInput, password: passInput };
    await dbHandle.insertOneIntoCollection(newUser, "users");
    res.redirect('/login');
})

let PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("running - " + PORT);