/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-bitwise */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */

// SET UP EXPRESS SERVER
const express = require('express');

const app = express();
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

app.listen(3005, () => {
  console.log('listening on port:3005');
});
