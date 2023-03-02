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

export default function Prompt({ book }) {
  return (
    <div className="innerPromptDiv">
      <div className="book-title">{book.title}</div>
      <div className="author">
        By
        {' '}
        {book.author}
      </div>
      <div className="chapter">- Chapter 1 -</div>
    </div>
  );
}
