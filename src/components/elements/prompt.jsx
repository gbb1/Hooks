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
