var express = require('express')
var app = express();
var serv = require('http').Server(app)
var SOCKET_LIST = {};
app.get('/',function(req,res){
	res.sendFile(__dirname + '/client/index.html')
})
app.use('/client',express.static(__dirname + '/client'))

serv.listen(2000);
console.log("Servidor Online!")

var io = require('socket.io')(serv,{});
io.sockets.on('connection',function(socket){
	console.log("Jogador Conectado!");
	socket.id = Math.random();
	socket.x = 0;
	socket.y = 0;
	SOCKET_LIST[socket.id] = socket;
	socket.on('disconnect',function(){
		delete SOCKET_LIST[socket.id];
		
	})
})

setInterval(function(){
	var pacote = []
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.x++;
		socket.y++;
		pacote.push({
			x: socket.x,
			y: socket.y
		});
	}
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('posicoes',pacote);
	}
},1000/25);