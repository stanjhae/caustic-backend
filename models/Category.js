const mongoose = require('mongoose');

const REQUIRED = '{PATH} is required';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String, default: '', required: REQUIRED, unique: true,
    },
    icon: { type: String, default: '', required: REQUIRED },
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }],
  }, {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);


// Duplicate the ID field.
// eslint-disable-next-line func-names
CategorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
CategorySchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Category', CategorySchema);
