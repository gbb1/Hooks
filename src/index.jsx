import React, {
  useState, useEffect, useRef, createContext,
} from 'react';
import {
  BrowserRouter as Router, Link, Route, Routes,
} from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { io } from 'socket.io-client';
import './styles/start.scss';

import Lobby from './components/lobby.jsx';
import Start from './components/start.jsx';
import Game from './components/game.jsx';
import Voting from './components/voting.jsx';
import Scores from './components/scores.jsx';
import Logo from './components/elements/logo.jsx';

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

  if (loading) return <div><div className="loading"><Logo /></div></div>;

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
