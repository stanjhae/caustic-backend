const mongoose = require('mongoose');

const REQUIRED = '{PATH} is required';

const GameSchema = new mongoose.Schema(
  {
    name: {
      type: String, default: '', required: REQUIRED, unique: true,
    },
    banner: { type: String, default:'' },
    icon: { type: String, default:'' },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
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
GameSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
GameSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Game', GameSchema);
