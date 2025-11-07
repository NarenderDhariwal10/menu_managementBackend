const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');
const Item = require('../models/Item');
const isValidId = require('../utils/validateObjectId');

// Create subcategory under a category
exports.createSubCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!isValidId(categoryId)) return res.status(400).json({ error: 'Invalid category id' });

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    
    const payload = {
      category: category._id,
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      taxApplicability: typeof req.body.taxApplicability === 'boolean' ? req.body.taxApplicability : category.taxApplicability,
      tax: typeof req.body.tax === 'number' ? req.body.tax : category.tax,
      taxType: req.body.taxType || category.taxType
    };

    const sub = new SubCategory(payload);
    await sub.save();
    res.status(201).json(sub);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get all subcategories
exports.getAllSubCategories = async (req, res) => {
  try {
    const subs = await SubCategory.find().populate('category', 'name');
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get subcategories under a category
exports.getSubsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!isValidId(categoryId)) return res.status(400).json({ error: 'Invalid category id' });
    const subs = await SubCategory.find({ category: categoryId });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get subcategory by id or name
exports.getSubCategory = async (req, res) => {
  try {
    const q = req.params.idOrName;
    let sub;
    if (isValidId(q)) {
      sub = await SubCategory.findById(q).populate('category');
    } else {
      sub = await SubCategory.findOne({ name: new RegExp(`^${q}$`, 'i') }).populate('category');
    }
    if (!sub) return res.status(404).json({ error: 'SubCategory not found' });

    
    const items = await Item.find({ subCategory: sub._id });
    res.json({ sub, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update subcategory
exports.updateSubCategory = async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid subcategory id' });
    const updated = await SubCategory.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'SubCategory not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
