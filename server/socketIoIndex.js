// SET UP EXPRESS SERVER
const express = require('express');

const app = express();
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

app.get('/*', (req, res) => {
  res.send(`
    <html>
      <head>
        <style>
          @keyframes pulse {
            0% {
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }

          .error-block {
            position: absolute;
            top: 30%;
            left: 50%;
            text-align: center;
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            transform: translate(-50%, 0);
          }
          .logo {
            scale: .9;
            padding: 10px;
            animation-name: pulse;
            animation-duration: 2s;
            animation-iteration-count: infinite;
          }
          .error-link {
            padding: 10px;
          }
        </style>
      </head>
      <div class="error-block">
        <div class="logo">
          <svg width="43" height="58" viewBox="0 0 43 58" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M42.3686 1C40.4839 7.4667 38.7259 10.0421 34.5552 13.0848C36.24 13.2194 37.116 12.7744 38.6182 11.5221C36.4304 19.5439 29.0337 22.4609 29.0337 22.4609H32.2632C31.7787 26.5617 22.7829 32.8788 19.2408 32.8788H22.4704C21.1491 34.3845 20.7835 34.6869 14.7611 37.2543C12.6127 38.8143 11.6273 40.0672 10.0646 44.4427L10.0614 44.4411C9.90308 44.923 9.70764 45.6407 9.73029 46.1925C9.76009 46.9182 10.0843 47.6898 10.4315 48.516C11.0657 50.0251 11.7766 51.7165 10.9096 53.6443C9.56798 56.6276 6.78664 57.705 4.19604 56.54C1.84082 55.4808 0.454993 53.198 1.20379 50.601C1.54105 49.4312 2.27791 48.4003 3.54229 47.4997C3.30782 49.1886 3.42217 50.0407 3.91206 50.875C3.4326 50.68 3.16357 50.5672 2.66788 50.0684C2.66788 50.0684 1.07371 53.6886 4.50976 55.4226C7.94314 57.1552 9.75815 53.1265 9.75815 53.1265C10.2898 51.5942 9.61905 49.6689 9.07937 48.1198C8.75639 47.1927 8.48034 46.4003 8.53704 45.9076C8.65471 44.8849 8.99356 43.9617 9.13884 43.6008C11.9234 36.142 25.2016 16.1375 33.7217 8.70926C22.7665 17.2075 18.4538 22.9281 12.0525 33.3997C12.0525 19.3355 19.5631 10.8012 34.8677 4.43791C36.1533 3.90339 37.0185 3.56412 37.6848 3.30282C39.3404 2.6536 39.7688 2.48563 42.3686 1Z" fill="#14110F"/>
          <path d="M34.5552 13.0848L34.4938 13.0006L34.2667 13.1662L34.5469 13.1886L34.5552 13.0848ZM42.3686 1L42.4686 1.02915L42.5408 0.781638L42.3169 0.909547L42.3686 1ZM38.6182 11.5221L38.7187 11.5495L38.8058 11.23L38.5515 11.4421L38.6182 11.5221ZM29.0337 22.4609L28.9955 22.364L29.0337 22.5651V22.4609ZM32.2632 22.4609L32.3667 22.4731L32.3804 22.3567H32.2632V22.4609ZM22.4704 32.8788L22.5487 32.9475L22.7004 32.7746H22.4704V32.8788ZM14.7611 37.2543L14.7203 37.1585L14.7095 37.1631L14.6999 37.17L14.7611 37.2543ZM10.0646 44.4427L10.018 44.5359L10.1232 44.5884L10.1627 44.4777L10.0646 44.4427ZM10.0614 44.4411L10.108 44.3479L10.0001 44.294L9.96244 44.4086L10.0614 44.4411ZM9.73029 46.1925L9.6262 46.1968L9.73029 46.1925ZM10.4315 48.516L10.3355 48.5563L10.4315 48.516ZM10.9096 53.6443L10.8146 53.6016L10.9096 53.6443ZM4.19604 56.54L4.23876 56.4449H4.23876L4.19604 56.54ZM1.20379 50.601L1.30389 50.6298L1.20379 50.601ZM3.54229 47.4997L3.64548 47.514L3.67872 47.2746L3.48186 47.4148L3.54229 47.4997ZM3.91206 50.875L3.87281 50.9715L4.15751 51.0873L4.0019 50.8223L3.91206 50.875ZM2.66788 50.0684L2.74178 49.9949L2.6341 49.8866L2.57253 50.0264L2.66788 50.0684ZM4.50976 55.4226L4.55669 55.3296L4.50976 55.4226ZM9.75815 53.1265L9.85351 53.1695L9.85657 53.1607L9.75815 53.1265ZM9.07937 48.1198L8.98099 48.1541L9.07937 48.1198ZM8.53704 45.9076L8.43355 45.8956L8.53704 45.9076ZM9.13884 43.6008L9.23552 43.6397L9.23644 43.6372L9.13884 43.6008ZM33.7217 8.70926L33.7902 8.78778L33.6579 8.62694L33.7217 8.70926ZM12.0525 33.3997H11.9483V33.7699L12.1414 33.4541L12.0525 33.3997ZM34.8677 4.43791L34.9077 4.53411L34.8677 4.43791ZM37.6848 3.30282L37.6468 3.20583L37.6848 3.30282ZM34.6166 13.1689C36.7081 11.6431 38.2008 10.2299 39.4064 8.38334C40.6111 6.53823 41.5252 4.26635 42.4686 1.02915L42.2686 0.97085C41.3274 4.20035 40.4201 6.44951 39.2319 8.26944C38.0447 10.0879 36.573 11.4837 34.4938 13.0006L34.6166 13.1689ZM38.5515 11.4421C37.8019 12.067 37.2176 12.4825 36.6159 12.727C36.0173 12.9704 35.3942 13.0473 34.5635 12.9809L34.5469 13.1886C35.4009 13.2569 36.0582 13.1787 36.6944 12.9201C37.3275 12.6627 37.9323 12.2296 38.6849 11.6021L38.5515 11.4421ZM29.0337 22.4609C29.0719 22.5578 29.072 22.5578 29.0721 22.5578C29.0721 22.5577 29.0723 22.5577 29.0724 22.5576C29.0727 22.5575 29.0731 22.5574 29.0736 22.5572C29.0746 22.5568 29.076 22.5562 29.0779 22.5554C29.0817 22.5539 29.0872 22.5517 29.0945 22.5487C29.109 22.5427 29.1303 22.5339 29.1581 22.522C29.2138 22.4983 29.2952 22.4626 29.3995 22.4145C29.608 22.3181 29.9076 22.1718 30.2737 21.9711C31.0058 21.5699 32.0042 20.9511 33.0714 20.0804C35.2055 18.339 37.6175 15.5871 38.7187 11.5495L38.5177 11.4947C37.4311 15.4789 35.0508 18.1964 32.9396 19.919C31.8842 20.7802 30.8967 21.3921 30.1735 21.7884C29.812 21.9866 29.5166 22.1308 29.3121 22.2253C29.2098 22.2726 29.1302 22.3074 29.0764 22.3304C29.0495 22.3418 29.0291 22.3503 29.0154 22.3559C29.0086 22.3587 29.0035 22.3608 29.0002 22.3621C28.9985 22.3628 28.9973 22.3633 28.9965 22.3636C28.9961 22.3637 28.9958 22.3638 28.9956 22.3639C28.9955 22.364 28.9955 22.364 28.9955 22.364C28.9954 22.364 28.9955 22.364 29.0337 22.4609ZM32.2632 22.3567H29.0337V22.5651H32.2632V22.3567ZM19.2408 32.983C20.1509 32.983 21.3949 32.5793 22.7473 31.9214C24.1033 31.2617 25.5808 30.3401 26.9616 29.2906C28.3423 28.2412 29.6292 27.0617 30.6024 25.8851C31.5734 24.7113 32.242 23.5285 32.3667 22.4731L32.1598 22.4487C32.0422 23.4438 31.4046 24.5884 30.4419 25.7523C29.4814 26.9135 28.2072 28.0822 26.8356 29.1247C25.4641 30.1671 23.9983 31.0811 22.6562 31.734C21.3106 32.3887 20.1018 32.7746 19.2408 32.7746V32.983ZM22.4704 32.7746H19.2408V32.983H22.4704V32.7746ZM14.802 37.3502C17.8114 36.0672 19.4149 35.3472 20.4309 34.7586C21.4544 34.1656 21.8848 33.7041 22.5487 32.9475L22.3921 32.8101C21.7347 33.5592 21.3217 34.0017 20.3265 34.5783C19.3237 35.1592 17.7332 35.874 14.7203 37.1585L14.802 37.3502ZM10.1627 44.4777C10.9433 42.2921 11.5768 40.895 12.2796 39.8509C12.9806 38.8095 13.7537 38.1146 14.8223 37.3386L14.6999 37.17C13.6202 37.9541 12.8263 38.6656 12.1068 39.7345C11.3891 40.8007 10.7486 42.2177 9.96647 44.4077L10.1627 44.4777ZM10.0149 44.5343L10.018 44.5359L10.1111 44.3495L10.108 44.3479L10.0149 44.5343ZM9.83438 46.1882C9.81257 45.6571 10.0022 44.9552 10.1604 44.4736L9.96244 44.4086C9.80401 44.8908 9.6027 45.6244 9.6262 46.1968L9.83438 46.1882ZM10.5276 48.4756C10.1782 47.6442 9.86325 46.8913 9.83438 46.1882L9.6262 46.1968C9.65693 46.9451 9.99049 47.7354 10.3355 48.5563L10.5276 48.4756ZM11.0046 53.6871C11.8924 51.7129 11.1599 49.9802 10.5276 48.4756L10.3355 48.5563C10.9716 50.0699 11.6607 51.7201 10.8146 53.6016L11.0046 53.6871ZM4.15331 56.635C5.47325 57.2286 6.84629 57.2523 8.0614 56.7439C9.27606 56.2356 10.3246 55.1992 11.0046 53.6871L10.8146 53.6016C10.153 55.0728 9.14004 56.0667 7.98098 56.5517C6.82236 57.0365 5.50944 57.0164 4.23876 56.4449L4.15331 56.635ZM1.10369 50.5721C0.33779 53.2284 1.76042 55.5589 4.15331 56.635L4.23876 56.4449C1.92122 55.4027 0.572196 53.1675 1.30389 50.6298L1.10369 50.5721ZM3.48186 47.4148C2.20122 48.327 1.44839 49.3766 1.10369 50.5721L1.30389 50.6298C1.6337 49.4859 2.3546 48.4735 3.60273 47.5845L3.48186 47.4148ZM4.0019 50.8223C3.52929 50.0174 3.41237 49.1932 3.64548 47.514L3.4391 47.4854C3.20327 49.1841 3.31506 50.064 3.82222 50.9278L4.0019 50.8223ZM2.59398 50.1418C2.84583 50.3953 3.04358 50.5541 3.24196 50.6747C3.43932 50.7946 3.63405 50.8744 3.87281 50.9715L3.95131 50.7785C3.71061 50.6806 3.5311 50.6066 3.35016 50.4966C3.17024 50.3873 2.98562 50.2403 2.74178 49.9949L2.59398 50.1418ZM4.55669 55.3296C2.87921 54.483 2.43456 53.1836 2.40444 52.0924C2.38931 51.5441 2.47919 51.0475 2.57327 50.6875C2.62026 50.5077 2.66813 50.3625 2.7041 50.2626C2.72208 50.2127 2.73707 50.1742 2.74747 50.1483C2.75266 50.1354 2.75671 50.1257 2.7594 50.1193C2.76075 50.1161 2.76176 50.1137 2.7624 50.1123C2.76272 50.1115 2.76296 50.111 2.76309 50.1107C2.76316 50.1105 2.76321 50.1104 2.76323 50.1103C2.76324 50.1103 2.76324 50.1103 2.76325 50.1103C2.76324 50.1103 2.76322 50.1104 2.66788 50.0684C2.57253 50.0264 2.57251 50.0264 2.57248 50.0265C2.57246 50.0266 2.57242 50.0266 2.57238 50.0267C2.57231 50.0269 2.57221 50.0271 2.57209 50.0274C2.57184 50.028 2.5715 50.0288 2.57107 50.0298C2.57021 50.0317 2.56899 50.0346 2.56742 50.0383C2.56429 50.0457 2.5598 50.0565 2.55416 50.0706C2.54288 50.0986 2.52698 50.1395 2.50808 50.192C2.47029 50.2969 2.42046 50.4481 2.37168 50.6348C2.27424 51.0077 2.18033 51.5246 2.19616 52.0981C2.22797 53.2505 2.70426 54.6281 4.46282 55.5156L4.55669 55.3296ZM9.75815 53.1265C9.66316 53.0837 9.66317 53.0837 9.66318 53.0837C9.66317 53.0837 9.66317 53.0837 9.66315 53.0838C9.66312 53.0838 9.66306 53.084 9.66298 53.0841C9.6628 53.0845 9.66252 53.0851 9.66213 53.086C9.66135 53.0877 9.66012 53.0904 9.65846 53.0939C9.65513 53.101 9.65005 53.1118 9.64322 53.1258C9.62956 53.1539 9.6089 53.1953 9.58131 53.2476C9.52611 53.3523 9.44323 53.5003 9.33309 53.6729C9.1125 54.0185 8.78418 54.4597 8.35197 54.8467C7.91982 55.2337 7.38719 55.5634 6.75733 55.6927C6.12928 55.8217 5.39591 55.7531 4.55669 55.3296L4.46282 55.5156C5.3403 55.9584 6.12132 56.036 6.79922 55.8968C7.47531 55.7581 8.0402 55.4055 8.49097 55.0019C8.94169 54.5983 9.2817 54.1406 9.50872 53.785C9.62239 53.6069 9.70813 53.4538 9.76559 53.3449C9.79433 53.2904 9.81603 53.2469 9.83063 53.2169C9.83793 53.2019 9.84346 53.1902 9.84721 53.1822C9.84909 53.1781 9.85052 53.175 9.8515 53.1729C9.852 53.1718 9.85238 53.171 9.85265 53.1704C9.85279 53.1701 9.85289 53.1698 9.85297 53.1697C9.85301 53.1696 9.85305 53.1695 9.85307 53.1694C9.85311 53.1694 9.85313 53.1693 9.75815 53.1265ZM8.98099 48.1541C9.25125 48.9298 9.55122 49.7914 9.71825 50.6494C9.88534 51.5077 9.91691 52.3511 9.65972 53.0924L9.85657 53.1607C10.131 52.3696 10.093 51.4842 9.92276 50.6096C9.75241 49.7345 9.44717 48.8589 9.17775 48.0855L8.98099 48.1541ZM8.43355 45.8956C8.40277 46.1631 8.46253 46.5008 8.56531 46.8782C8.66875 47.258 8.81986 47.6916 8.98099 48.1541L9.17775 48.0855C9.0159 47.621 8.86749 47.1948 8.76634 46.8234C8.66453 46.4496 8.61461 46.1448 8.64054 45.9195L8.43355 45.8956ZM9.0422 43.5619C8.89549 43.9263 8.55277 44.8595 8.43355 45.8956L8.64054 45.9195C8.75666 44.9103 9.09163 43.997 9.23549 43.6397L9.0422 43.5619ZM33.6533 8.63073C29.3829 12.3538 23.9273 19.221 19.1937 26.0844C14.4606 32.9471 10.4384 39.822 9.04124 43.5643L9.23644 43.6372C10.6239 39.9208 14.633 33.064 19.3652 26.2027C24.0969 19.3421 29.5404 12.493 33.7902 8.78778L33.6533 8.63073ZM12.1414 33.4541C18.5379 22.9903 22.8427 17.2803 33.7856 8.79157L33.6579 8.62694C22.6903 17.1348 18.3698 22.866 11.9636 33.3454L12.1414 33.4541ZM34.8277 4.34172C27.167 7.52689 21.4457 11.2598 17.6399 15.9655C13.8321 20.6736 11.9483 26.3473 11.9483 33.3997H12.1567C12.1567 26.3879 14.0282 20.7624 17.8019 16.0965C21.5775 11.4282 27.2639 7.71226 34.9077 4.53411L34.8277 4.34172ZM37.6468 3.20583C36.9802 3.46721 36.1143 3.80678 34.8277 4.34172L34.9077 4.53411C36.1923 3.99999 37.0567 3.66103 37.7229 3.39981L37.6468 3.20583ZM42.3169 0.909547C39.721 2.39294 39.2972 2.55864 37.6468 3.20583L37.7229 3.39981C39.3836 2.74855 39.8165 2.57832 42.4203 1.09045L42.3169 0.909547Z" fill="black"/>
          </svg>
        </div>
        <div class="error-head">Unfortunately, refreshing is not yet supported.</div>
        <div class="error-link"><a href="http://ec2-3-16-90-3.us-east-2.compute.amazonaws.com:8089/">Start over </a></div>
      </div>
    </html>
  `);
});

