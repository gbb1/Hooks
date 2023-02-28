/* eslint-disable no-mixed-operators */
/* eslint-disable no-bitwise */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */

// SET UP EXPRESS SERVER
const express = require('express');

const app = express();
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser);

// CREATE AN HTTP INSTANCE OF EXPRESS SERVER
const server = require('http').createServer(app);

// SET UP SOCKET IO SERVER USING HTTP INSTANCE
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }, // security reasons, disable cors/allow any
});

const {
  Books, connectDB, closeDB, getBook, addLobby, addMember,
  checkLobby, Lobbies, Member, removeMember, setAnswer, setPrefs,
} = require('./db2.js');
const requests = require('./requests.js');

// FUNCTION THAT WILL GENERATE A RANDOM 7 DIGIT STRING: LOBBY ID
function generateId() {
  const pattern = 'xxxxxxx';
  return pattern.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16).toUpperCase();
  });
}

// FUNCTION TO START AND UPDATE THE TIMER ON A 1 SECOND INTERVAL
function startTimer(s, lobby, start) {
  let timeLeft = start;
  const interval = setInterval(() => {
    timeLeft--;
    s.to(lobby).emit('timer-update', timeLeft);
    if (timeLeft === 0) {
      clearInterval(interval);
    }
  }, 1000);
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
  getBook(lobby)
    .then((result) => {
      io.to(lobby).emit('game-book', result);
      return result;
    })
    .then((book) => {
      // console.log('book:::', book);
      requests.getGptAnswer(book.title)
        .then((answer) => {
          // console.log('asnwerr:', answer);
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

// PROVIDE INSTRUCTIONS FOR WHAT TO DO ON CONNECTION, AND WHAT EVENTS TO LISTEN FOR
const nicknames = new Set();

io.on('connection', (socket) => {
  console.log(`a new user connected: ${socket.id.substr(0, 2)} `);

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
    console.log('lobby request received at,', id);
    console.log(nickname);
    if (nickname === '') {
      nickname = socket.id.substring(0, 7).toUpperCase();
      console.log('NICKNAME', nickname);
    }

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
    // if (activeLobbies.has(id)) {
    //   socket.join(id);
    //   io.to(socket.id).emit('join-success', id);
    //   io.to(id).emit('new-join', `${socket.id} has joined`);
    // } else {
    //   io.to(socket.id).emit('fail', 'this lobby does not exist');
    // }
  });

  /* IN LOBBY */
  socket.on('new-member', (data) => {
    console.log(data.lobby, data.user);

    Member.find({ lobby_id: data.lobby })
      .then((result) => {
        console.log(result);
        io.to(data.lobby).emit('add-member', result);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on('ready-up', (data) => {
    console.log('player ready');
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
    console.log('SETTING TIME', data);
    setPrefs(data.lobby, data)
      .then((res) => {
        console.log(res);
      });
  });

  /* IN GAME */
  socket.on('start-timer-round', (data) => {
    console.log('timer request received');
    Lobbies.find({ lobby_id: data })
      .then((results) => {
        const time = results[0].round_time;
        startTimer(io, data, time);
      });
  });

  socket.on('game-start', (lobby) => {
    getNewBook(lobby);
    // .then(() => Lobbies.find({ lobby_id: lobby }))
    // .then((results) => {
    //   console.log('resultssss', results);
    //   io.to(lobby).emit('game-book', results[0]);
    // })
    // .catch((err) => console.log(err));
  });

  socket.on('player-answer', (data) => {
    // console.log('PLAYER ANSWER', data);
    setAnswer(data.socket, data)
      .then(() => {
        io.to(data.lobby).emit('player-answer-in');
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on('gpt-request', (data) => {
    requests.gptAnswer(data.title, data.author);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    let lobby = null;
    Member.find({ socket_id: socket.id })
      .then((result) => {
        if (result.length > 0) {
          lobby = result[0].lobby_id;
        }
      })
      .then(() => removeMember(socket.id))
      .then(() => {
        if (lobby !== null) {
          Member.find({ lobby_id: lobby })
            .then((mems) => {
              io.to(lobby).emit('player-left', mems);
            });
        }
      });
  });
});

server.listen(8089, () => {
  console.log('listening on port:8089');
  connectDB();
  // getBook()
  //   .then((result) => {
  //     console.log(Number(result[0].id));
  //     console.log(result[0]);
  //   });
  // getNewBook('0000');
});

module.exports = io;

// socket.on('message', (message) => {
//   console.log(message);
//   // io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
// });

// socket.on('test', (content) => {
//   console.log(content);
//   io.emit('message', `${socket.id.substr(0, 2)}: ${content}`);
// });

// socket.on('lobby-post', (data) => {
//   console.log(data.lobby, data.post);
//   io.to(data.lobby).emit('new-post', data.post);
// });
