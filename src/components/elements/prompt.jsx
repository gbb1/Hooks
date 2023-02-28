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
    <div>
      <div>{book.title}</div>
      <div>{book.author}</div>
      <div>Image</div>
    </div>
  );
}
