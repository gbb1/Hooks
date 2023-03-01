/* eslint-disable import/extensions */
/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
const {
  Books, connectDB, closeDB, Lobbies, Member,
} = require('../db2.js');
const {
  addLobby,
} = require('./creating.js');

// connectDB();

// addLobby('0000')
//   .then((out) => {
//     console.log(out);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

function setPrefs(lobbyId, settings) {
  // console.log('SETTINGS', settings);
  let vote_time = Number(settings.vote_time) || 30;
  vote_time = Math.max(vote_time, 30);
  vote_time = Math.min(vote_time, 120);
  let round_time = Number(settings.round_time) || 120;
  round_time = Math.max(round_time, 60);
  round_time = Math.min(round_time, 300);
  return Lobbies.findOneAndUpdate(
    { lobby_id: lobbyId },
    {
      vote_time: vote_time,
      round_time: round_time,
    },
  );
}

module.exports = {
  setPrefs,
};
