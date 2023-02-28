/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const member = new mongoose.Schema({
  socket_id: { type: String, unique: true },
  lobby_id: String,
  username: String,
  ready: Boolean,
  writer_points: Number,
  laugh_points: Number,
  writer_catch: Number,
  gpt_catch: Number,
  current: String,
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answers' }],
});

const books = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  sentence: { type: String, required: true },
  url: String,
});

const answer = new mongoose.Schema({
  player: String,
  round: Number,
  sentence: String,
  wager: String,

});

const lobby = new mongoose.Schema({
  lobby_id: { type: String, unique: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Books' }],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  current: String,
  author: String,
  title: String,
  vote_time: Number,
  round_time: Number,
  answer: String,
  gpt: String,
});

const booksUrl = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  sentence: { type: String, required: true },
  url: String,
  summary: String,
});

const users = new mongoose.Schema({
  users: member,
});

// const books = new mongoose.Schema({
//   books: [book],
// });

const Lobbies = mongoose.model('Lobbies', lobby);
const Users = mongoose.model('Users', users);
const Books = mongoose.model('Books', books);
// const Book = mongoose.model('book', book);
const Member = mongoose.model('Member', member);
const BooksUrl = mongoose.model('BooksUrl', booksUrl);
const Answers = mongoose.model('Answers', answer);

/* --------------------------------------------------------------------- */

/* HELPER FUNCTIONS */

/* GAME SETUP */
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
      // console.log('find', find);
      if (find.length === 0) {
        // console.log('BOOK', book);
        return Lobbies.findOneAndUpdate(
          { lobby_id: lobbyId },
          {
            author: book.author,
            title: book.title,
            current: book.sentence,
            $push: { history: book._id },
          },
        );
      }
      getBook(lobbyId);
    })
    .then(() => book)
    .catch((err) => {
      console.log(err);
    });
}

function checkLobby(lobbyId) {
  return Lobbies.find({ lobby_id: lobbyId });
}

function addLobby(lobbyId) {
  return Lobbies.findOneAndUpdate(
    { lobby_id: lobbyId },
    { lobby_id: lobbyId, current: '' },
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
      .then((member) => Lobbies.findOneAndUpdate(
        { lobby_id: lobbyId },
        { $push: { members: member._id } },
        { new: true },
      ))
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function removeMember(socket) {
  return new Promise((resolve, reject) => {
    Member.findOneAndDelete({ socket_id: socket })
      .then((record) => {
        console.log('RECORD::', record);
        if (record !== null) {
          return Lobbies.findOneAndUpdate(
            { lobby_id: record.lobby_id },
            { $pull: { members: record._id } },
            { new: true },
          );
        }
        resolve(null);
      })
      .then((lob) => {
        console.log(lob);
        if (lob.members.length === 0) {
          Lobbies.findOneAndDelete({ lobby_id: lob.lobby_id })
            .then((result) => {
              resolve(result);
            });
        } else {
          resolve(lob);
        }
      })
      .catch((err) => reject(err));
  });
}

/* GAME SETTINGS */
function setPrefs(lobbyId, settings) {
  console.log('SETTINGS', settings);
  const vote_time = settings.vote_time || 120;
  const round_time = settings.round_time || 120;
  console.log(vote_time, round_time);
  return Lobbies.findOneAndUpdate(
    { lobby_id: lobbyId },
    {
      vote_time: vote_time,
      round_time: round_time,
    },
  );
}

/* GAME PLAY */
function setAnswer(socket, submit) {
  return Answers.findOneAndUpdate(
    { player: socket },
    {
      player: socket,
      sentence: submit.sentence,
      wager: submit.wager,
    },
    { new: true },
  )
    .then((ans) => {
      console.log('LOOK HERE', ans);
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

/* VOTING */

// RETURN THE LOBBY TO GET ARRAY OF ANSWERS/SOCKETS
function getAnswers(lobbyId) {
  return Member.find({ lobby_id: lobbyId });
}

// RECEIVE POINTS IF SOMEONE LAUGHS OR WRITER VOTES
function voteWriter(socket, vote) {
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

/* GENERAL */

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1/hook');
    console.log('MongoDB connected...');
  } catch (error) {
    console.log(`error: ${error}`);
    process.exit(1);
  }
};

const closeDB = () => {
  mongoose.connection.close();
};

// connectDB();
// addLobby('0000')
//   .then((out) => {
//     console.log(out);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// addMember('0000', '1', 'testo')
//   .then((out) => {
//     console.log(out);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// removeMember('SvOvy3XmKrFIsCAYAAAD')
//   .then((out) => {
//     console.log(out);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// checkLobby('0000')
//   .then((out) => {
//     console.log(out);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// getBook('0000')
//   .then((out) => {
//     console.log('out:', out);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// saveLobby('1234');

module.exports = {
  connectDB,
  closeDB,
  Lobbies,
  Users,
  Books,
  Member,
  BooksUrl,
  getBook,
  addLobby,
  addMember,
  removeMember,
  checkLobby,
  Answers,
  setAnswer,
  setPrefs,
};
