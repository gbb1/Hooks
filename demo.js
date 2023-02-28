// /* eslint-disable no-trailing-spaces */
// /* eslint-disable padded-blocks */
// /* eslint-disable camelcase */
// /* eslint-disable no-console */
// /* eslint-disable no-undef */
// /* eslint-disable no-unused-vars */
// /* eslint-disable import/no-extraneous-dependencies */

// // ----------------------
// // BACK-END:

// install:

// backend:
// - express
// - http
// - WebSocket
// - socket.io

// frontend:
// - import { io } from 'socket.io-client';
// - react useContext, createContext


// // SET UP EXPRESS SERVER
// const express = require('express');

// const app = express();
// const cors = require('cors');
// const path = require('path');

// app.use(cors());
// app.use(express.json());
// app.use(express.static(path.join(__dirname, '../public')));
// app.use(express.urlencoded({ extended: true }));

// // CREATE AN HTTP INSTANCE OF EXPRESS SERVER - EXPRESS CAN'T WORK WITH WEBSOCKET ON ITS OWN
// const server = require('http').createServer(app);

// // SET UP SOCKET IO SERVER USING HTTP INSTANCE
// const io = require('socket.io')(server, {
//   cors: {
//     origin: '*',
//   },
// });

// io.on('connection', (socket) => {
//   console.log(`a new user connected: ${socket.id.substr(0, 2)} `);

//   // EMIT EVENT ONLY TO SPECIFIC USER
//   // IN THIS CASE, A SUCCESS MESSAGE TO END CLIENT SIDE LOADING
//   io.to(socket.id).emit('EVENT-NAME', 'INSERT CONTENT HERE');

//   // EVENT LISTENER TO DETECT EVENTS EMITTED BY THE CLIENT
//   socket.on('EVENT-FROM-CLIENT-NAME', (data_from_client) => {
//     console.log(`DO SOMETHING WITH ${data_from_client}`);
//   });

//   // LOBBY JOIN EXAMPLE
//   socket.on('join-lobby', (lobby_id) => {

//     // STORE ACTIVE IDS SOMEWHERE AND CHECK THAT THIS IS A VALID LOBBY
//     // ID CAN BE RANDOMLY GENERATED STRING
//     if (activeLobbies.has(lobby_id)) {

//       // JOIN A LOBBY WITH A NEW ID
//       socket.join(lobby_id);

//       // EMIT MESSAGE TO LOBBY
//       io.to(lobby_id).emit('new-join', `${socket.id} has joined`);

//     } else {
//       io.to(socket.id).emit('fail', 'this lobby does not exist');
//     }
//   });

//   // LISTEN FOR USER DISCONNECT
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });

// server.listen(8089, () => console.log('listening on port:8089'));

// module.exports = io;

