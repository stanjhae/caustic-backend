const mongoose = require('mongoose');

const REQUIRED = '{PATH} is required';

const TournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String, default: '', required: REQUIRED, unique: true,
    },
    banner: { type: String},
    games: [{
      game: { type: mongoose.Schema.Types.ObjectId },
      fee: { type: Number },
      pool: [{ type: Number }],
      rules: [{ type: String }],
    }],
    location: {
      country: { type: String },
      city: { type: String },
      street: { type: String },
      Name: { type: String },
    },
    players: [{
      user: { type: mongoose.Schema.Types.ObjectId },
      game: [{ type: mongoose.Schema.Types.ObjectId }],
    }],
    rules: { type: String},
    regDeadline: { type: Date },
    cancelDeadline: { type: Date },
  }, {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);


// Duplicate the ID field.
// eslint-disable-next-line func-names
TournamentSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
TournamentSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Tournament', TournamentSchema);
