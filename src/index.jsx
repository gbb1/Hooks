/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
/* eslint-disable new-cap */
import React, {
  useState, useEffect, useRef, createContext,
} from 'react';
import {
  BrowserRouter as Router, Link, Route, Routes,
} from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { io } from 'socket.io-client';
import './styles/test2.scss';

import Lobby from './components/lobby.jsx';
import Start from './components/start.jsx';
import Game from './components/game.jsx';
import Voting from './components/voting.jsx';
import Scores from './components/scores.jsx';

// CONNECT TO THE SOCKET AND SETUP CONTEXT ACCESS FOR CHILD COMPONENTS
const socket = io('http://localhost:8089');
export const SocketContext = createContext(socket);

const app = createRoot(document.getElementById('app'));

function App() {
  const [loading, isLoading] = useState(true);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected');
    });

    // STOP LOADING WITH SUCCESSFUL HANDSHAKE
    socket.on('connection-success', (id) => {
      console.log('Connected with id:', id);
      isLoading(false);
    });

    return () => {
      socket.off('connect');
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <SocketContext.Provider value={socket}>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/lobby/:id" element={<Lobby />} />
            <Route path="/lobby/:id/game" element={<Game />} />
            <Route path="/lobby/:id/vote" element={<Voting />} />
            <Route path="/lobby/:id/scores" element={<Scores />} />
          </Routes>
        </Router>
      </div>
    </SocketContext.Provider>
  );
}

app.render(<App />);

//---------------------------------------------------------------
//
//
//
//
//
//
//
//  {/* <Router>
//           <div>
//             <nav>
//               <ul>
//                 <li>
//                   <Link to="/">Home</Link>
//                 </li>
//                 <li>
//                   <Link to="/lobby">Lobby</Link>
//                 </li>
//               </ul>
//             </nav>

//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/lobby" element={<Lobby id="qwer" />} />

//             </Routes>

//           </div>
//         </Router> */}

// {/* <div>
//             <button type="button">
//               <Link to="/lobby">Lobby</Link>
//             </button>
//           </div> */}

// socket.on('gameId', (id) => {
//   setGameId(id);
// });

// // useSocket();
// // const ws = new WebSocket('ws://localhost:8088');
// // const socket = io('ws://localhost:8089');

// function handleSubmit(event) {
//   event.preventDefault();
//   console.log(`submitting: ${input}`);
//   if (lobby.length === 0) {
//     socket.emit('test', input);
//   } else {
//     socket.emit('lobby-post', { lobby, post: input });
//   }
//   const inputField = document.getElementById('new-post');
//   inputField.value = '';
// }

// function createLobby(event) {
//   event.preventDefault();
//   console.log('trying to create lobby');
//   socket.emit('create', 'params');
// }

// function joinLobby(event) {
//   event.preventDefault();
//   console.log('trying to join lobby');
//   socket.emit('join-lobby', gameId);
// }

// function handleChange(e) {
//   console.log(e.target.value);
//   setInput(e.target.value);
// }

// function handleId(e) {
//   setGameId(e.target.value);
// }

// useEffect(() => {
//   const socket = io('http://localhost:8089');
//   setSocket(socket);
// }, []);

// socket.on('message', (content) => {
//   console.log('message emitted');
//   const currentMessages = messagesRef.current;
//   console.log(currentMessages);
//   // setMessages([...currentMessages, content]);
// });

// const [socket, setSocket] = useState(null);
// const [lobby, setLobby] = useState(null);
// const [input, setInput] = useState('');
// const [messages, setMessages] = useState([]);
// const [gameId, setGameId] = useState('');
// const [lobbyId, setLobbyId] = useState('');
// const [post, setPost] = useState('');
// const [lastJoined, updateJoined] = useState('');
// const messagesRef = useRef(messages);

// // useEffect(() => {
// //   const sock = io('http://localhost:8089');
// //   setSocket(sock);
// // }, []);

// useEffect(() => {
//   messagesRef.current = messages;
// }, [messages]);

// socket.on('new-join', (content) => {
//   console.log('new join');
//   // updateJoined(content);
// });

// socket.on('new-post', (content) => {
//   console.log('new lobby message');
//   // setPost(content);
// });
