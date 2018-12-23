var expect=require('expect');

var {generateMessage}=require('./message');
let{generateLocationMessage}=require('./message');
describe('generateMessage',()=>{
  it('should generate message',()=>{
    var message=generateMessage('prabhat','i am good');
    var from='prabhat';
    var text='i am good';
    expect(message.from)
    .toInclude(from);
  });
});
 describe('generate location',()=>{
   it('should generate location',()=>{
     var location=generateLocationMessage('user',1,1);
     expect(location.url).toBe('https://www.google.com/maps?q=1,1');
     expect(location.from).toBe('user');
   })
 })
