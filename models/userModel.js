const crypto = require('crypto');

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have name']
  },
  email: {
    type: String,
    required: [true, 'User must have password'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid Email Address']
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin', 'guid', 'lead-guid'],
      message: 'role can only be: user, admin, guid or lead-guid'
    },
    default: 'user'
  },
  imgUrl: String,
  password: {
    type: String,
    required: [true, 'User must have password'],
    minlength: [8, 'Password is atlest 8 charachter'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm password must be provided'],
    validate: {
      validator: function(value) {
        return this.password === value;
      },
      message: 'Password must match'
    }
  },
  passwordUpdatedAt: Date,
  passwordResetToken: String,
  passwordResetExpiresIn: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
    this.passwordConfirm = undefined;
  }
  next();
});

userSchema.pre('save', function(next) {
  if (this.isModified('password') && !this.isNew) {
    this.passwordUpdatedAt = Date.now() - 1000;
  }
  next();
});

userSchema.pre(/^find/, async function(next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.methods.verifyPassword = async function(
  canidatePassword,
  userPassword
) {
  return await bcrypt.compare(canidatePassword, userPassword);
};

userSchema.methods.isPasswordUpdated = function(JWTTimestamp) {
  if (this.passwordUpdatedAt) {
    const changedTimestamp = parseInt(
      this.passwordUpdatedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.setPasswordRestToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.passwordResetExpiresIn = Date.now() + 10 * 60 * 1000;

  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
