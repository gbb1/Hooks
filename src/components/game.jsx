/* eslint-disable camelcase */
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
import { useLocation, useNavigate } from 'react-router-dom';

import { SocketContext } from '../index.jsx';
import Prompt from './elements/prompt.jsx';
import Logo from './elements/logo.jsx';

export default function Game() {
  const socket = useContext(SocketContext);
  const location = useLocation();
  const navigate = useNavigate();

  const { lobbyId, vote_time, round_time } = location.state;

  const [loading, setLoading] = useState(true);
  const [sentence, setSentence] = useState('');
  const [wager, setWager] = useState('none');
  const [timer, setTimer] = useState('-');
  const [published, setPublished] = useState(false);
  const [killer, setKiller] = useState(null);

  const [book, setBook] = useState({
    id: '0',
    title: 'TITLEHERE',
    author: 'AUTHOR',
    sentence: 'THE REAL FIRST SENTENCE OF THE BOOK',
  });

  function publish() {
    console.log(killer);
    socket.emit('player-answer', {
      lobby: lobbyId,
      sentence,
      wager,
      socket: socket.id,
      killer,
    });
    if (sentence.length > 0) {
      setPublished(true);
    }
  }

  function handleSentence(event) {
    setSentence(event.target.value);
  }

  function handleWager(event) {
    setWager(event.target.id);
  }

  useEffect(() => {
    // setTimer(round_time);
    // socket.emit('game-start', lobbyId);
    socket.emit('start-timer-round', lobbyId);

    function handleKey(event) {
      if (event.keyCode === 13 || event.which === 13) {
        event.preventDefault();
        if (!published && sentence.length > 0) {
          publish();
        }
      }
    }

    document.addEventListener('keydown', handleKey);

    socket.on('game-book', (b) => {
      const { author, title, current } = b;
      const bk = {
        author,
        title,
        sentence,
      };
      setBook(bk);
      setLoading(false);
    });

    socket.on('timer-update', (time) => {
      // console.log(time);
      setTimer(time);
    });

    socket.on('timer-killer', (func) => {
      // console.log('FUNCTION', func);
      setKiller(func.function);
    });

    socket.on('all-responses-in', () => {
      navigate(`/lobby/${lobbyId}/vote`, { state: { lobbyId, vote_time, book } });
    });

    socket.on('timer-done', () => {
      if (!published && sentence.length > 0) {
        publish();
      }
      console.log('BOOK', book);
      navigate(`/lobby/${lobbyId}/vote`, { state: { lobbyId, vote_time, book } });
    });

    return () => {
      socket.off();
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  if (loading) {
    return <div><div className="loading"><Logo /></div></div>;
  }
  return (
    <div className="game-parent">
      <div className="timer">{timer}</div>
      <div className="prompt-div">
        <Prompt book={book} />
      </div>
      <div className="input-container">
        <textarea id="game-text" className="game-input" placeholder="Once upon a time..." onChange={(e) => handleSentence(e)} />
      </div>
      {/* <div>Wager?</div> */}
      {/* <button id="writer" type="button" onClick={(e) => handleWager(e)}>Writer</button>
      <button id="laughs" type="button" onClick={(e) => handleWager(e)}>Laughs</button> */}
      {
        published
          ? <div className="waiting">Waiting...</div>
          : <button className="button-game" type="button" onClick={publish}>Publish</button>
      }
    </div>
  );
}
