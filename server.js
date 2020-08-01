//import the module
var express=require('express');
var app=express();
var server=app.listen(3000);
app.use(express.static('public'));
console.log("server is running");

//import the library
var socket=require('socket.io');
//put server in the variable
var io=socket(server);

io.sockets.on('connection',newConnection);

function newConnection(socket){
    console.log("new connection"+socket.id);
    socket.on('mouse',mouseMsg);

    function mouseMsg(data){
        socket.broadcast.emit('mouse',data);
       //Goes to all of them io.sockets.emit('mouse',data);
    }
    }











