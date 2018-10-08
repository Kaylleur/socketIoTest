var app = require('express')();
var http = require('http').Server(app);
var amqp = require('amqplib/callback_api');

http.listen(3001, function(){
  console.log('listening on *:3001');
});

app.get('/', function(req, res){
    res.send({msg:"msg from ms1"});
});

app.get('/send', function(req, res){
    amqp.connect('amqp://localhost/guest', function(err, conn) {
        if(err){
            console.error(err);
        }
        conn.createChannel(function(err, ch) {
            var q = "eventUpdate";
            var msg = {
                id : "ms1",
                msg: "Hello from MS1"
            };

            ch.assertQueue(q, {durable: false});
            // Note: on Node 6 Buffer.from(msg) should be used
            ch.sendToQueue(q, new Buffer(JSON.stringify(msg)));
            console.log(" [x] Sent");
            res.send('<h1>Sent !</h1>');
        });
    });
});