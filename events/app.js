var app = require('express')();
var http = require('http').Server(app);
var amqp = require('amqplib/callback_api');
var io = require('socket.io')(http, {path: '/'});
const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

http.listen(3003, function(){
  console.log('listening on *:3003');
});

var ioNamespace = io.of('namespace');


ioNamespace.on('connection', function(socket){
  console.log('a user connected at ms2');
  socket.on('notifFromBrowser', function(msg){
      console.log('i get a notif from the browser i broadcast it to receiveBroadcast with ' + msg);
     socket.broadcast.emit('receiveBroadcast',msg);
  });
});

amqp.connect('amqp://localhost/guest', function(err, conn) {
    if(err){
        console.error(err);
    }
    conn.createChannel(function(err, ch) {
        var q = 'eventUpdate';

        ch.assertQueue(q, {durable: false});
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, function(msg) {
            console.log("new msg received : " + JSON.stringify(msg.content.toString()));
            io.emit('eventUpdate',JSON.parse(msg.content));
        }, {noAck: true});
    });
});
