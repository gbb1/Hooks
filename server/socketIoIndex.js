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
    origin: "*",
  }, // security reasons, disable cors/allow any
});

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

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(8089, () => console.log('listening on port:8089'));

module.exports = io;
