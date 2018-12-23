var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage', message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

var messageTextBox=jQuery('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function () {
        messageTextBox.val(' ');
  })
});
var locationButton=jQuery("#send-location");
locationButton.on('click',function(){
  if(!navigator.geolocation){
    return alert('Geolocation i not supported by your browser');
  }
  locationButton.attr('disabled','disabled').text('sending location..')
  navigator.geolocation.getCurrentPosition(function(position){
    socket.emit('createLocationMessage',{
      latitude:position.coords.latitude,
      longitude:position.coords.longitude
    });
    locationButton.removeAttr('disabled').text('send location');
  },function(e){
    locationButton.remveAttr('disabled','disabled').text('sending location..');
    return alert('Unable to fetch location'+e);
  })
})
socket.on('generateLocationMessage',function(message){
  var li=jQuery('<li></li>');
  li.text(`from${message.from}:`);
  var a=jQuery('<a target="_blank">current location</a>');
  a.attr('href',message.url);
  li.append(a);
  jQuery('#messages').append(li);

});
