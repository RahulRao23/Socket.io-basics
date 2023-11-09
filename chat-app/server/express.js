// blog_app/index.js
const express = require ('express');
const http = require ('http');
const {Server} = require ('socket.io');

const {dbConnect} = require ('./config/dbConnect');

const PORT = 3000;

/* Get all routes */
const userRouter = require ('./src/routes/user.routes');
const socketHandler = require ('./src/sockets/index');

const app = express ();
const server = http.createServer (app);
const io = new Server (server);

/* Establish DB connection */
dbConnect ();

app.use (express.json ());
app.use (express.urlencoded ({extended: true}));

app.use ('/user', userRouter);

io.on ('connection', socket => {
  console.log ('Socket connected: ', socket.id);
  // console.log("Socket data:", socket.handshake.query);

  socket.on ('some event', () => {
    io.emit ('some event response', 'socket successful');
  });

  socketHandler (io, socket);
});

server.listen (PORT, () => {
  console.log (`Server running at http://localhost:${PORT}`);
});
