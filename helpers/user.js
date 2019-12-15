const { User } = require('../models'),
  bcrypt = require('bcryptjs'),
  jwt = require('jsonwebtoken');

module.exports = {
  signup,
  login,
  getUserById,
  list,
  setRole,
  remove
};

async function list() {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await User.find({}).select('-cars');
      resolve(users);
    } catch (err) {
      reject({ msg: 'Failure' });
    }
  });
}

async function signup({ email, password, name }) {
  try {
    const user = new User({ email, name });
    user.set('hashed_password', bcrypt.hashSync(password, 10));
    const { _id: id } = user.save();
    return createToken({ name, id, role: 'user' });
  } catch (err) {
    throw err;
  }
}

async function login({ email, password }) {
  try {
    const user = await getUserByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.hashed_password)) {
      throw 'INVALID_CREDENTIALS';
    }
    const { name, _id: id, role } = user;
    return createToken({ name, id, role });
  } catch (err) {
    throw err;
  }
}

async function getUserByEmail(email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw 'INVALID_CREDENTIALS';
  } else {
    return user;
  }
}

async function getUserById(id) {
  const user = await User.findById(id).select('+cars');
  if (!user) {
    throw 'NO_MATCHING_USER';
  } else {
    return user;
  }
}

async function setRole(id, role) {
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { role } },
      { new: true }
    );
    if (!user) {
      throw 'NO_MATCHING_USER';
    }
    return user;
  } catch (err) {
    throw err;
  }
}

async function remove(id) {
  try {
    const removed = await User.findByIdAndRemove(id);
    return { success: !!removed, removed };
  } catch (err) {
    throw err;
  }
}

function createToken({ name, id, role }) {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
      name,
      id,
      role
    },
    process.env.SECRET
  );
}
