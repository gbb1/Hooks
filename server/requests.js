/* eslint-disable prefer-destructuring */
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
  const prompt = `The first sentence of the novel "${title}" is`;

  console.log(prompt);

  const params = {
    engine: 'davinci',
    prompt,
    max_tokens: 100,
    n: 5,
    stop: '\n',
  };

  (async () => {
    await openai.complete(
      params,
    )
      .then((response) => {
        const answer = response.data;
        console.log('answer: ', answer.choices[0].text.split('"')[1]);
        return answer.choices[0].text.split('"')[1]; // filter((a) => (a.text.length > 10 && a.text[0] === '"'))[0].text.trim()) //[0].text.split('.')[0] + '.'
      })
      .catch((err) => {
        console.log(err);
      });
  })();
}

function getGptAnswer(title, author) {
  return new Promise((resolve, reject) => {
    const prompt = `The first sentence of the novel "${title}" is`;

    const params = {
      engine: 'davinci',
      prompt,
      max_tokens: 100,
      n: 5,
      stop: '\n',
    };

    (async () => {
      await openai.complete(
        params,
      )
        .then((response) => {
          const answer = response.data;
          console.log('answer: ', answer.choices[0].text.split('"')[1]);
          let sentence = answer.choices[0].text.split('"')[1];

          const i = 0;
          while (sentence === undefined) {
            sentence = answer.choices[i].text.split('"')[1];
          }
          resolve(sentence);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    })();
  });
}

module.exports = {
  getBooks,
  gptAnswer,
  getGptAnswer,
};
