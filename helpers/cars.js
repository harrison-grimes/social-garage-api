const { Car, User } = require('../models');

module.exports = {
  list,
  grab,
  create,
  update,
  remove,
  listCarsByOwner
};

async function list() {
  try {
    const cars = await Car.find({});
    return cars;
  } catch (err) {
    throw err;
  }
}

async function grab(id) {
  try {
    const car = await Car.findById(id);
    return car;
  } catch (err) {
    throw err;
  }
}

async function create(payload, owner) {
  try {
    const car = new Car({ ...payload, owner });
    const newCar = await car.save();
    console.log('owner:', owner);
    const user = await User.findByIdAndUpdate(
      owner,
      {
        $push: { cars: car._id }
      },
      { new: true }
    );
    console.log('user:', user);
    return newCar;
  } catch (err) {
    throw err;
  }
}

async function update(id, carUpdate) {
  try {
    const car = await Car.findByIdAndUpdate(id, carUpdate, { new: true });
    return car;
  } catch (err) {
    throw err;
  }
}

async function remove(id) {
  try {
    const removed = await Car.findByIdAndRemove(id);
    if (!removed) {
      throw 'DOES_NOT_EXIST';
    }
    await User.findByIdAndUpdate(removed.owner, {
      $pull: { cars: id }
    });
    return { success: !!removed, id, removed };
  } catch (err) {
    throw err;
  }
}

async function listCarsByOwner(owner) {
  try {
    const cars = await Car.find({ owner });
    return cars;
  } catch (err) {
    throw err;
  }
}
