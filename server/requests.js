/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const axios = require('axios');
const OpenAI = require('openai-api');

const openai = new OpenAI(process.env.GPT_AUTH_SECRET);

function getBooks(count) {
  console.log('starting request');
  axios.get('https://www.googleapis.com/books/v1/volumes', {
    headers: {
      Authorization: process.env.AUTH_SECRET,
    },
    params: {
      q: 'subject:fiction',
    },
  })
    .then(({ data }) => {
      console.log(data);
    })
    .catch((err) => console.log('Failed to get book', err));
}

function gptAnswer(title, author) {
  console.log('starting request');
  const prompt = `Write the first sentence of a book called ${title} by ${author}`;

  console.log(prompt);

  const params = {
    engine: 'davinci',
    prompt,
    max_tokens: 75,
    n: 1,
    stop: '\n',
  };

  (async () => {
    await openai.complete(
      params,
    )
      .then((response) => {
        const answer = response.data;
        console.log(answer.choices[0].text.trim());
      })
      .catch((err) => {
        console.log(err);
      });
  })();
}

module.exports = {
  getBooks,
  gptAnswer,
};
