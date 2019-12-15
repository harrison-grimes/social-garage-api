const { Router } = require('express');
const Car = require('./car');
const User = require('./user');

const app = Router();

app.use('/car', Car);
app.use('/user', User);
app.use('*', function({ method, originalUrl }, res) {
  res.status(404).json({
    code: 'API_ERROR',
    message: `Endpoint at '${originalUrl}' using [${method}] does not exist`
  });
});
app.use(function(err, req, res, next) {
  if (err.code === 'permission_denied') {
    res.status(403).send({ message: 'Insufficient priveliges' });
  } else if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: 'Invalid Token' });
  } else {
    next();
  }
});

module.exports = app;
