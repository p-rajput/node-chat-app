var socket= io();
socket.on('connect',()=>{
 console.log('connected');
})
socket.on('disconnect',()=>{
 console.log('we are disconnected!');
})
socket.on('newMessage',(message)=>{
  console.log(message);
})
