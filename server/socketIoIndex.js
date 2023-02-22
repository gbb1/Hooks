/* eslint-disable no-mixed-operators */
/* eslint-disable no-bitwise */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */

// SET UP EXPRESS SERVER
const express = require('express');

const app = express();
const cors = require('cors');
const path = require('path');

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

const requests = require('./requests.js');

// FUNCTION THAT WILL GENERATE A RANDOM 7 DIGIT STRING: LOBBY ID
function generateId() {
  const pattern = 'xxxxxxx';
  return pattern.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
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
const activeLobbies = new Set();

// PROVIDE INSTRUCTIONS FOR WHAT TO DO ON CONNECTION, AND WHAT EVENTS TO LISTEN FOR
io.on('connection', (socket) => {
  console.log(`a new user connected: ${socket.id.substr(0, 2)} `);

  // EMIT SUCCESS SIGNAL TO END LOADING ON CLIENT-SIDE
  io.to(socket.id).emit('connection-success', socket.id);

  socket.on('create', () => {
    console.log('creating a game');
    const id = generateId();
    activeLobbies.add(id);
    io.to(socket.id).emit('gameId', id);
  });

  socket.on('join-lobby', (id) => {
    console.log('lobby request received at,', id);
    if (activeLobbies.has(id)) {
      socket.join(id);
      io.to(socket.id).emit('join-success', id);
      io.to(id).emit('new-join', `${socket.id} has joined`);
    } else {
      io.to(socket.id).emit('fail', 'this lobby does not exist');
    }
  });

  socket.on('new-member', (data) => {
    console.log(data.lobby, data.user);
    io.to(data.lobby).emit('add-member', data.user);
  });

  socket.on('start-timer', (data) => {
    console.log('timer request received');
    startTimer(io, data.lobby, data.time);
  });

  socket.on('get-books', () => {
    requests.getBooks();
  });

  socket.on('gpt-request', (data) => {
    requests.gptAnswer(data.title, data.author);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(8089, () => console.log('listening on port:8089'));

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
