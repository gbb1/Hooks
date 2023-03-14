const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const axios = require('axios');
const OpenAI = require('openai-api');

const openai = new OpenAI(process.env.GPT_AUTH_SECRET);

function getBooks(count) {
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
        return answer.choices[0].text.split('"')[1];
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
          let sentence = answer.choices[0].text.split('"')[1];

          let i = 0;
          while (sentence === undefined && i < answer.choices.length) {
            sentence = answer.choices[i].text.split('"')[1];
            i++;
          }
          if (sentence.length === 0) {
            sentence = 'GPT was stumped on this one...';
          }
          resolve(sentence);
        })
        .catch((err) => {
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
