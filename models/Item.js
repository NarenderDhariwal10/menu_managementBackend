const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  image: { type: String },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }, 
  taxApplicability: { type: Boolean }, 
  tax: { type: Number }, 
  taxType: { type: String, enum: ['percentage', 'fixed'] },
  baseAmount: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 }, 
}, { timestamps: true });


ItemSchema.pre('validate', function(next) {
  
  this.baseAmount = Number(this.baseAmount || 0);
  this.discount = Number(this.discount || 0);
  this.totalAmount = this.baseAmount - this.discount;
  if (this.totalAmount < 0) {
    return next(new Error('totalAmount (baseAmount - discount) cannot be negative'));
  }
  next();
});

module.exports = mongoose.model('Item', ItemSchema);
