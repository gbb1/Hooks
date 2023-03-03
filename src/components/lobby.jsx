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
import { AiFillCheckCircle, AiOutlineEllipsis } from 'react-icons/ai';

// IMPORT SOCKET CONTEXT
import { SocketContext } from '../index.jsx';
import Logo from './elements/logo.jsx';

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
  const [admin, setAdmin] = useState(null);
  const [loading, isLoading] = useState(true);

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
      isLoading(false);
    });

    socket.on('timer-update', (newTime) => {
      setTimer(newTime);
      console.log('timer update received', newTime);
    });

    socket.on('player-ready', (ms) => {
      console.log('player ready', ms);
      setMembers(ms);
      // setReady(true); // DELETE THIS;
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
    if (event.target.id === 'voting-timer') {
      console.log(event.target.value);
      setVoteTime(event.target.value);
    } else {
      setRoundTime(event.target.value);
    }
    // const setters = {
    //   'round-timer': setRoundTime,
    //   'voting-timer': setVoteTime,
    // };
    // setters[event.target.id](event.target.value);
  }

  // READY CURRENT PLAYER
  function getReady() {
    socket.emit('ready-up', { lobby: lobbyId });
    socket.emit('set-times', { lobby: lobbyId, vote_time: voteTime, round_time: roundTime });
  }

  // START GAME
  function startGame() {
    // console.log('starting');
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

  if (loading) {
    return <div />;
  }

  return (
    <div className="lobby-parent">
      <div className="title-accent">Invite code:</div>
      <div className="lobby-name">{ lobbyId }</div>
      <div className="subheader">
        <div className="subheader-intro">
          Host:
        </div>
        <div className="subheader-content">
          {admin.username}
        </div>
      </div>
      <div className="members-parent">
        <div className="members-title">Members: </div>
        {
          members.map((m) => (
            <div className="member">
              <div className="username">{m.username}</div>
              {
                m.ready
                  ? (
                    <div className="member-ready">
                      <AiFillCheckCircle />
                    </div>
                  )
                  : (
                    <div className="member-waiting">
                      <AiOutlineEllipsis />
                    </div>
                  )
              }
            </div>
          ))
        }
      </div>
      {
        admin.socket_id === socket.id
          ? (
            <div className="lobby-forms">
              <div className="label-parent">
                <div className="label">Round time: </div>
                <div className="label-sub">(sec)</div>
              </div>
              <input className="input" id="round-timer" autoComplete="off" type="number" placeholder="60 - 300 sec" onChange={(e) => setter(e)} />
              <div className="label-parent">
                <div className="label">Voting time: </div>
                <div className="label-sub">(sec)</div>
              </div>
              <input className="input" id="voting-timer" autoComplete="off" type="number" placeholder="30 - 120 sec" onChange={(e) => setter(e)} />
            </div>
          )
          : null
      }
      <div className="buttons">
        {
          ready
            ? <button className="button" type="button" onClick={startGame}>Start</button>
            : <button className="button" type="button" onClick={getReady}>Ready</button> // CHANGE THIS !!!!!!!!!!!!!! back to getReady
        }
      </div>
      {/* <button type="button" onClick={getBooks}>Books</button> */}
    </div>
  );
}
