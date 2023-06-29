const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: { "origin": "*" }
});

io.on('connection', (socket) => {
    console.log('Connected to: ', socket.id);

    socket.on('message', (message) => {
        io.emit('message', `${socket.id}: ${message}`);
    });
});

http.listen(8080, () => {
    console.log('Listening on port: 8080');
});
