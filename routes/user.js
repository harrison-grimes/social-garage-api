const { Router } = require('express');
const jwt = require('express-jwt');
const guard = require('express-jwt-permissions')({
  permissionsProperty: 'role'
});

const User = require('../helpers/user');
const validate = require('../middleware/validator');
const {
  SignupSchema,
  LoginSchema,
  UpdateRoleSchema
} = require('../schemas/user');

const app = Router();

app.post('/login', validate(LoginSchema), async (req, res) => {
  try {
    const token = await User.login(req.body);
    res.json({ token });
  } catch (err) {
    if (err === 'INVALID_CREDENTIALS') {
      res.status(400).json({ message: 'Invalid Credentials' });
    }
    console.error(err);
    res.status(500).json({ message: 'Unknown Error' });
  }
});

app.post('/signup', validate(SignupSchema), async (req, res) => {
  try {
    const token = await User.signup(req.body);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unknown Error' });
  }
});

app.get(
  '/',
  jwt({ secret: process.env.SECRET }),
  guard.check('admin'),
  async (req, res) => {
    try {
      const users = await User.list();
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Unknown Error' });
    }
  }
);

app.get('/:id', jwt({ secret: process.env.SECRET }), async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);
    if (req.user.role !== 'admin') {
      user.set('email', undefined);
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    if (err === 'NO_MATCHING_USER') {
      return res.status(404).json({ message: 'User does not exist' });
    }
    res.status(500).json({ message: 'Unknown Error' });
  }
});

app.delete(
  '/:id',
  jwt({ secret: process.env.SECRET }),
  guard.check('admin'),
  async (req, res) => {
    try {
      const user = await User.remove(req.params.id);
      res.json(user);
    } catch (err) {
      console.error(err);
      if (err === 'NO_MATCHING_USER') {
        return res.status(404).json({ message: 'User does not exist' });
      }
      res.status(500).json({ message: 'Unknown Error' });
    }
  }
);

app.put(
  '/:id/role',
  jwt({ secret: process.env.SECRET }),
  guard.check('admin'),
  validate(UpdateRoleSchema),
  async (req, res) => {
    try {
      const user = await User.setRole(req.params.id, req.body.role);
      res.json(user);
    } catch (err) {
      console.error(err);
      if (err === 'NO_MATCHING_USER') {
        return res.status(404).json({ message: 'User does not exist' });
      }
      res.status(500).json({ message: 'Unknown Error' });
    }
  }
);

module.exports = app;
