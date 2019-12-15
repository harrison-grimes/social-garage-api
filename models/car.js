const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const CarSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Car name is required']
  },
  bio: {
    type: String,
    required: [true, 'Car bio is required']
  },
  url: {
    type: String,
    required: [true, 'Car image url is required']
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

CarSchema.set('toJSON', {
  transform: (_, result) => {
    return {
      ...result,
      id: result._id,
      _id: undefined
    };
  }
});

const model = mongoose.model('Car', CarSchema);

module.exports = model;
