/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-sequences */
/* eslint-disable no-dupe-keys */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const {
  Books, connectDB, closeDB, Lobbies, Member, setAnswer, setPrefs,
} = require('../db2.js');

// function getScores(lobby) {
//   return Lobbies.aggregate([
//     { $match: { lobby_id: lobby } },
//     { $unwind: '$answers' },
//     { $sort: { 'answers.writer_votes': -1 } },
//     { $group: { lobby_id: lobby, answers: { $push: '$answers' } } },
//   ])
//     .then((result) => {
//       console.log(result);
//     });
// }

// module.exports = {
//   getScores,
// };
