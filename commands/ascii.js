const ascii = require('ascii-art');

exports.name = "ascii";
exports.description = "To make a cool text!";
exports.run = (client, message, args, ops) => {
  
  ascii.font(args.join(' '), 'Doom', function(rendered) {
    
    rendered = rendered
    
    if (message.content.length > 25) return message.channel.send('Sorry, that message is too long!');
    
    message.channel.send(rendered, {
      code: 'md'
    });
    
  });
  
}