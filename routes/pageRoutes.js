const express = require('express');

const pageController = require('../controllers/pageController');

const authMiddleware = require('../middlewares/authmiddleware');

const rolemiddleware1 = require('../middlewares/rolemiddleware1');
const rolemiddleware2 = require('../middlewares/rolemiddleware2');

const redirectMiddleware = require('../middlewares/redirectmiddleware');


const router = express.Router();

router.route('/').get(pageController.getIndexPage);

router.route('/register').get(redirectMiddleware,pageController.getRegisterPage);

router.route("/login").get(redirectMiddleware,pageController.getLoginPage);

router.route("/userCart").get(authMiddleware,rolemiddleware1,pageController.getUserCartPage);

router.route("/addProduct").get(authMiddleware,rolemiddleware2,pageController.getProductAddingPage);

router.route("/userFavourite").get(authMiddleware,rolemiddleware1,pageController.getUserFavouritePage);





module.exports = router;
