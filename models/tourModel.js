const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have name'],
    unique: true
  },
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
    required: [true, 'Tour must have difficulty']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
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
    default: Date.now()
  }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
