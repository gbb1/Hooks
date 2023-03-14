const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const member = new mongoose.Schema({
  socket_id: { type: String, unique: true },
  lobby_id: String,
  username: String,
  created: { type: Date, default: Date.now, required: true },
  ready: Boolean,
  writer_points: Number,
  laugh_points: Number,
  writer_catch: Number,
  gpt_catch: Number,
  current: String,
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answers' }],
});

const books = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  sentence: { type: String, required: true },
  url: String,
});

const lobby = new mongoose.Schema({
  lobby_id: { type: String, unique: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Books' }],
  answers: [{
    socket: String, sentence: String, wager: String, writer_votes: Number, laugh_votes: Number,
  }],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  submitted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
  voted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
  current: { type: mongoose.Schema.Types.ObjectId, ref: 'Books' },
  author: String,
  title: String,
  vote_time: Number,
  round_time: Number,
  answer: String,
  gpt: String,
});

const Lobbies = mongoose.model('Lobbies', lobby);
const Books = mongoose.model('Books', books);
const Member = mongoose.model('Member', member);

/* --------------------------------------------------------------------- */

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`);
    console.log('MongoDB connected...');
  } catch (error) {
    console.log(`error: ${error}`);
    process.exit(1);
  }
};

const closeDB = () => {
  mongoose.connection.close();
};

module.exports = {
  connectDB,
  closeDB,
  Lobbies,
  Books,
  Member,
};
