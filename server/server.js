let path=require('path');
const express=require('express');
const socketIo=require('socket.io');
const http=require('http');

const publicPath=path.join(__dirname,'../public');
let app=express();
var server=http.createServer(app);
var port=process.env.PORT||3000;
var io=socketIo(server);
app.use(express.static(publicPath));
io.on('connection',(socket)=>{
  console.log('new user connected');
  socket.on('createMessage',(message)=>{
    console.log(message);
    io.emit('newMessage',{
      from:message.from,
      text:message.text
    });
  });
  socket.on('disconnect',()=>{
    console.log('useris dissconnect');
  })
});
server.listen(port,()=>{
  console.log('Hey! we are active on Port 3000');
})
