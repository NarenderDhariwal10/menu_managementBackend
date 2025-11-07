const express = require('express');
const router = express.Router();
const subController = require('../controllers/subcategoryController');

// create subcategory under a category
router.post('/category/:categoryId', subController.createSubCategory);

// get all subcategories
router.get('/', subController.getAllSubCategories);

// get all subcategories under a category
router.get('/category/:categoryId', subController.getSubsByCategory);

// get subcategory by id or name
router.get('/:idOrName', subController.getSubCategory);

// update subcategory
router.put('/:id', subController.updateSubCategory);

module.exports = router;
