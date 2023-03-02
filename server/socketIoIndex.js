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
const morgan = require('morgan');

app.use(morgan);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

// CREATE AN HTTP INSTANCE OF EXPRESS SERVER
const server = require('http').createServer(app);

// SET UP SOCKET IO SERVER USING HTTP INSTANCE
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }, // security reasons, disable cors/allow any
});

const {
  Books, connectDB, closeDB, Lobbies, Member, Answers,
} = require('./db2.js');
const {
  getBook,
  checkLobby,
  addLobby,
  removeMember,
  addMember,
  getAdmin,
  updateAdmin,
  checkAdmin,
} = require('./queries/creating.js');
const {
  setPrefs,
} = require('./queries/lobbySetup.js');
const {
  setAnswer,
  setAnswer2,
  checkDone,
} = require('./queries/gamePlay.js');
const {
  decVote,
  getAnswers,
  changeWriter,
  findWriter,
  voteWriter,
  incWriterVote,
  incLaughVote,
  minusWriterVote,
  minusLaughVote,
} = require('./queries/voting.js');
const {
  getScores,
} = require('./queries/scores.js');

const requests = require('./requests.js');

// const { getNewBook } = require('./emitters/gettingBook.js');

// FUNCTION THAT WILL GENERATE A RANDOM 7 DIGIT STRING: LOBBY ID
function generateId() {
  const pattern = 'xxxx';
  return pattern.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16).toUpperCase();
  });
}

// FUNCTION TO START AND UPDATE THE TIMER ON A 1 SECOND INTERVAL
let killer;
function startTimer(s, lobby, start, vote = 0) {
  let timeLeft = start;
  const interval = setInterval(() => {
    if (timeLeft === start) {
      // console.log('sending killer', killer);
      s.to(lobby).emit('timer-killer', { function: JSON.stringify(killer) });
    }
    timeLeft--;
    // console.log('SENDING TIMER');
    if (vote === 1) {
      s.to(lobby).emit('vote-timer-update', timeLeft);
    } else {
      s.to(lobby).emit('timer-update', timeLeft);
    }
    if (timeLeft === 0) {
      clearInterval(interval);
      if (vote === 1) {
        s.to(lobby).emit('vote-timer-done', {});
      } else {
        s.to(lobby).emit('timer-done', {});
      }
    }
  }, 1000);
  const killer = function clearer() {
    console.log('clearing', interval);
    clearInterval(interval);
  };
  return killer;
}

// STORE ACTIVE LOBBIES IN A SET THAT WE CAN REFERENCE LATER

/*
  round:
    1: ?
      socket_id:
        answer: 'Example sentence answer'
        wager: 'votes_writer' || 'laughs' || 'none'
        writer: 3
        laughs: 2
        writer_vote: true || false
        missed_points: 0

  function typePoints(type, play) {
    if (type === 'writer') {
      return play['writer'] * 2;
    } else {
      return play['laughs'];
    }
  }

  function calcPoints(id) {

    let play = round[id];
    let score = 0;

    const missed = {
      'writer': 'laughs'
      'laughs' : 'writer'
    }

    if (wager !== 'none') {
      score += play[wager] * 2
      play.missed_points = typePoints(missed[wager], play);
    } else {
      score += 2 * play.votes_writer + play.laughs
    }
    if (play.writer_vote) {
      score += 2;
    }
    return score; // add score to DB?
  }

  // response
  function updateHistory(lobby, data) {
    if (lobbyDetails[lobby].history === undefined) {
      lobbyDetails[lobby].history = new Set();
      lobbyDetails[lobby].history.add(data.id);
    } else {
      lobbyDetails[lobby].history.add(data.id);
    }
  }

*/

// function startNewRound(lobby) {
//   getBook(lobby)
//     .then((book) => {
//       console.log('book:::', book);
//       requests.getGptAnswer(book.title)
//         .then((answer) => {
//           console.log('asnwerr:', answer);
//           Lobbies.findOneAndUpdate(
//             { lobby_id: lobby },
//             { gpt: answer },
//             { new: true },
//           )

// }

