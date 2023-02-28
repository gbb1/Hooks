/* eslint-disable import/extensions */
/* eslint-disable new-cap */
import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router, Link, Route, Routes,
} from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { io } from 'socket.io-client';

import Lobby from './components/Lobby.jsx';
import Home from './components/home.jsx';

// import { path } from 'path';
// import {
//   BrowserRouter, Routes, Route, Link,
// } from 'react-router-dom';
// import { useSocket } from './useSocketContext';


const socket = io('http://localhost:8089');

const app = createRoot(document.getElementById('app'));

// Huzzah for jsx!
function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [gameId, setGameId] = useState('');
  const [lobby, setLobby] = useState('');
  const [post, setPost] = useState('');
  const [lastJoined, updateJoined] = useState('');
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected');
      // socket.on('message', (data) => console.log(data));
    });

    socket.on('message', (content) => {
      console.log('message emitted');
      const currentMessages = messagesRef.current;
      console.log(currentMessages);
      setMessages([...currentMessages, content]);
    });

    socket.on('join-success', (id) => {
      console.log('new join');
      setLobby(id);
    });

    socket.on('new-join', (content) => {
      console.log('new join');
      updateJoined(content);
    });

    socket.on('new-post', (content) => {
      console.log('new lobby message');
      setPost(content);
    });

    socket.on('gameId', (id) => {
      setGameId(id);
    });

    return () => {
      socket.off('connect');
    };
  }, []);

  // useSocket();
  // const ws = new WebSocket('ws://localhost:8088');
  // const socket = io('ws://localhost:8089');

  function handleSubmit(event) {
    event.preventDefault();
    console.log(`submitting: ${input}`);
    if (lobby.length === 0) {
      socket.emit('test', input);
    } else {
      socket.emit('lobby-post', { lobby, post: input });
    }
    const inputField = document.getElementById('new-post');
    inputField.value = '';
  }

  function createLobby(event) {
    event.preventDefault();
    console.log('trying to create lobby');
    socket.emit('create', 'params');
  }

  function joinLobby(event) {
    event.preventDefault();
    console.log('trying to join lobby');
    socket.emit('join-lobby', gameId);
  }

  function handleChange(e) {
    console.log(e.target.value);
    setInput(e.target.value);
  }

  function handleId(e) {
    setGameId(e.target.value);
  }

  // socket.addEventListener('open', () => {
  //   console.log('connected!');
  // });

  // ws.addEventListener('message', (e) => {
  //   console.log(`server sent: ${e.data}`);
  //   const { data } = e;
  //   setString(data);
  // });

  return (
    <div>
      <h1>TEST</h1>
      <h1>{'Universal chat: '}</h1>
      {
        messages.map((msg) => (
          <div>{msg}</div>
        ))
      }
      <h1>{`Lobby: `}</h1>
      <div>{lobby}</div>
      <h1>{`Lobby message: `}</h1>
      <div>{post}</div>
      <h1>{`ID: ${gameId}`}</h1>
      <h4>{`Updates: ${lastJoined}`}</h4>
      <form onSubmit={handleSubmit}>
        <input id="new-post" type="text" placeholder="number" onChange={handleChange} />
        <button type="submit">Post</button>
      </form>
      <button type="button" onClick={createLobby}>
        Create Game
      </button>
      <form onSubmit={joinLobby}>
        <input type="text" placeholder="gameId" onChange={handleId} />
        <button type="submit">
          Join Game
        </button>
      </form>
      <Router>
        <div>
          <ul>
            {/* <li>
              <Link to="/">Home</Link>
            </li> */}
            <li>
              <Link to="/lobby">Lobby</Link>
            </li>
          </ul>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/lobby" element={<Lobby id="qwer" />} />

          </Routes>

        </div>
      </Router>
    </div>
  );
}

// app.render(<App />);


// function App() {
//   return (
    // <Router>
    //   <div>
    //     <nav>
    //       <ul>
    //         <li>
    //           <Link to="/">Home</Link>
    //         </li>
    //         <li>
    //           <Link to="/lobby">Lobby</Link>
    //         </li>
    //       </ul>
    //     </nav>

    //     <Routes>
    //       <Route path="/" element={<Home />} />
    //       <Route path="/lobby" element={<Lobby id="qwer" />} />

    //     </Routes>

    //   </div>
    // </Router>
//   );
// }

app.render(<App />);
