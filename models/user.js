const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  hashed_password: {
    type: String,
    required: [true, 'Hashed Password is required']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  cars: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Car'
      }
    ],
    default: [],
    select: false
  }
});

UserSchema.set('toJSON', {
  transform: (_, result) => {
    return {
      ...result,
      id: result._id,
      _id: undefined,
      hashed_password: undefined
    };
  }
});

const model = mongoose.model('User', UserSchema);

module.exports = model;
