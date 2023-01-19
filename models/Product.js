const mongoose = require('mongoose');
const slugify = require('slugify');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  productName: {
    type: String,
    unique: true,
    required: true,
  },
  productBrand: {
    type: String,
    required: true,
  },
  productPrice: {
    type: String,
    required: true,
  },
  productPhoto: {
    type: String,
    required: true,
  },
  productQuantity: {
    type: Number,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
});

ProductSchema.pre('validate', function (next) {
  this.slug = slugify(this.productName, {
    lower: true,
    strict: true,
  });
  next();
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
