/* eslint-disable camelcase */
const express = require('express');
// const db = require('../readDataReviews');

const router = express.Router();

router.get('/test', (req, res) => {
  console.log('getting test request');

  res.status(200).send('Test request received');
});

module.exports = router;
