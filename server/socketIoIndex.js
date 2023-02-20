const express = require('express');

const app = express();
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

const server = require('http').createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }, // security reasons, disable cors/allow any
});

function generateId() {
  const pattern = 'xxxxxxx';
  return pattern.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const activeLobbies = new Set();
let lobby = '';

io.on('connection', (socket) => {
  console.log(`a new user connected: ${socket.id.substr(0, 2)} `);

  socket.on('message', (message) => {
    console.log(message);
    // io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
  });

  socket.on('test', (content) => {
    console.log(content);
    io.emit('message', `${socket.id.substr(0, 2)}: ${content}`);
  });

  socket.on('create', () => {
    console.log('creating a game');
    const id = generateId();
    activeLobbies.add(id);
    console.log('id: ', id);
    io.to(socket.id).emit('gameId', id);
  });

  socket.on('join-lobby', (id) => {
    console.log('lobby request received at,', id);
    if (activeLobbies.has(id)) {
      socket.join(id);
      lobby = id;
      io.to(socket.id).emit('join-success', id);
      io.to(id).emit('new-join', `${socket.id} has joined`);
    } else {
      io.to(socket.id).emit('fail', 'this lobby does not exist');
    }
  });

  socket.on('lobby-post', (data) => {
    console.log(data.lobby, data.post);
    io.to(data.lobby).emit('new-post', data.post);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(8089, () => console.log('listening on port:8089'));

module.exports = io;
