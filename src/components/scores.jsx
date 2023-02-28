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
  function newGame() {
    return null;
  }

  return (
    <div>
      <div>
        Correct sentence:
      </div>
      <div>
        GPT&apos;s sentence:
      </div>
      <div>
        Columns of scores in flex row
      </div>
      <button type="button" onClick={newGame}>Run it back</button>
    </div>
  );
}
