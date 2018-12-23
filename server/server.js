let path=require('path');
const express=require('express');
const socketIo=require('socket.io');
const http=require('http');

let {generateMessage,generateLocationMessage}=require('./utils/message.js');
const publicPath=path.join(__dirname,'../public');
let app=express();
var server=http.createServer(app);
var port=process.env.PORT||3000;
var io=socketIo(server);
app.use(express.static(publicPath));
io.on('connection',(socket)=>{
  console.log('new user connected');
  socket.emit('newMessage',generateMessage('Admin','welcome to chat app'));
  socket.broadcast.emit('newMessage',generateMessage('Admin','New user join'));
  socket.on('createMessage',(message)=>{
    io.emit('newMessage',generateMessage(message.from,message.text));
  });
  socket.on('createLocationMessage',(coords)=>{
    console.log(coords)
    io.emit('generateLocationMessage',generateLocationMessage('admin',coords.latitude,coords.longitude))
  });
  socket.on('disconnect',()=>{
    console.log('useris dissconnect');
  })
});
server.listen(port,()=>{
  console.log('Hey! we are active on Port 3000');
})
