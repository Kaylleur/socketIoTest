var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index_app1.html');
});
http.listen(3002, function(){
  console.log('listening on *:3002');
});