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
import Logo from './elements/logo.jsx';

export default function Start() {
  // USE SOCKET CONNECTION CONTEXT
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  const [lobby, setLobby] = useState('');
  const [lobbyId, setLobbyId] = useState('');
  const [name, setName] = useState('');
  const [hasLobby, showLobby] = useState(false);

  // ADD SOCKET EVENT LISTENERS SPECIFIC TO THIS COMPONENT
  useEffect(() => {
    socket.on('gameId', (id) => {
      setLobby(id);
      const inputField = document.getElementById('lobby-input');
      inputField.value = id;
      showLobby(true);
      setLobbyId(id);
    });

    socket.on('join-success', (id) => {
      console.log('new join at', id);
      navigate(`/lobby/${id}`, { state: { lobbyId: id } });
    });

    setName(socket.id.substring(0, 7));

    return () => {
      socket.off();
    };
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
    <div className="start-div">
      <div className="nested1">
        <div className="header">
          <div className="logo-div1">
            <Logo />
          </div>
          <div className="start-title">hooks</div>
        </div>
        {/* <h1 className="socket-id">Socket id:</h1>
        <h3>{socket.id}</h3> */}
        {/* <h1>
          Lobby id:
        </h1> */}
        <div>
          {
            hasLobby
              ? (
                <div className="lobby-info">
                  <div className="invite-code">
                    Invite code:
                  </div>
                  <div className="lobby-id">
                    {lobby}
                  </div>
                </div>
              )
              : (<div className="spacer"> </div>)
        }
        </div>
        <div className="forms-div">
          <form>
            <input className="input-start" autoComplete="off" type="text" id="name" placeholder="Nickname" onChange={handleInput} />
          </form>
          <form>
            <input className="input-start" autoComplete="off" type="text" id="lobby-input" placeholder="Lobby code" onChange={handleInput} />
          </form>
        </div>
        <div className="buttons-div">
          <button className="button" type="button" onClick={createLobby}>Create Game</button>
          <button className="button" type="button" onClick={joinLobby}>
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
