const http = require ('http').createServer ();

const io = require ('socket.io') (http, {
  cors: {origin: '*'},
});

const connections = [];

io.on ('connection', socket => {
  console.log ('Connected to: ', socket.id);
	console.log("Auth: ", socket.handshake.auth);

	/* When token is invalid, disconnect socket */
	if (socket.handshake.auth.token === 'invalid-token') {
		console.log("TOKEN ERROR");
		socket.disconnect(true);
	}
	/* Add first 5 connections to room_1 and rest of the connections to room_2 */
	connections.push(socket.id);
	const roomId = connections.length < 5 ? 'room_1' : 'room_2';
	socket.join(roomId);

	/* Emit room specific messages */
  socket.on ('message', (message, callback) => {
    io.to('room_1').emit ('message', `${socket.id}: ${message.text}`);
    console.log ('message', `${socket.id}: ${JSON.stringify (message)}`);
    callback (`Got Response: ${socket.id}`);
  });
});

http.listen (8080, () => {
  console.log ('Listening on port: 8080');
});
