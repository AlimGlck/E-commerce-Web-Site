const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');

const ejs = require('ejs');

mongoose.set('strictQuery', true);

const pageRoutes = require('./routes/pageRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

mongoose.connect('mongodb://localhost/tez-db');

app.set('view engine', 'ejs');

global.userIN = null;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/tez-db' }),
  })
);
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);
app.use('*', (req, res, next) => {
  userIN = req.session.userID;
  next();
});
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

app.use('/', pageRoutes);
app.use('/category', categoryRoutes);
app.use('/user', userRoutes);
app.use('/product', productRoutes);

const port = 8000;





app.listen(port, (req,res) => {
console.log(`Server successfully started at ${port} port`);
console.log("Request Started:" + (new Date().toLocaleTimeString()));

console.log("Response Started:" + (new Date().toLocaleTimeString()));
});
