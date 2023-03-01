const io = require('../socketIoIndex.js');

const {
  Books, connectDB, closeDB, Lobbies, Member, Answers,
} = require('../db2.js');
const {
  getBook,
  checkLobby,
  addLobby,
  removeMember,
  addMember,
} = require('../queries/creating.js');
const {
  setPrefs,
} = require('../queries/lobbySetup.js');
const {
  setAnswer,
} = require('../queries/gamePlay.js');
const {
  decVote,
  getAnswers,
  changeWriter,
  findWriter,
  voteWriter,
} = require('../queries/voting.js');
const requests = require('../requests.js');

function getNewBook(lobby) {
  getBook(lobby)
    .then((result) => {
      io.to(lobby).emit('game-book', result);
      return result;
    })
    .then((book) => {
      requests.getGptAnswer(book.title)
        // eslint-disable-next-line arrow-body-style
        .then((answer) => {
          return Lobbies.findOneAndUpdate(
            { lobby_id: lobby },
            { gpt: answer },
            { new: true },
          )
            .then((res) => {
              console.log('ASDASDASD', res);
            })
            .catch((err) => {
              console.log(err);
            });
          // io.to(lobby).emit('gpt-answer', answer);
        })
        .then((response) => {
          console.log('GPT ADD?', response);
        });
    })
    .catch((err) => {
      console.log(err);
      io.send(lobby).emit('book-error', err);
    });
}

module.exports = {
  getNewBook,
};
