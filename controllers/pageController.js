const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getIndexPage = async (req, res) => {
  const categorySlug = req.query.categories;

  

  const query = req.query.search;

  const category = await Category.findOne({ slug: categorySlug }).exec();

  let filter = {};

  if (categorySlug) {
    filter = { category: category._id };
  }

  if (query) {
    filter = { productName: query };
  }

  if (!query && !categorySlug) {
    (filter.productName = ''), (filter.category = null);
  }

  const products = await Product.find({
    $or: [
      {
        productName: {
          $regex: '.*' + filter.productName + '.*',
          $options: 'i',
        },
      },
      { category: filter.category },
      
    ],
    productQuantity:{$gt:0},
  });

  const categories = await Category.find({});
  const user = await User.findById(req.session.userID);

  res.status(200).render('index', {
    categories,
    products,
    user,
  });
};

exports.getRegisterPage = async (req, res) => {
  const user = await User.findById(req.session.userID)

  res.status(200).render('register', {
    user,
  }
  );
};

exports.getLoginPage = async (req, res) => {
  const user = await User.findById(req.session.userID)

  res.status(200).render('login', {
    user,
  });
};

exports.getProductAddingPage = async (req, res) => {
  const categories = await Category.find({});
  const user = await User.findById(req.session.userID)

  res.status(200).render('addProduct', {
    categories,
    user,
  });
};

exports.getUserCartPage = async (req,res) => {
  const products = await User.findById(req.session.userID)
  const user = await User.findById(req.session.userID)

  res.status(200).render('userCart', {
    products,
    user,
  });
}

exports.getUserFavouritePage = async (req,res) => {
  const products = await User.findById(req.session.userID)
  const user = await User.findById(req.session.userID)

  res.status(200).render('userFavourite', {
    products,
    user,
  });
}


