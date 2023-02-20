require('dotenv').config();
const axios = require('axios');

function getBooks(count) {
  console.log('starting request');
  console.log('AUTH:', process.env.AUTH_SECRET);
  axios.get('https://www.googleapis.com/books/v1/volumes', {
    headers: {
      Authorization: process.env.AUTH_SECRET,
    },
    params: {
      q: 'subject:fiction',
    },
  })
    .then(({ data }) => {
      console.log(data.data.items);
    })
    .catch(() => console.log('Failed to get book'));
}

module.exports = getBooks;
