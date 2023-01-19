const User = require('../models/User');
const Product = require('../models/Product');
const bcrypt = require('bcrypt');
const fs = require('fs');
const { validationResult } = require('express-validator');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect('/login');
  } catch (error) {
    error = validationResult(req);

    console.log(error);
    console.log(error.array()[0].msg);
    for (let i = 0; i < error.array().length; i++) {
      req.flash('error', `${error.array()[i].msg}`);
    }

    res.status(400).redirect('/register');
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;

    const user = await User.findOne({ userEmail });

    if (user) {
      const same = await bcrypt.compare(userPassword, user.userPassword);

      if (same) {
        req.session.userID = user._id;
        res.status(200).redirect('/');
      } else {
        req.flash('error', `Şifreniz doğru değil`);
        res.status(400).redirect('/login');
      }
    } else {
      req.flash('error', `Böyle bir kullanıcı mevcut değil`);
      res.status(400).redirect('/login');
    }
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.uploadPhoto = async (req, res) => {
  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadImage = req.files.productPhoto;
  let uploadPath = process.cwd() + '/public/uploads/' + uploadImage.name;

  uploadImage.mv(uploadPath, async () => {
    await Product.create({
      ...req.body,
      productPhoto: '/uploads/' + uploadImage.name,
    });
    res.redirect('/');
  });
};

exports.addToCart = async (req, res) => {
  const user = await User.findById(req.session.userID);
  let ItemQuantity = req.body.quantity;
  let price = req.body.price;
  let id = req.body.productId;
  let photo = req.body.photo;
  await user.userCart.push({
    _id: id,
    quantity: ItemQuantity,
    price: price,
    photo: photo,
  });
  await user.save();

  res.status(200).redirect('/userCart');
};

exports.addToFavourite = async (req, res) => {
  const user = await User.findById(req.session.userID);
  let productName = req.body.name;
  let productBrand = req.body.brand;
  let id = req.body.productId;
  let photo = req.body.photo;

  await user.userFavourites.push({
    _id: id,
    name: productName,
    brand: productBrand,
    photo: photo,
  });
  await user.save();

  res.status(200).redirect('/');
    

  
};

exports.buyCart = async (req, res) => {
  const user = await User.findById(req.session.userID);

  for (let i = 0; i < user.userCart.length; i++) {
    const product = await Product.findById(user.userCart[i]._id);

    product.productQuantity =
      product.productQuantity - user.userCart[i].quantity;

    await product.save();
  }

  user.userCart = [];

  await user.save();

  res.status(200).redirect('/');
};

exports.declineCart = async (req,res) => {
  const user = await User.findById(req.session.userID);
  user.userCart = [];
  await user.save();

  res.status(200).redirect('/userCart');
}

exports.declineFavourite = async (req,res) => {
  const user = await User.findById(req.session.userID);
  user.userFavourites = [];
  await user.save();

  res.status(200).redirect('/userFavourite');
}

exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
