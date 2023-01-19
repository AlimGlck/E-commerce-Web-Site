const Product = require('../models/Product');
const User = require('../models/User');

exports.getProductCardPage = async (req, res) => {
  const productCard = await Product.findById(req.params.id).populate(
    'category'
  );
  const user = await User.findById(req.session.userID);
  res.status(200).render('productCard', {
    productCard,
    user,
  });
};

exports.buyProduct = async (req, res) => {
  let boughtItemQuantity = req.body.quantity;
  const product = await Product.findById(req.params.id);

  product.productQuantity = product.productQuantity - boughtItemQuantity;

  await product.save();

  if (product.productQuantity <= 0) {
    await Product.findByIdAndRemove(req.params.id);
  }

  res.status(200).redirect('/');
};

exports.deleteProduct = async (req,res) => {
  await Product.findByIdAndRemove(req.params.id);

  res.status(200).redirect('/');
}
