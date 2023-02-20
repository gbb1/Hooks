
/*
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8088 });
const io = require('socket.io')(wss);

let test = 'MESSAGE';

wss.on('connection', (ws) => {
  console.log('new user connected: ');

  ws.on('message', (data) => {
    console.log(`Client has sent us: ${data}`);
    let msg = data.toString();
    const response = JSON.stringify({ update: test });

    console.log('sending', test);
    ws.send(msg);
  });

  ws.on('close', () => {
    console.log('Client has disconnected');
  });
});
*/