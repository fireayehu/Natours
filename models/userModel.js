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
  passwordUpdatedAt: Date
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
    this.passwordConfirm = undefined;
  }
  next();
});

userSchema.methods.verifyPassword = async function(
  canidatePassword,
  userPassword
) {
  return bcrypt.compare(canidatePassword, userPassword);
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

const User = mongoose.model('User', userSchema);

module.exports = User;
