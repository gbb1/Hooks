/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
/* eslint-disable no-console */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const axios = require('axios');
const express = require('express');
const path = require('path');
const cors = require('cors');
const routes = require('./Routes/routes');

const app = express();

// ----- Middleware ----- //

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);

app.listen(8081), () => {
  // connect to db
  console.log('Listening at http://localhost:8081');
};
