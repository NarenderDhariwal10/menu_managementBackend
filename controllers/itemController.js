const Item = require('../models/Item');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const isValidId = require('../utils/validateObjectId');

// Create item under a category or subcategory
exports.createItem = async (req, res) => {
  try {
    const { categoryId } = req.params; 
    const { subCategoryId } = req.query; 

    if (!isValidId(categoryId)) return res.status(400).json({ error: 'Invalid category id' });
    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    let subCategory = null;
    if (subCategoryId) {
      if (!isValidId(subCategoryId)) return res.status(400).json({ error: 'Invalid subcategory id' });
      subCategory = await SubCategory.findById(subCategoryId);
      if (!subCategory) return res.status(404).json({ error: 'SubCategory not found' });
    }

   
    const payload = {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      category: category._id,
      subCategory: subCategory ? subCategory._id : undefined,
      taxApplicability: typeof req.body.taxApplicability === 'boolean' ? req.body.taxApplicability : (subCategory ? subCategory.taxApplicability : category.taxApplicability),
      tax: typeof req.body.tax === 'number' ? req.body.tax : (subCategory ? subCategory.tax : category.tax),
      taxType: req.body.taxType || (subCategory ? subCategory.taxType : category.taxType),
      baseAmount: req.body.baseAmount,
      discount: req.body.discount || 0
    };

    const item = new Item(payload);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate('category subCategory', 'name');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get items under a category
exports.getItemsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!isValidId(categoryId)) return res.status(400).json({ error: 'Invalid category id' });
    
    const items = await Item.find({ category: categoryId }).populate('subCategory', 'name');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get items under a subcategory
exports.getItemsBySubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;
    if (!isValidId(subCategoryId)) return res.status(400).json({ error: 'Invalid subcategory id' });
    const items = await Item.find({ subCategory: subCategoryId }).populate('category', 'name');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get item by id or name
exports.getItem = async (req, res) => {
  try {
    const q = req.params.idOrName;
    let item;
    if (isValidId(q)) {
      item = await Item.findById(q).populate('category subCategory');
    } else {
      item = await Item.findOne({ name: new RegExp(q, 'i') }).populate('category subCategory');
    }
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update item
exports.updateItem = async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid item id' });

    
    if (req.body.category && !isValidId(req.body.category)) return res.status(400).json({ error: 'Invalid category id in body' });
    if (req.body.subCategory && !isValidId(req.body.subCategory)) return res.status(400).json({ error: 'Invalid subCategory id in body' });

    const updated = await Item.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Search items by name 
exports.searchItems = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: 'Provide search query ?q=...' });
    const items = await Item.find({ name: new RegExp(q, 'i') }).limit(50).populate('category subCategory', 'name');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
