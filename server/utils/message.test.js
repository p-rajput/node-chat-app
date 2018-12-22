var expect=require('expect');

var {generateMessage}=require('./message');
describe('generateMessage',()=>{
  it('should generate message',()=>{
    var message=generateMessage('prabhat','i am good');
    var from='prabhat';
    var text='i am good';
    expect(message.from)
    .toInclude(from);
  });
});