// CREATE AN HTTP INSTANCE OF EXPRESS SERVER
const server = require('http').createServer(app);

// SET UP SOCKET IO SERVER USING HTTP INSTANCE
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

const {
  Books, connectDB, closeDB, Lobbies, Member, Answers,
} = require('./db2.js');
const {
  getBook,
  checkLobby,
  addLobby,
  removeMember,
  addMember,
  getAdmin,
  updateAdmin,
  checkAdmin,
} = require('./queries/creating.js');
const {
  setPrefs,
} = require('./queries/lobbySetup.js');
const {
  setAnswer,
  setAnswer2,
  checkDone,
} = require('./queries/gamePlay.js');
const {
  decVote,
  getAnswers,
  changeWriter,
  findWriter,
  voteWriter,
  incWriterVote,
  incLaughVote,
  minusWriterVote,
  minusLaughVote,
} = require('./queries/voting.js');
const {
  getScores,
} = require('./queries/scores.js');

const requests = require('./requests.js');

// FUNCTION THAT WILL GENERATE A RANDOM 7 DIGIT STRING: LOBBY ID
function generateId() {
  const pattern = 'xxxx';
  return pattern.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16).toUpperCase();
  });
}

// FUNCTION TO START AND UPDATE THE TIMER ON A 1 SECOND INTERVAL
let killer;
function startTimer(s, lobby, start, vote = 0) {
  let timeLeft = start;
  const interval = setInterval(() => {
    if (timeLeft === start) {
      s.to(lobby).emit('timer-killer', { function: JSON.stringify(killer) });
    }
    timeLeft--;
    if (vote === 1) {
      s.to(lobby).emit('vote-timer-update', timeLeft);
    } else {
      s.to(lobby).emit('timer-update', timeLeft);
    }
    if (timeLeft === 0) {
      clearInterval(interval);
      if (vote === 1) {
        s.to(lobby).emit('vote-timer-done', {});
      } else {
        s.to(lobby).emit('timer-done', {});
      }
    }
  }, 1000);
  const killer = function clearer() {
    console.log('clearing', interval);
    clearInterval(interval);
  };
  return killer;
}

