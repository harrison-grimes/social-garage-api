const mongoose = require('mongoose');

// use built-in promises
mongoose.Promise = global.Promise;
console.log('connecting to db...');

// connect
mongoose
  .connect(process.env.MONGO_CONN_STR, { useNewUrlParser: true })
  .then(
    () => console.log('successfully connected to db'),
    err => console.error('failed to connect:', err)
  );

// handle future errors
mongoose.connection.once('open', function() {
  // mongoose.set('debug', true);
  mongoose.connection.on('error', err => {
    console.log('Mongoose Error:');
    console.log(JSON.stringify(err));
  });
  mongoose.connection.on('disconnected', () => {
    console.error('lost connection');
  });
  mongoose.connection.on('index', err => {
    if (err) console.log('ERROR CREATING INDEXES:', err);
    else console.log('Successfully created indexes');
  });
});
