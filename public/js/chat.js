var socket = io();
function scrollToBottom() {
  var messages=jQuery('#messages');
  var newMessage=messages.children('li:last-child');

  var clientHeight=messages.prop('clientHeight');
  var scrollTop=messages.prop('scrollTop');
  var scrollHeight=messages.prop('scrollHeight');
  var newMessageHeight=newMessage.innerHeight();
  var lastMessageHeight=newMessage.prev().innerHeight();
  if(clientHeight + scrollTop + lastMessageHeight + newMessageHeight >=scrollHeight ){
    messages.scrollTop(scrollHeight);
  }
};

socket.on('connect', function () {
  var param=jQuery.deparam(window.location.search);
  socket.emit('join',param,function(err){
    if(err){
      alert(err);
      window.location.href='/';
    }else{
      console.log('no error');
    }
  })
});

socket.on('disconnect', function () {
});
socket.on('updateUserList',function(users){
  var ol=jQuery('<ol></ol>');
  users.forEach(function(user){
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
});
socket.on('newMessage', function (message) {
  var formattedTime=moment(message.createdAt).format('h:mm a');
  var template=jQuery('#message-template').html();
  var html=Mustache.render(template,{
    text:message.text,
    from:message.from,
    createdAt:formattedTime
  });
  jQuery('#messages').append(html)
  //var li = jQuery('<li></li>');
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);
  //
  // jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

var messageTextBox=jQuery('[name=message]');
  socket.emit('createMessage', {
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
  var formattedTime=moment(message.createdAt).format('h:mm a');
  var template=jQuery("#location-message-template").html();
  var html=Mustache.render(template,{
    from:message.from,
    url:message.url,
    createdAt:formattedTime
  })
  // li.text(`from${message.from} ${formattedTime}:`);
  // var a=jQuery('<a target="_blank">current location</a>');
  // a.attr('href',message.url);
  // li.append(a);
  jQuery('#messages').append(html);

});
