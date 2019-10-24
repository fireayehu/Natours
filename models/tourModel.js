const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have name'],
    unique: true,
    maxlength: [40, 'Tour name must contain less than 40 letters'],
    minlength: [10, 'Tour name must contain greater than 10 letters']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'Tour must have duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour must have group size']
  },
  difficulty: {
    type: String,
    required: [true, 'Tour must have difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Tour Difficulty must be either easy,medium or difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating Average must be greater than 1'],
    max: [5, 'Rating Average must be less than 5']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Tour must have price']
  },
  priceDiscount: Number,
  summary: {
    type: String,
    required: [true, 'Tour must have description'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'Tour must have cover image']
  },
  images: [String],
  startDates: [Date],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
