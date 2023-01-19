const express = require('express');
const User = require('../models/User');
const userController = require('../controllers/userController');

const router = express.Router();

const { body } = require('express-validator');

router.route('/signup').post(
  [
    body('userName').not().isEmpty().withMessage('Lütfen Adınızı Giriniz!'),
    body('userSurname')
      .not()
      .isEmpty()
      .withMessage('Lütfen Soy Adınızı Giriniz!'),
    body('userEmail')
      .isEmail()
      .withMessage('Lütfen Geçerli Bir Email Giriniz')
      .custom(async (userEmail) => {
        const user = await User.findOne({ userEmail: userEmail });
        if (user) {
          return Promise.reject('Bu email zaten kullanımda.');
        }
      }),
    body('userPassword')
      .not()
      .isEmpty()
      .withMessage('Lütfen Şifrenizi Giriniz!'),
  ],
  userController.createUser
);

router.route('/login').post(userController.loginUser);

router.route('/photo').post(userController.uploadPhoto);

router.route('/userCart').post(userController.addToCart);

router.route('/userFavourite').post(userController.addToFavourite);

router.route('/buyCart').put(userController.buyCart);

router.route('/declineCart').put(userController.declineCart)

router.route('/declineFavourite').put(userController.declineFavourite)

router.route('/logout').get(userController.logoutUser);

module.exports = router;
