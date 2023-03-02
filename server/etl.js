/* eslint-disable import/extensions */
/* eslint-disable no-plusplus */
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const path = require('path');
const { closeDB, connectDB, Books } = require('./db2.js');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function readData() {
  await connectDB();

  const data = [];
  let counter = 0;

  function hasPunctuationFollowedByPeriod(str) {
    return /[!@#$%^&*(),.?":{}|<>]/.test(str.charAt(str.length - 2)) && str.charAt(str.length - 1) === '.';
  }

  fs.createReadStream('./data/bookData3.csv', { highWaterMark: 128 * 1024 })
    .pipe(csv())
    .on('data', async (book) => {
      counter++;
      if (counter % 5000 === 0) {
        console.log(counter);
      }

      let {
        Id, Sentence, Title, Author,
      } = book;
      console.log(book);

      if (Author === undefined) {
        console.log('FOUND:', book);
      }

      if (hasPunctuationFollowedByPeriod(Sentence)) {
        Sentence = Sentence.slice(0, -1);
        console.log(Sentence);
      }

      const newBook = new Books({
        id: Number(Id),
        sentence: Sentence,
        title: Title,
        author: Author,
      });

      await newBook.save((err, result) => {
        console.log('ERror:', err, 'REsult:', result);
      });
    })
    .on('end', async () => {
      console.log(`all the data is: ${data.length}`);
    });
}

async function readDataURL() {
  await connectDB();

  const data = [];
  let counter = 0;

  fs.createReadStream('./data/bookData2.csv', { highWaterMark: 128 * 1024 })
    .pipe(csv())
    .on('data', async (book) => {
      counter++;
      if (counter % 5000 === 0) {
        console.log(counter);
      }

      const {
        Id, Sentence, Title, Author,
      } = book;
      console.log(book);

      const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${Title}+inauthor:${Author}&key=${process.env.AUTH_SECRET}`;

      await axios.get(url, {
        headers: {
          Authorization: process.env.AUTH_SECRET,
        },
        // params: {
        //   q: 'subject:fiction',
        // },
      })
        .then(({ data }) => {
          console.log(data).items;
        })
        .catch((err) => console.log('Failed to get book', err));
    })

  // const newBook = new Books({
  //   id: Id,
  //   sentence: Sentence,
  //   title: Title,
  //   author: Author,
  // });

  // await newBook.save((err, result) => {
  //   console.log('ERror:', err, 'REsult:', result);
  // });
    .on('end', async () => {
      console.log(`all the data is: ${data.length}`);
    });
}

readData();
// readDataURL();
// closeDB();

function getBooksTest(title, author) {
  console.log('starting request');

  const url = `https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&key=${process.env.AUTH_SECRET}&country=US`; // +inauthor:${'Suzanne Collins'}
  axios.get(url)
    // headers: {
    //   Authorization: process.env.AUTH_SECRET,
    // },
    // params: {
    //   q: 'subject:fiction',
    // },
    .then(({ data }) => {
      console.log(data);
    })
    .catch((err) => console.log('Failed to get book', err));
}
// getBooksTest('Hunger Games', 'Suzanne Collins');
