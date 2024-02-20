const io = require('socket.io')({
    cors: {
      origin: "http://127.0.0.1:5500", // Replace with the actual origin of your frontend
      methods: ["GET", "POST"]
    }
  });
  
  io.attach(8000);

const users = {};

io.on('connection', socket => {
  //if any new user joins,let's other users connected to the server
  socket.on('new-user-joined', name => {
    console.log("User joined: ", name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });
  //if any user send the message then broadcast it to the other people
  socket.on('send', message => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
  });
  //if any people leave the chat then let other people know
  socket.on('disconnect', message => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
});
