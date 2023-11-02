const http = require ('http').createServer ();
const httpProxy = require ('http-proxy');
const {Server} = require ('socket.io');

const PORT = 3000;
const SOCKET_PORT = 3001;

const io = new Server (http, {
  cors: {origin: '*'},
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
});

const connections = [];

io.on ('connection', socket => {
  console.log ('Connected to: ', socket.id);
  console.log ('Auth: ', socket.handshake.auth);
  console.log ('Client IP: ', socket.handshake.address);
  console.log ('Client count: ', io.engine.clientsCount);

  /* When token is invalid, disconnect socket */
  if (socket.handshake.auth.token === 'invalid-token') {
    console.log ('TOKEN ERROR');
    socket.disconnect (true);
  }
  /* Add first 5 connections to room_1 and rest of the connections to room_2 */
  connections.push (socket.id);
  const roomId = connections.length < 5 ? 'room_1' : 'room_2';
  socket.join (roomId);

  socket.use (([event, ...args], next) => {
    console.log ({event, args});
    next ();
  });

  socket.on ('error', err => {
    if (err && err.message === 'unauthorized event') {
      socket.disconnect ();
    }
  });

  /* Emit room specific messages */
  socket.on ('message', (message, callback) => {
    io.to ('room_1').emit ('message', `${socket.id}: ${message.text}`);
    console.log ('message', `${socket.id}: ${JSON.stringify (message)}`);
    callback (`Got Response: ${socket.id}`);
  });

  socket.on ('ping', count => {
    console.log ({count});
  });
});

http.listen (PORT, () => {
  console.log ('Listening on port: 3000');
});

/* Create a proxy server for Sockets */
httpProxy
  .createProxyServer ({
    target: 'http://localhost:3000',
    ws: true,
  })
  .listen (SOCKET_PORT);
