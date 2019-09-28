const mongoose = require('mongoose');

const REQUIRED = '{PATH} is required';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, default: '', required: REQUIRED },
    price: { type: Number, required: REQUIRED },
    stock: { type: Number, default: '' },
    description: { type: String, default: '' },
    picture: { type: String, default: '' },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }, {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);


// Duplicate the ID field.
// eslint-disable-next-line func-names
ProductSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
ProductSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Game', ProductSchema);
