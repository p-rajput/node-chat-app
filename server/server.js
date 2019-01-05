let path=require('path');
const express=require('express');
const socketIo=require('socket.io');
const http=require('http');

let {generateMessage,generateLocationMessage}=require('./utils/message.js');
let {isRealString}=require('./utils/validation.js');
let {Users}=require('./utils/users.js');
const publicPath=path.join(__dirname,'../public');
let app=express();
var server=http.createServer(app);
var port=process.env.PORT||3000;
var io=socketIo(server);
var users=new Users();
app.use(express.static(publicPath));
io.on('connection',(socket)=>{
  console.log('new user connected');

  socket.on('join',(params,callback)=>{
    if(!isRealString(params.name)|| !isRealString(params.room)){
      return callback('Name and Room is require.');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);

    io.to(params.room).emit('updateUserList',users.getUserList(params.room));
    socket.emit('newMessage',generateMessage('Admin','welcome to chat app'));
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} join`));
    callback();
  });

  socket.on('createMessage',(message,callback)=>{
    var user=users.getUser(socket.id);
    if(user && isRealString(message.text)){
    io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));
    }
    callback()
  });
  socket.on('createLocationMessage',(coords)=>{
    var user=users.getUser(socket.id);
    if(user){
    io.to(user.room).emit('generateLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude))
  }
  });
  socket.on('disconnect',()=>{
    var user=users.removeUser(socket.id);
    if(user){
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left the room`));
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));

    }
  })
});
server.listen(port,()=>{
  console.log('Hey! we are active on Port 3000');
})
