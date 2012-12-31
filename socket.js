var socketio = require('socket.io')
  , io
;

exports.init = function(app, config) {
    io = socketio.listen(app, config);    
    return io;
}

exports.get = function() {
    return io;
}