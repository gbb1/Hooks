/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-cycle */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable new-cap */
import React, {
  useState, useEffect, useRef, createContext, useContext,
} from 'react';
import {
  BrowserRouter as Router, Link, Route, Routes, useNavigate,
} from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { io } from 'socket.io-client';

// IMPORT SOCKET CONNECTION CONTEXT
import { SocketContext } from '../index.jsx';

import Lobby from './lobby.jsx';

export default function Start() {
  // USE SOCKET CONNECTION CONTEXT
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  const [lobby, setLobby] = useState('');
  const [lobbyId, setLobbyId] = useState('');
  const [name, setName] = useState('');

  // ADD SOCKET EVENT LISTENERS SPECIFIC TO THIS COMPONENT
  useEffect(() => {
    socket.on('gameId', (id) => {
      setLobby(id);
      const inputField = document.getElementById('lobby-input');
      inputField.value = id;
      setLobbyId(id);
    });

    socket.on('join-success', (id) => {
      console.log('new join at', id);
      navigate(`/lobby/${id}`, { state: { lobbyId: id } });
    });

    setName(socket.id.substring(0, 7));
    // const nameField = document.getElementById('name');
    // nameField.value = socket.id.substring(0, 7).toUpperCase();
  }, []);

  function handleInput(event) {
    const setters = {
      'lobby-input': setLobbyId,
      name: setName,
    };
    setters[event.target.id](event.target.value);
  }

  function createLobby(event) {
    event.preventDefault();
    console.log('trying to create lobby');
    socket.emit('create', 'params');
  }

  function joinLobby(event) {
    event.preventDefault();
    console.log('trying to join lobby');
    socket.emit('join-lobby', { id: lobbyId, nickname: name });
  }

  return (
    <div>
      <h1>Socket id:</h1>
      <h3>{socket.id}</h3>
      <h1>
        Lobby id:
      </h1>
      <h3>
        {lobby}
      </h3>
      <form>
        <input type="text" id="name" placeholder="Nickname" onChange={handleInput} />
      </form>
      <button type="button" onClick={createLobby}>Create Game</button>
      <div>
        <form>
          <input type="text" id="lobby-input" placeholder="Lobby ID" onChange={handleInput} />
          <button type="submit" onClick={joinLobby}>
            {/* <Link to="/lobby">Join</Link> */}
            Join
          </button>
        </form>
      </div>
    </div>
  );
}
