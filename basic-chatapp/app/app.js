const socket = io ('ws://localhost:8080', {
  auth: {
    token: 'invalid-token',
  },
});

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
