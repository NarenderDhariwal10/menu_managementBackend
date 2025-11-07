const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// create category
router.post('/', categoryController.createCategory);

// get all categories
router.get('/', categoryController.getAllCategories);

// get category by id or name
router.get('/:idOrName', categoryController.getCategory);

// update category
router.put('/:id', categoryController.updateCategory);

module.exports = router;
