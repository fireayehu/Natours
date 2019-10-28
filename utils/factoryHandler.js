const { catchAsync } = require('./../controllers/errorController');
const AppError = require('./appError');
const APIFeatures = require('./apiFeatures');

exports.getAll = (Model, ...popOptions) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    let query = Model.find(filter);
    for (const option of popOptions) {
      query = query.populate(option);
    }
    const features = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .limitField()
      .paginate();
    const docs = await features.query;

    res
      .status(200)
      .json({ status: 'success', results: docs.length, data: { docs } });
  });

exports.getOne = (Model, ...popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    for (const option of popOptions) {
      query = query.populate(option);
    }
    const doc = await query;

    if (!doc) {
      return next(new AppError('Document with this ID does not exist', 404));
    }
    res.status(200).json({ status: 'success', data: { doc } });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { doc }
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return next(new AppError('Document with this ID does not exist', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { doc }
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('Document with this ID does not exist', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
