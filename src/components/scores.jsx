import React, {
  useState, useEffect, useContext, useRef,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// IMPORT SOCKET CONTEXT
import { SocketContext } from '../index.jsx';
import Logo from './elements/logo.jsx';

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

  useEffect(() => {
    socket.emit('get-scores', lobbyId);

    socket.on('scores', (answers) => {
      const r1 = answers.slice(0);
      const writer = r1.sort((a, b) => Number(b.writer_votes) - Number(a.writer_votes));
      const r2 = answers.slice(0);
      const laughs = r2.sort((a, b) => Number(b.laugh_votes) - Number(a.laugh_votes));
      const correct1 = answers.filter((a) => a.socket === 'author');
      const gpt1 = answers.filter((a) => a.socket === 'gpt');

      const funny = laughs[0];

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

    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    if (correct !== null && gpt !== null) {
      setLoading(false);
    }
  }, [correct, gpt]);

  function newGame() {
    socket.emit('run-it-back', lobbyId);
  }

  if (loading) {
    return <div><div className="loading"><Logo /></div></div>;
  }

  return (
    <div className="score-parent">
      <div className="score-title">- Round summary -</div>
      <div className="top-voted score-show">
        <div className="score-title-2">Top voted</div>
        <div className="divider-div"><hr className="divider" /></div>
        <div className="score-answer">
          {scores[0].sentence}
        </div>
      </div>
      {
        funniest !== null
          ? (
            <div className="funniest score-show">
              <div className="score-title-2">&#129315;</div>
              <div className="divider-div"><hr className="divider" /></div>
              <div className="score-answer">
                {funniest.sentence}
              </div>
            </div>
          )
          : null
      }
      <div className="correct-voted score-show">
        <div className="score-title-2">Correct</div>
        <div className="divider-div"><hr className="divider" /></div>
        <div className="score-answer">
          {correct.sentence}
        </div>
      </div>
      <div className="gpt-voted score-show">
        <div className="score-title-2">GPT&apos;s answer</div>
        <div className="divider-div"><hr className="divider" /></div>
        <div className="score-answer">
          {gpt.sentence}
        </div>
      </div>
      <div className="footer">
        <button className="button" type="button" onClick={newGame}>Run it back</button>
      </div>
    </div>
  );
}
