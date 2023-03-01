/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-cycle */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/extensions */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
import React, {
  useState, useEffect, useContext, useRef,
} from 'react';
import {
  useLocation, useNavigate, BrowserRouter as Router, Link,
  Route, Routes,
} from 'react-router-dom';

// IMPORT SOCKET CONTEXT
import { SocketContext } from '../index.jsx';

export default function Lobby() {
  // USE SOCKET CONTEXT
  const socket = useContext(SocketContext);
  const location = useLocation();
  const navigate = useNavigate();

  const { lobbyId } = location.state;

  const [members, setMembers] = useState([]);
  const membersRef = useRef(members);

  const [timer, setTimer] = useState(120);
  const [roundTime, setRoundTime] = useState(120);
  const [voteTime, setVoteTime] = useState(30);
  const [start, setStart] = useState(false);
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState('');

  useEffect(() => {
    membersRef.current = members;
    if (members.length === 1) {
      setReady(false);
    }
  }, [members]);

  useEffect(() => {
    console.log('new member sending');
    socket.emit('new-member', { lobby: lobbyId, user: socket.id });

    socket.on('add-member', (mems) => {
      const allMembers = membersRef.current;
      console.log(allMembers);
      setMembers(mems);
    });

    socket.on('set-admin', (user) => {
      setAdmin(user);
    });

    socket.on('timer-update', (newTime) => {
      setTimer(newTime);
      console.log('timer update received', newTime);
    });

    socket.on('player-ready', (ms) => {
      console.log('player ready', ms);
      setMembers(ms);
      setReady(true); // DELETE THIS;
      if (ms.length > 1) {
        const readies = ms.every((m) => m.ready);
        console.log(readies);
        if (readies) {
          setReady(true);
        }
      }
    });

    socket.on('starting-game', () => {
      navigate(`/lobby/${lobbyId}/game`, { state: { lobbyId, vote_time: voteTime, round_time: roundTime } });
    });

    socket.on('player-left', (ms) => {
      console.log('here');
      setMembers(ms);
    });

    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    console.log(voteTime);
  }, [voteTime]);

  // UPDATE GAME SETTING STATES
  function setter(event) {
    const setters = {
      'round-timer': setRoundTime,
      'voting-timer': setVoteTime,
    };
    setters[event.target.id](event.target.value);
  }

  // READY CURRENT PLAYER
  function getReady() {
    socket.emit('ready-up', { lobby: lobbyId });
    socket.emit('set-times', { lobby: lobbyId, vote_time: voteTime, round_time: roundTime });
  }

  // START GAME
  function startGame() {
    console.log('starting');
    const gameInfo = {
      roundTime,
      voteTime,
      members,
    };

    socket.emit('game-start', lobbyId);
  }

  function getBooks() {
    socket.emit('get-books');
  }

  return (
    <div>
      <h1 className="lobby-name">{ lobbyId }</h1>
      <h1>
        Admin:
        {' '}
        {admin}
      </h1>
      <h1>Members: </h1>
      {
        members.map((m) => (
          <div>
            {m.username}
            {
              m.ready
                ? <div>Ready</div>
                : null
            }
          </div>
        ))
      }
      <form>
        <label htmlFor="round-timer">Time per round: </label>
        <input id="round-timer" type="number" onChange={setter} />
        <br />
        <label htmlFor="voting-timer">Voting time: </label>
        <input id="voting-timer" type="number" onChange={setter} />
        <br />
        {
          ready
            ? <button type="button" onClick={startGame}>Start</button>
            : <button type="button" onClick={getReady}>Ready</button> // CHANGE THIS !!!!!!!!!!!!!! back to getReady
        }
      </form>
      {/* <button type="button" onClick={getBooks}>Books</button> */}
    </div>
  );
}

// useEffect(() => {
//   console.log('here');
//   setInterval(() => {
//     if (timer > 0) {
//       socket.emit('update-timer', { lobby: lobbyId, time: timer });
//     }
//   }, 1000);
//   // interval();
// }, [start]);

// import App from '../index';
// import { useSocket } from './useSocketContext';