function getNewBook(lobby) {
  console.log('CALLING GET NEW BOOK');
  getBook(lobby)
    .then((result) => {
      // console.log('GAME BOOK', result);
      io.to(lobby).emit('game-book', result);
      return result;
    })
    .then((book) => {
      // console.log('book:::', book);
      requests.getGptAnswer(book.title)
        // eslint-disable-next-line arrow-body-style
        .then((answer) => {
          // console.log('STOP TIMER?');
          if (answer !== undefined) {
            return Lobbies.findOneAndUpdate(
              { lobby_id: lobby },
              {
                $push: {
                  answers: {
                    socket: 'gpt', sentence: answer, wager: 'none', writer_votes: 0, laugh_votes: 0,
                  },
                },
                gpt: answer,
              },
              { new: true },
            )
              .then((res) => {
                // console.log('ASDASDASD', res);
              });
          }
          // io.to(lobby).emit('gpt-answer', answer);
        });
    })
    .catch((err) => {
      console.log(err);
      io.send(lobby).emit('book-error', err);
    });
}

// PROVIDE INSTRUCTIONS FOR WHAT TO DO ON CONNECTION, AND WHAT EVENTS TO LISTEN FOR
const nicknames = new Set();

io.on('connection', (socket) => {
  console.log(`a new user connected: ${socket.id.substr(0, 2)} `);
  let timeClear;

  // EMIT SUCCESS SIGNAL TO END LOADING ON CLIENT-SIDE
  io.to(socket.id).emit('connection-success', socket.id);
  // res.cookie('socketId', socket.id);

  socket.on('create', () => {
    console.log('creating a game');
    const id = generateId().toUpperCase();
    addLobby(id)
      .then(() => {
        io.to(socket.id).emit('gameId', id);
      })
      .catch((err) => {
        console.log(err);
        io.to(socket.id).emit('create-error');
      });
  });

  socket.on('join-lobby', ({ id, nickname }) => {
    console.log('lobby request received at,', id.trim());
    console.log(nickname);
    if (nickname === '') {
      nickname = socket.id.substring(0, 7).toUpperCase();
      console.log('NICKNAME', nickname);
    }
    id = id.trim();
    checkLobby(id)
      .then((result) => {
        if (result.length === 0) {
          io.to(socket.id).emit('fail', 'this lobby does not exist');
        } else {
          addMember(id, socket.id, nickname)
            .then(() => {
              socket.join(id);
              io.to(socket.id).emit('join-success', id);
              io.to(id).emit('new-join', `${socket.id} has joined`);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  /* IN LOBBY */
  socket.on('new-member', (data) => {
    // console.log(data.lobby, data.user);

    Member.find({ lobby_id: data.lobby })
      .then((result) => {
        io.to(data.lobby).emit('add-member', result);
      })
      .then(() => getAdmin(data.lobby))
      .then((results) => {
        // console.log('ADMIN RESULTS', results);
        io.to(data.lobby).emit('set-admin', results.username);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on('ready-up', (data) => {
    // console.log('player ready');
    Member.findOneAndUpdate({ socket_id: socket.id }, { ready: true })
      .then((user) => Member.find({ lobby_id: user.lobby_id }))
      .then((members) => {
        io.to(data.lobby).emit('player-ready', members);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on('set-times', (data) => {
    // console.log('TIMES:', data.vote_time, data.round_time);
    checkAdmin(data.lobby, socket.id)
      .then((check) => {
        // console.log('SETTING TIME', data);
        if (check) {
          setPrefs(data.lobby, data)
            .then((res) => {
              console.log(res);
            });
        }
      });
  });

  /* IN GAME */
  socket.on('start-timer-round', (data) => {
    console.log('timer request received');
    checkAdmin(data, socket.id)
      .then((check) => {
        if (check) {
          // console.log('checked!');
          Lobbies.find({ lobby_id: data })
            .then((results) => {
              const time = results[0].round_time;
              killer = startTimer(io, data, time);
              // console.log('getting cleare', killer);
            });
        }
      })
      .catch((err) => console.log(err));
  });

  socket.on('game-start', (lobby) => {
    checkAdmin(lobby, socket.id)
      .then((check) => {
        if (check) {
          (async () => getNewBook(lobby))();
          io.to(lobby).emit('starting-game', {});
        }
      })
      .catch((err) => console.log(err));
  });

  socket.on('player-answer', (data) => {
    // console.log('PLAYER ANSWER', data);
    setAnswer2(data)
      .then(() => {
        io.to(data.lobby).emit('player-answer-in');
        return checkDone(data.lobby);
      })
      .then((check) => {
        // console.log('CHECKING', check);
        if (check) {
          // console.log(typeof data.killer);
          killer();
          io.to(data.lobby).emit('all-responses-in');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on('gpt-request', (data) => {
    requests.gptAnswer(data.title, data.author);
  });

  /* VOTING */

  socket.on('start-voting', (data) => {
    Lobbies.findOne({ lobby_id: data.lobby })
      .then((results) => {
        // console.log('RESPONSE FROM GETANS', results);
        Books.findById(results.current)
          .then((res) => {
            // console.log(res);
            io.to(data.lobby).emit('voting-book', res);
          })
          .then(() => {
            io.to(data.lobby).emit('player-answers', results.answers);
          });
        return results;
      })
      .then((results) => {
        startTimer(io, data.lobby, results.vote_time, 1);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on('writer-vote', (data) => {
    incWriterVote(data.lobby, data.vote_writer)
      .then((result) => {
        // console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on('minus-writer-vote', (data) => {
    minusWriterVote(data.lobby, data.vote_writer)
      .then((result) => {
        // console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on('laugh-vote', (data) => {
    incLaughVote(data.lobby, data.vote_laugh)
      .then((result) => {
        // console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on('minus-laugh-vote', (data) => {
    minusLaughVote(data.lobby, data.vote_laugh)
      .then((result) => {
        // console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on('votes-in', (lobby) => {
    Member.findOne({ lobby_id: lobby, socket_id: socket.id })
      .then((memb) => Lobbies.findOneAndUpdate(
        { lobby_id: lobby },
        { $push: { voted: memb._id } },
        { new: true },
      ))
      .then((lob) => {
        if (lob.members.length === lob.voted.length) {
          // console.log('all votes in');
          io.to(lobby).emit('all-votes-in', {});
        } else {
          Member.find({ _id: { $in: lob.voted } })
            .then((results) => {
              console.log('VOTERS', results);
              io.to(lobby).emit('voter-update', results);
            });
        }
      });
  });

  /* SCORING */

  socket.on('get-scores', (lobby) => {
    checkAdmin(lobby, socket.id)
      .then((check) => {
        if (check) {
          return Lobbies.findOne({ lobby_id: lobby });
        }
        return null;
      })
      .then((result) => {
        if (result !== null) {
          // console.log('SCORING:', result.answers);
          io.to(lobby).emit('scores', result.answers);
        }
      })
      .catch((err) => console.log(err));
  });

  socket.on('run-it-back', (lobby) => {
    Lobbies.findOneAndUpdate(
      { lobby_id: lobby },
      {
        $set: { answers: [] },
      },
      {
        new: true,
      },
    )
      .then((result) => {
        Member.updateMany(
          { lobby_id: lobby },
          { ready: false },
        )
          .then((res) => {
            if (result.answers.length === 0) {
              io.to(lobby).emit('new-game-start', {});
            }
          });
      });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    let lobby = null;
    Member.find({ socket_id: socket.id })
      .then((result) => {
        // console.log("step 1", result);
        if (result.length > 0) {
          lobby = result[0].lobby_id;
        }
      })
      .then(() => removeMember(socket.id))
      .then(() => Member.find({ lobby_id: lobby }))
      .then((mems) => {
        // console.log('step 2', mems);
        if (mems.length !== 0) {
          // console.log('SEDING MEMS', mems);
          io.to(lobby).emit('player-left', mems);
          updateAdmin(lobby)
            .then((results) => Member.findById(results.admin))
            .then((result) => {
              if (result !== null) {
                io.to(lobby).emit('set-admin', result.username);
              }
            });
        }
      });
  });
});

server.listen(8089, () => {
  console.log('listening on port:8089');
  connectDB();
});

module.exports = io;
