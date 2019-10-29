const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      trim: true,
      required: [true, 'Review must be provided']
    },
    rating: {
      type: Number,
      required: [true, 'Review must have rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to user']
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to tour']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

reviewSchema.statics.calculateRating = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        numRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: stats[0] ? stats[0].avgRating : 4.5,
    ratingsQuantity: stats[0] ? stats[0].numRating : 0
  });
};

reviewSchema.post('save', async function(doc, next) {
  await this.constructor.calculateRating(doc.tour);
  next();
});

reviewSchema.post(/^findOneAnd/, async function(doc, next) {
  await doc.constructor.calculateRating(doc.tour);
  next();
});
module.exports = mongoose.model('Review', reviewSchema);
