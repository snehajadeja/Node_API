
const express = require('express');
const router = express.Router();
const { getAllProducts, getProductByUPC } = require('../controllers/productController');

// GET /products
router.get('/products', getAllProducts);
router.get('/products/:upc_code', getProductByUPC);

module.exports = router;