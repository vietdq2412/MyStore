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
    if (req.session.username) {
        userName = req.session.username;
    } else {
        res.redirect('/login');
    }
    res.render('addForm', { username: userName });
});

app.post('/add', async(req, res) => {
    if (req.session.username) {
        userName = req.session.username;
    } else {
        res.redirect('/login');
    }
    let nameInput = req.body.nameTxT;
    let priceInput = req.body.priceTxT;
    let newProduct = { name: nameInput, price: priceInput };
    await dbHandle.insertOneIntoCollection(newProduct, "product");
    res.redirect('/product');
});

app.get('/product', async(req, res) => {
    if (req.session.username) {
        userName = req.session.username;
    } else {
        res.redirect('/login');
    }
    const products = await dbHandle.searchProduct('', "product");
    if (req.session.username) {
        userName = req.session.username;
    }
    res.render('listProduct', { model: products, username: userName });
});

app.get('/edit', async(req, res) => {
    if (req.session.username) {
        userName = req.session.username;
    } else {
        res.redirect('/login');
    }
    const id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    const condition = { "_id": ObjectID(id) };

    const product = await dbHandle.findOneProduct(condition, "product");
    res.render('editForm', { product: product, username: userName })
});

app.post('/edit', async(req, res) => {
    if (req.session.username) {
        userName = req.session.username;
    } else {
        res.redirect('/login');
    }
    const id = req.body.id;
    var ObjectID = require('mongodb').ObjectID;
    const condition = { "_id": ObjectID(id) };

    let nameInput = req.body.nameTxT;
    let priceInput = req.body.priceTxT;
    const newData = { $set: { name: nameInput, price: priceInput } };

    await dbHandle.editFromCollection(condition, "product", newData);
    res.redirect('product');
});

app.get('/delete', async(req, res) => {
    if (!req.session.username) {
        res.redirect('/login');
    }
    const id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    const condition = { "_id": ObjectID(id) };
    await dbHandle.deleteFromCollection(condition, "product");
    res.redirect('/product');
});

app.post('/search', async(req, res) => {
    if (req.session.username) {
        userName = req.session.username;
    } else {
        res.redirect('/login');
    }
    const searchText = req.body.nameTxT;
    const results = await dbHandle.searchProduct(searchText, "product");
    res.render('listProduct', { model: results, username: userName })
})

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

const PORT = 5000;
app.listen(process.env.PORT || PORT);
console.log("running - " + PORT);