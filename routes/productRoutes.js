const express = require("express");

const productController = require('../controllers/productController');

const router = express.Router();

router.route('/:id').get(productController.getProductCardPage);

router.route('/:id').put(productController.buyProduct);

router.route('/:id').delete(productController.deleteProduct);

module.exports = router;