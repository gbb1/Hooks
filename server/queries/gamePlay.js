/* eslint-disable import/extensions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
const mongoose = require('mongoose');
const {
  Books, connectDB, closeDB, Lobbies, Member, Answers,
} = require('../db2.js');

function setAnswer(socket, submit) {
  return Answers.findOneAndUpdate(
    { player: socket },
    {
      player: socket,
      sentence: submit.sentence,
      wager: submit.wager,
      writer_votes: 0,
      laugh_votes: 0,
    },
    { new: true },
  )
    .then((ans) => {
      // console.log('LOOK HERE', ans);
      Member.findOneAndUpdate(
        { socket_id: socket },
        {
          current: submit.sentence,
          wager: ans.wager,
          $push: { answers: ans._id },
        },
      );
    })
    .catch((err) => {
      console.log(err);
    });
}

function setAnswer2(data) {
  return Lobbies.findOneAndUpdate(
    { lobby_id: data.lobby },
    {
      $push: {
        answers: {
          socket: data.socket, sentence: data.sentence, wager: data.wager, writer_votes: 0, laugh_votes: 0,
        },
      },
    },
  );
}

function checkDone(lobby) {
  return Lobbies.findOne({ lobby_id: lobby })
    .then((result) => (result.members.length === result.answers.length - 2))
    .catch((err) => {
      console.log(err);
    });
}

// connectDB();

// setAnswer()

module.exports = {
  setAnswer,
  setAnswer2,
  checkDone,
};
