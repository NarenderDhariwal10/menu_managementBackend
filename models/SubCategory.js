const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true, trim: true },
  image: { type: String },
  description: { type: String },
  taxApplicability: { type: Boolean }, 
  tax: { type: Number }, 
  taxType: { type: String, enum: ['percentage', 'fixed'] },
}, { timestamps: true });

module.exports = mongoose.model('SubCategory', SubCategorySchema);
