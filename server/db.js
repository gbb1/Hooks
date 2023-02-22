// Import the functions you need from the SDKs you need
const { initializeApp, database } = require('firebase/app');
const {
  getDatabase, onValue, ref, set,
} = require('firebase/database');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyALBCj27a6ovnhh95yIC4_xMzXTEtewxLU',
  authDomain: 'hook-8eac2.firebaseapp.com',
  databaseURL: 'https://hook-8eac2-default-rtdb.firebaseio.com',
  projectId: 'hook-8eac2',
  storageBucket: 'hook-8eac2.appspot.com',
  messagingSenderId: '444003435260',
  appId: '1:444003435260:web:22cbd8f35173cd72e84d79',
  measurementId: 'G-1NZPYDW96P',
};

// Initialize Firebase
const fire = initializeApp(firebaseConfig);
const db = getDatabase();
// const reference = ref(db, 'users/' + 1);

function writeUserData(userId, name, email) {
  // const db = getDatabase();
  const reference = ref(db, `users/${userId}`);

  set(reference, {
    username: name,
    email,
  });
}

// function addBook(title, author, url) {
//   const db = getDatabase();
//   const reference = ref(db, 'books/');

//   set(reference, {
//     username: name,
//     email: email,
//   });
// }

function addLobby(lobbyId, members) {
  const reference = ref(db, `lobbies/${lobbyId}`);

  set(reference, {
    id: lobbyId,
    members: [members],
  });

  // var query = reference.orderByChild('lobbies/').equalTo('BSADFK');
  // console.log(query);
  // reference.off();
}

function joinLobby(lobbyId, user) {
  const lobbyRef = ref(db, `lobbies/${lobbyId}/members`);

  lobbyRef.push({
    username: user.username,
    id: user.id,
    score: user.score,
  });
  // lobbyRef.once('value', (snapshot) => {
  //   const lobbyData = snapshot.val();

  //   const newUser = user.id;
  //   lobbyData.members[newUser.id] = {
  //     id: user.id,
  //     score: user.score,
  //   };

  //   lobbyRef.set(lobbyData);
  // });

  // const newUser = reference.child('members').push();

  // newUser.set({
  //   username: user.username,
  //   id: user.id,
  //   score: user.score,
  // });
  // reference.off();
}

addLobby('BSADFK', { username: 'test', id: 123423423, score: 0 });
joinLobby('BSADFK', { username: 'test2', id: 2, score: 0 });

module.exports = {
  db,
};
