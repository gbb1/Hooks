/* eslint-disable no-param-reassign */
/* eslint-disable import/extensions */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable implicit-arrow-linebreak */
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

function getBook(lobbyId, randId) {
  randId = randId || Math.floor(Math.random() * (7719)) + 1;
  let book;

  return Books.find({ id: randId.toString() })
    .then((result) => {
      // console.log(result);
      book = result[0];
      return Lobbies.find({ lobby_id: lobbyId, 'history._id': result[0]._id });
    })
    .then((find) => {
      console.log('find', find);
      if (find.length === 0) {
        // console.log('BOOK', book);
        return Lobbies.findOneAndUpdate(
          { lobby_id: lobbyId },
          {
            $set: { current: book._id },
            $push: { history: book._id },
            $push: {
              answers: {
                socket: 'author', sentence: book.sentence, wager: 'none', writer_votes: 0, laugh_votes: 0,
              },
            },
          },
        );
      }
      // else {
      //   getBook(lobbyId);
      // }
    })
    .then(() => book)
    .catch((err) => {
      console.log(err);
    });
}

function checkLobby(lobbyId) {
  return Lobbies.find({ lobby_id: lobbyId });
}

function getAdmin(lobbyId) {
  return Lobbies.find({ lobby_id: lobbyId })
    .then((results) => Member.findById(results[0].admin))
    .catch((err) => {
      console.log(err);
    });
}

function addLobby(lobbyId) {
  return Lobbies.findOneAndUpdate(
    { lobby_id: lobbyId },
    { lobby_id: lobbyId },
    { upsert: true },
  )
    // .then(() => getBook(lobbyId))
    .catch((err) => {
      console.log(err);
    });
}

function addMember(lobbyId, socket, nickname) {
  return new Promise((resolve, reject) => {
    const newMember = new Member({
      socket_id: socket,
      lobby_id: lobbyId,
      username: nickname,
      ready: false,
      writer_points: 0,
      laugh_points: 0,
      writer_catch: 0,
      gpt_catch: 0,
      current: '',
    });

    newMember.save()
      .then((member) => Member.find({ lobby_id: lobbyId }).sort({ date: 1 })
        .then((results) =>
          // console.log("POTENTIAL ADMIN", results);
          Lobbies.findOneAndUpdate(
            { lobby_id: lobbyId },
            {
              admin: results[0]._id,
              $push: { members: member._id },
            },
            { new: true },
          )))
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function removeMember(socket) {
  return Member.findOneAndDelete({ socket_id: socket })
    .then((record) => {
      // console.log('RECORD::', record);
      if (record !== null) {
        return Lobbies.findOneAndUpdate(
          { lobby_id: record.lobby_id },
          { $pull: { members: record._id } },
          { new: true },
        );
      }
      return null;
    })
    .then((lob) => {
      // console.log(lob);
      const newAdmin = '';
      if (lob.members.length === 0) {
        return Lobbies.findOneAndDelete({ lobby_id: lob.lobby_id })
          .then((result) => (result));
      }
      // updateAdmin(lob)
      //   .then((result) => {
      //     console.log('UPDATED ADMIN', result);
      //   });
      return null;
    })
    .catch((err) => console.log(err));
}

function updateAdmin(lobby) {
  return Member.find({ lobby_id: lobby }).sort({ date: 1 })
    .then((results) => Lobbies.findOneAndUpdate(
      { lobby_id: lobby },
      {
        admin: results[0]._id,
      },
      { new: true },
    ))
    .then((result) =>
      // console.log(result);
      result)
    .catch((err) => {
      console.log(err);
    });
}

function checkAdmin(lobby, socket) {
  return Lobbies.find({ lobby_id: lobby })
    .then((results) => Member.findById(results[0].admin))
    .then((admin) =>
      // console.log('NEW', admin, admin.socket_id);
      admin.socket_id === socket)
    .catch((err) => console.log(err));
}

module.exports = {
  getBook,
  checkLobby,
  addLobby,
  removeMember,
  addMember,
  getAdmin,
  updateAdmin,
  checkAdmin,
};
