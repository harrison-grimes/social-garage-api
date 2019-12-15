// initialize environment values
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;
require('dotenv').config({ path: `./${process.env.NODE_ENV}.env` });

// connect to db
require('./util/db');

// 3rd party dependencies
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

// internal dependencies
const api = require('./routes');

// create express app
const app = express();

// express middleware
app.use(bodyParser.json());
app.use(cors());
app.use(logger('dev'));

// create express API
app.use('/', api);

// start listening for requests
app.listen(PORT);
console.log(`listening on port: ${PORT}`);
