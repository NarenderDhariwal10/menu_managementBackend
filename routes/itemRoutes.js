const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// create item under a category (optionally provide subCategoryId as ?subCategoryId=)
router.post('/category/:categoryId', itemController.createItem);

// get all items
router.get('/', itemController.getAllItems);

// get all items under a category
router.get('/category/:categoryId', itemController.getItemsByCategory);

// get all items under a subcategory
router.get('/subCategory/:subCategoryId', itemController.getItemsBySubCategory);

// get item by id or name
router.get('/:idOrName', itemController.getItem);

// update item
router.put('/id/:id', itemController.updateItem);

// search items ?q=
router.get('/search', itemController.searchItems);

module.exports = router;

