const mongoose = require('mongoose');

const REQUIRED = '{PATH} is required';

const CategoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String, default: '', required: REQUIRED, unique: true,
    },
    icon: { type: String, default: '', required: REQUIRED },
    games: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
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
CategoriesSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
CategoriesSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Category', CategoriesSchema);
