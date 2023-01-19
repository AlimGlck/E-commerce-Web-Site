const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  userSurname: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    unique: true,
    required: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
  userCart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
     quantity: Number,
     price:Number,
     photo:String,
     name:String,
      
    },
  ],
  userFavourites:[
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      brand:String,
      photo:String,
      name:String,

    },
  ],
});

UserSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('userPassword')) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.userPassword, salt, function (err, hash) {
      if (err) return next(err);
      user.userPassword = hash;
      next();
    });
  });
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
