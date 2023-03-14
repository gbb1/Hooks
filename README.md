
<div align="center"><img src="https://i.ibb.co/f0Q4cnc/Group-14.png" width=40% align="center"/></div>

## Tech Stack
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Axios](https://img.shields.io/badge/-Axios-671ddf?logo=axios&logoColor=black&style=for-the-badge)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

## How to play
Inspired by the board game Liebrary, Hooks lets you compete with friends to see who can come up with the most convincing first sentence of a random book.

### Create a lobby:
Add a nickname and click or tap 'Create game' to generate a unique lobby code. 

<div align="center"><img src="http://g.recordit.co/zSlNIEMGHW.gif" width=40% align="center"/></div>

### Invite your friends and ready up:
Share your lobby code with friends, decide how long each round will last, and then ready up. Once all players are ready, the host can start the game!
<div align="center"><img src="http://g.recordit.co/Ux0r8Cq6gc.gif" width=100% align="center"/></div>

### Write and publish your sentence:
Hooks will show a random book and its author. Try to come up with a sentence that others will think is the real one!
<div align="center"><img src="http://g.recordit.co/2FeZi8MgUP.gif" width=40% align="center"/></div>

### Vote on your favorite answers:
Can you guess which setence is the real one? Careful... ChatGPT has also submitted a response.
<div align="center"><img src="http://g.recordit.co/Nduf6cGAyD.gif" width=40% align="center"/></div>

### View a recap and run it back:
At the end of each round, you'll see a recap of the correct and top-voted answers. "Run it back" to play another round or add more friends to your lobby!
<div align="center"><img src="https://i.ibb.co/ZgkHYSz/Screenshot-2023-03-14-at-11-29-51-AM.png" width=40% align="center"/></div>

## Usage

1. Fork and clone the repo and navigate to root
2. Run ```npm install```
3. Connect to a Mongo Atlas instance by adding the following to a .env
```
MONGO_USER='...'
MONGO_PWD='...'
MONGO_URL='...'
```
4. Run ```npm run server-dev``` to start the dev-server
5. Open http://localhost:3001 in your browser
