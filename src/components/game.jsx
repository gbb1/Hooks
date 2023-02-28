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

export default function Game() {
  const socket = useContext(SocketContext);
  const location = useLocation();
  const navigate = useNavigate();

  const { lobbyId } = location.state;

  const [loading, setLoading] = useState(true);
  const [sentence, setSentence] = useState('');
  const [wager, setWager] = useState('none');
  const [timer, setTimer] = useState('');

  const [book, setBook] = useState({
    id: '0',
    title: 'TITLEHERE',
    author: 'AUTHOR',
    sentence: 'THE REAL FIRST SENTENCE OF THE BOOK',
  });

  function publish() {
    socket.emit('player-answer', {
      lobby: lobbyId,
      sentence,
      wager,
      socket: socket.id,
    });
  }

  function handleSentence(event) {
    setSentence(event.target.value);
  }

  function handleWager(event) {
    setWager(event.target.id);
  }

  useEffect(() => {
    socket.emit('game-start', lobbyId);
    socket.emit('start-timer-round', lobbyId);

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
      console.log(time);
      setTimer(time);
    });

    return () => {
      socket.off('update-timer');
    };
  }, []);

  if (loading) {
    return <div>Loading round...</div>;
  }
  return (
    <div>
      <div>{timer}</div>
      <Prompt book={book} />
      <form>
        <input className="game-input" type="text" maxLength="255" placeholder="Once upon a time..." onChange={(e) => handleSentence(e)} />
      </form>
      <div>Wager?</div>
      <button id="writer" type="button" onClick={(e) => handleWager(e)}>Writer</button>
      <button id="laughs" type="button" onClick={(e) => handleWager(e)}>Laughs</button>
      <button type="button" onClick={publish}>Publish</button>
    </div>
  );
}
