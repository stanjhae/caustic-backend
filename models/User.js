const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const REQUIRED = '{PATH} is required';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: REQUIRED },
    hash: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    description: { type: String },
    email: { type: String, unique: true, required: REQUIRED },
    password: { type: String },
    avatar: { type: mongoose.Schema.Types.ObjectId, default: null },
    gender: { type: String },
    nationality: { type: String },
    device: { type: String, default: '' },
    dob: { type: Date, default: Date.now },
    provider: { type: String, default: 'local' },
    telephone: { type: String },
    emailVerified: { type: Boolean, default: false },
    hasPassword: { type: Boolean, default: true },
    token: { type: String, default: 0 },
    verToken: { type: String, default: 0 },
  }, {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

UserSchema.pre('save', async function (next) {
  const doc = this;
  try {
    if (doc.isModified('password')) {
      const rounds = 10;
      doc.password = await bcrypt.hash(doc.password, rounds);
    }
  } catch (err) {
    return next(err);
  }

  next();
});

// Duplicate the ID field.
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
UserSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('User', UserSchema);
