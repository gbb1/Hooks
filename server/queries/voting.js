/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const {
  Books, connectDB, closeDB, Lobbies, Member, setAnswer, setPrefs,
} = require('../db2.js');

function getAnswers(lobbyId) {
  return Lobbies.find({ lobby_id: lobbyId })
    .then((results) => results);
}

function incWriterVote(lobbyId, target) {
  return Lobbies.updateOne(
    {
      lobby_id: lobbyId,
      'answers.socket': target,
    },
    {
      $inc: { 'answers.$.writer_votes': 1 },
    },
  )
    .then((result) => {
      console.log(result);
    });
}

function minusWriterVote(lobbyId, target) {
  return Lobbies.updateOne(
    {
      lobby_id: lobbyId,
      'answers.socket': target,
    },
    {
      $inc: { 'answers.$.writer_votes': -1 },
    },
  )
    .then((result) => {
      console.log(result);
    });
}

function incLaughVote(lobbyId, target) {
  return Lobbies.updateOne(
    {
      lobby_id: lobbyId,
      'answers.socket': target,
    },
    {
      $inc: { 'answers.$.laugh_votes': 1 },
    },
  )
    .then((result) => {
      console.log(result);
    });
}

function minusLaughVote(lobbyId, target) {
  return Lobbies.updateOne(
    {
      lobby_id: lobbyId,
      'answers.socket': target,
    },
    {
      $inc: { 'answers.$.laugh_votes': -1 },
    },
  )
    .then((result) => {
      console.log(result);
    });
}

// RECEIVE POINTS IF SOMEONE LAUGHS OR WRITER VOTES
function getVote(socket, vote) {
  const { writer, laugh } = vote;

  const promises = [];

  if (vote.writer !== undefined) {
    promises.push(Member.findOneAndUpdate(
      { socket_id: writer },
      { $inc: { writer_points: 2 } },
    ));
  }
  if (vote.laugh !== undefined) {
    promises.push(Member.findOneAndUpdate(
      { socket_id: laugh },
      { $inc: { laugh_points: 2 } },
    ));
  }

  return Promise.all(promises);
}

// FIND THE CORRECT WRTIER, INCREMENT WRITER GUESS
function findWriter(socket) {
  return Member.findOneAndUpdate(
    { socket_id: socket },
    { $inc: { writer_catch: 2 } },
  );
}

// CHANGE MIND FROM CORRECT WRTIER, DECREMENT WRITER GUESS
function changeWriter(socket) {
  return Member.findOneAndUpdate(
    { socket_id: socket },
    { $inc: { writer_catch: -2 } },
  );
}

// LOSE POINTS IF SOMEONE CHANGES THEIR VOTE
function decVote(vote) {
  // vote must have socket and type
  if (vote.type === 'writer') {
    return Member.findOneAndUpdate(
      { socket_id: vote.socket },
      { $inc: { writer_points: -2 } },
    );
  } if (vote.type === 'laugh') {
    return Member.findOneAndUpdate(
      { socket_id: vote.socket },
      { $inc: { laugh_points: -1 } },
    );
  }
}

module.exports = {
  decVote,
  getAnswers,
  changeWriter,
  findWriter,
  getVote,
  incWriterVote,
  incLaughVote,
  minusWriterVote,
  minusLaughVote,
};
