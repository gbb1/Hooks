/* eslint-disable react/no-array-index-key */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable arrow-body-style */
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

export default function Voting() {
  const socket = useContext(SocketContext);
  const location = useLocation();
  const navigate = useNavigate();

  const { lobbyId, vote_time } = location.state;

  const [book, setBook] = useState({});
  const [answers, setAnswers] = useState([]);
  const [voters, setVoters] = useState([]);
  const [timer, setTimer] = useState('-');
  const [loading, setLoading] = useState(true);
  const [writer, voteWriter] = useState(false);
  const [laugh, voteLaugh] = useState(false);
  const [writerVote, setWriterVote] = useState(null);
  const [laughVote, setLaughVote] = useState(null);
  const [oldWriter, setOldWriter] = useState(null);
  const [oldLaugh, setOldLaugh] = useState(null);
  const [laughed, setLaughed] = useState(false);
  const [voted, setVoted] = useState(false);
  const [showVoters, setShowVoters] = useState(false);

  function shuffleAnswers(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      // Choose a random index from the unshuffled portion of the array
      const j = Math.floor(Math.random() * (i + 1));
      // Swap the current element with the randomly chosen element
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  useEffect(() => {
    socket.emit('start-voting', { lobby: lobbyId });

    socket.on('voting-book', (b) => {
      setBook(b);
    });

    socket.on('vote-timer-update', (newTime) => {
      setTimer(newTime);
      console.log('timer update received', newTime);
    });

    socket.on('player-answers', (data) => {
      const show = shuffleAnswers(data).filter((d) => { return d.socket !== socket.id; });
      setAnswers(show);
      setLoading(false);
    });

    socket.on('voter-update', (votes) => {
      console.log(votes);
      setShowVoters(true);
      setVoters(votes);
    });

    socket.on('all-votes-in', () => {
      navigate(`/lobby/${lobbyId}/scores`, { state: { lobbyId } });
    });

    socket.on('vote-timer-done', () => {
      navigate(`/lobby/${lobbyId}/scores`, { state: { lobbyId } });
    });
  }, []);

  useEffect(() => {
    if (oldWriter !== null) {
      socket.emit('minus-writer-vote', { lobby: lobbyId, vote_writer: oldWriter });
    }
    socket.emit('writer-vote', { lobby: lobbyId, vote_writer: writerVote });

    setOldWriter(writerVote);
    setVoted(true);
  }, [writerVote]);

  useEffect(() => {
    if (oldLaugh !== null) {
      socket.emit('minus-laugh-vote', { lobby: lobbyId, vote_laugh: oldLaugh });
    }
    socket.emit('laugh-vote', { lobby: lobbyId, vote_laugh: laughVote });

    setOldLaugh(laughVote);
    setLaughed(true);
  }, [laughVote]);

  useEffect(() => {
    if (laughVote && writerVote) {
      socket.emit('votes-in', lobbyId);
    }
  }, [laughVote, writerVote]);

  function handleWriterVote(event) {
    voteWriter(!writer);
    setWriterVote(event.target.id);
  }

  function handleLaughVote(event) {
    voteLaugh(!laugh);
    setLaughVote(event.target.id);
  }

  return (
    <div className="vote-parent">
      <div className="header-parent">
        <div className="timer">{timer}</div>
        <div className="voters">
          {
            voters.map((v) => {
              return <div className="voter-in">{v.username}</div>;
            })
          }
        </div>
        <div className="vote-header">
          <div className="vote-title">{book.title}</div>
          <div className="vote-author">
            By
            {' '}
            {book.author}
          </div>
        </div>
      </div>
      <div className="blocks">
        {
          answers.map((answer, i) => {
            return (
              <div className="vote-block">
                <div className="answer">{answer.sentence}</div>
                <div className="vote-buttons">
                  <button
                    className={
                    writerVote === answer.socket
                      ? 'vote-button writer-selected'
                      : 'vote-button writer'
                    }
                    key={i}
                    id={answer.socket}
                    type="button"
                    onClick={(e) => handleWriterVote(e)}
                  >
                    Writer

                  </button>
                  <button
                    className={
                    laughVote === answer.socket
                      ? 'vote-button laugh-selected'
                      : 'vote-button laugh'
                    }
                    key={i}
                    id={answer.socket}
                    type="button"
                    onClick={(e) => handleLaughVote(e)}
                  >
                    &#129315;

                  </button>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}