function getNewBook(lobby) {
  console.log('CALLING GET NEW BOOK');
  getBook(lobby)
    .then((result) => {
      io.to(lobby).emit('game-book', result);
      return result;
    })
    .then((book) => {
      requests.getGptAnswer(book.title)
        .then((answer) => {
          if (answer !== undefined) {
            return Lobbies.findOneAndUpdate(
              { lobby_id: lobby },
              {
                $push: {
                  answers: {
                    socket: 'gpt', sentence: answer, wager: 'none', writer_votes: 0, laugh_votes: 0,
                  },
                },
                gpt: answer,
              },
              { new: true },
            )
              .then((res) => {
              });
          }
        });
    })
    .catch((err) => {
      console.log(err);
      io.send(lobby).emit('book-error', err);
    });
}

// PROVIDE INSTRUCTIONS FOR WHAT TO DO ON CONNECTION, AND WHAT EVENTS TO LISTEN FOR
const nicknames = new Set();

io.on('connection', (socket) => {
  console.log(`a new user connected: ${socket.id.substr(0, 2)} `);
  let timeClear;

  // EMIT SUCCESS SIGNAL TO END LOADING ON CLIENT-SIDE
  io.to(socket.id).emit('connection-success', socket.id);

  socket.on('create', () => {
    console.log('creating a game');
    const id = generateId().toUpperCase();
    addLobby(id)
      .then(() => {
        io.to(socket.id).emit('gameId', id);
      })
      .catch((err) => {
        console.log(err);
        io.to(socket.id).emit('create-error');
      });
  });

  socket.on('join-lobby', ({ id, nickname }) => {
    console.log('lobby request received at,', id.trim());
    console.log(nickname);
    if (nickname === '') {
      nickname = socket.id.substring(0, 7).toUpperCase();
      console.log('NICKNAME', nickname);
    }
    id = id.trim();
    checkLobby(id)
      .then((result) => {
        if (result.length === 0) {
          io.to(socket.id).emit('fail', 'this lobby does not exist');
        } else {
          addMember(id, socket.id, nickname)
            .then(() => {
              socket.join(id);
              io.to(socket.id).emit('join-success', id);
              io.to(id).emit('new-join', `${socket.id} has joined`);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  /* IN LOBBY */
  socket.on('new-member', (data) => {
    Member.find({ lobby_id: data.lobby })
      .then((result) => {
        io.to(data.lobby).emit('add-member', result);
      })
      .then(() => getAdmin(data.lobby))
      .then((results) => {
        console.log('ADMIN RESULTS', results);
        io.to(data.lobby).emit('set-admin', results);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on('ready-up', (data) => {
    Member.findOneAndUpdate({ socket_id: socket.id }, { ready: true })
      .then((user) => Member.find({ lobby_id: user.lobby_id }))
      .then((members) => {
        io.to(data.lobby).emit('player-ready', members);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on('set-times', (data) => {
    checkAdmin(data.lobby, socket.id)
      .then((check) => {
        if (check) {
          setPrefs(data.lobby, data)
            .then((res) => {
              console.log(res);
            });
        }
      });
  });

  /* IN GAME */
  socket.on('start-timer-round', (data) => {
    console.log('timer request received');
    checkAdmin(data, socket.id)
      .then((check) => {
        if (check) {
          Lobbies.find({ lobby_id: data })
            .then((results) => {
              const time = results[0].round_time;
              killer = startTimer(io, data, time);
            });
        }
      })
      .catch((err) => console.log(err));
  });

  socket.on('game-start', (lobby) => {
    checkAdmin(lobby, socket.id)
      .then((check) => {
        if (check) {
          (async () => getNewBook(lobby))();
          io.to(lobby).emit('starting-game', {});
        }
      })
      .catch((err) => console.log(err));
  });

  socket.on('player-answer', (data) => {
    setAnswer2(data)
      .then(() => {
        io.to(data.lobby).emit('player-answer-in');
        return checkDone(data.lobby);
      })
      .then((check) => {
        if (check) {
          killer();
          io.to(data.lobby).emit('all-responses-in');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on('gpt-request', (data) => {
    requests.gptAnswer(data.title, data.author);
  });

  /* VOTING */

  socket.on('start-voting', (data) => {
    Lobbies.findOne({ lobby_id: data.lobby })
      .then((results) => {
        Books.findById(results.current)
          .then((res) => {
            io.to(data.lobby).emit('voting-book', res);
          })
          .then(() => {
            io.to(data.lobby).emit('player-answers', results.answers);
          });
        return results;
      })
      .then((results) => {
        startTimer(io, data.lobby, results.vote_time, 1);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on('writer-vote', (data) => {
    incWriterVote(data.lobby, data.vote_writer)
      .then((result) => {
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on('minus-writer-vote', (data) => {
    minusWriterVote(data.lobby, data.vote_writer)
      .then((result) => {
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on('laugh-vote', (data) => {
    incLaughVote(data.lobby, data.vote_laugh)
      .then((result) => {
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on('minus-laugh-vote', (data) => {
    minusLaughVote(data.lobby, data.vote_laugh)
      .then((result) => {
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on('votes-in', (lobby) => {
    Member.findOne({ lobby_id: lobby, socket_id: socket.id })
      .then((memb) => Lobbies.findOneAndUpdate(
        { lobby_id: lobby },
        { $push: { voted: memb._id } },
        { new: true },
      ))
      .then((lob) => {
        if (lob.members.length === lob.voted.length) {
          io.to(lobby).emit('all-votes-in', {});
        } else {
          Member.find({ _id: { $in: lob.voted } })
            .then((results) => {
              console.log('VOTERS', results);
              io.to(lobby).emit('voter-update', results);
            });
        }
      });
  });

  /* SCORING */

  socket.on('get-scores', (lobby) => {
    checkAdmin(lobby, socket.id)
      .then((check) => {
        if (check) {
          return Lobbies.findOne({ lobby_id: lobby });
        }
        return null;
      })
      .then((result) => {
        if (result !== null) {
          io.to(lobby).emit('scores', result.answers);
        }
      })
      .catch((err) => console.log(err));
  });

  socket.on('run-it-back', (lobby) => {
    Lobbies.findOneAndUpdate(
      { lobby_id: lobby },
      {
        $set: { answers: [] },
      },
      {
        new: true,
      },
    )
      .then((result) => {
        Member.updateMany(
          { lobby_id: lobby },
          { ready: false },
        )
          .then((res) => {
            if (result.answers.length === 0) {
              io.to(lobby).emit('new-game-start', {});
            }
          });
      });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    let lobby = null;
    Member.find({ socket_id: socket.id })
      .then((result) => {
        if (result.length > 0) {
          lobby = result[0].lobby_id;
        }
      })
      .then(() => removeMember(socket.id))
      .then(() => Member.find({ lobby_id: lobby }))
      .then((mems) => {
        if (mems.length !== 0) {
          io.to(lobby).emit('player-left', mems);
          updateAdmin(lobby)
            .then((results) => Member.findById(results.admin))
            .then((result) => {
              if (result !== null) {
                io.to(lobby).emit('set-admin', result.username);
              }
            });
        }
      });
  });
});

server.listen(8089, () => {
  console.log('listening on port:8089');
  connectDB();
});

module.exports = io;
