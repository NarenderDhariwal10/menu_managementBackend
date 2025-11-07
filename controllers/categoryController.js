const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Item = require('../models/Item');
const isValidId = require('../utils/validateObjectId');

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, image, description, taxApplicability, tax, taxType } = req.body;
    const category = new Category({ name, image, description, taxApplicability, tax, taxType });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get category by id or name 
exports.getCategory = async (req, res) => {
  try {
    const q = req.params.idOrName;
    let category;
    if (isValidId(q)) {
      category = await Category.findById(q);
    } else {
      category = await Category.findOne({ name: new RegExp(`^${q}$`, 'i') });
    }
    if (!category) return res.status(404).json({ error: 'Category not found' });

    
    const subcategories = await SubCategory.find({ category: category._id });
    const itemsDirect = await Item.find({ category: category._id, subCategory: { $exists: true, $eq: null } });
    

    res.json({ category, subcategories, itemsDirect });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//update category
exports.updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid category id' });
    const updated = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Category not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
