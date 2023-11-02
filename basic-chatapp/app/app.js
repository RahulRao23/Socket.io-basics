const socket = io ('ws://localhost:3000', {
  auth: {
    token: 'invalid-token',
  },
});

/* Emit 'ping' every 2 seconds */
let count = 0;
setInterval (() => {
  /* Volatile will not buffer the events on disconnection */
  socket.volatile.emit ('ping', ++count);
}, 2000);

socket.on ('message', text => {
  const el = document.createElement ('li');
  el.innerHTML = text;
  document.querySelector ('ul').appendChild (el);
});

/* When auth token is invalid, update token and try to connect again */
socket.on ('disconnect', () => {
  console.log ('DISCONNECTED');
  socket.auth.token = 'updated-token';
  socket.connect ();
});

document.querySelector ('button').onclick = () => {
  const text = document.querySelector ('input').value;
  socket.emit ('message', {socket_id: socket.id, text}, response => {
    console.log ('SERVER -> CLIENT', {response});
  });
};
