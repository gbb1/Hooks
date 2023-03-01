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

// IMPORT SOCKET CONTEXT
import { SocketContext } from '../index.jsx';

export default function Scores() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const location = useLocation();

  const { lobbyId } = location.state;

  const [scores, setScores] = useState([]);
  const [correct, setCorrect] = useState(null);
  const [gpt, setGpt] = useState(null);
  const [funniest, setFunny] = useState(null);
  const [loading, setLoading] = useState(true);

  // function sortWriter(array) {
  //   const out = array.sort((a, b) => {
  //     if (a.writer_votes === undefined && b.writer_votes === undefined) {
  //       return b.writer_votes - a.writer_votes;
  //     }
  //     if (a.writer_votes === undefined) {
  //       return b;
  //     }
  //     if (b.writer_votes === undefined) {
  //       return a;
  //     }
  //   });
  //   return out;
  // }
  useEffect(() => {
    socket.emit('get-scores', lobbyId);

    socket.on('scores', (answers) => {
      console.log('getting scores', answers);
      const ranked = answers.slice(0);
      const writer = ranked.sort((a, b) => b.writer_votes - a.writer_votes);
      const laughs = ranked.sort((a, b) => b.laugh_votes - a.laugh_votes);

      const correct1 = answers.filter((a) => a.socket === 'author');
      const gpt1 = answers.filter((a) => a.socket === 'gpt');

      const funny = laughs[0];
      console.log('RANKED', ranked);
      console.log('FUNNY', funny);
      setScores(writer);
      setCorrect(correct1[0]);
      setGpt(gpt1[0]);
      if (funny.laugh_votes > 0) {
        setFunny(funny);
      }
    });

    socket.on('new-game-start', () => {
      navigate(`/lobby/${lobbyId}`, { state: { lobbyId } });
    });
  }, []);

  useEffect(() => {
    console.log(correct, gpt);
    if (correct !== null && gpt !== null) {
      setLoading(false);
    }
  }, [correct, gpt]);

  function newGame() {
    socket.emit('run-it-back', lobbyId);
  }

  if (loading) {
    return (
      <div>Calculating score...</div>
    );
  }

  return (
    <div>
      <div>
        Top voted:
        <div>
          {scores[0].sentence}
        </div>
      </div>
      {
        funniest !== null
          ? (
            <div>
              Funniest:
              <div>
                {funniest.sentence}
              </div>
            </div>
          )
          : null
      }
      <div>
        Correct answer:
        <div>
          {correct.sentence}
        </div>
      </div>
      <div>
        GPT&apos;s answer:
        <div>
          {gpt.sentence}
        </div>
      </div>
      <button type="button" onClick={newGame}>Run it back</button>
    </div>
  );
}
