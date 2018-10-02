var app = require('express')();
var http = require('http').Server(app);
//var io = require('socket.io')(http);

app.get('/1', function(req, res){
  res.sendFile(__dirname + '/index_app1.html');
});

app.get('/2', function(req, res){
  res.sendFile(__dirname + '/index_app2.html');
});

http.listen(3002, function(){
  console.log('listening on *:3002');
});
/*
io.on('connection', function(socket){
  console.log('a user connected');
});
*/