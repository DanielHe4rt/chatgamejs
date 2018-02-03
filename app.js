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
let playerSpeed = 10;
var io = require('socket.io')(serv,{});
io.sockets.on('connection',function(socket){
	console.log("Jogador Conectado!");
	socket.id = Math.random();
	socket.x = 250;
	socket.y = 250;
	SOCKET_LIST[socket.id] = socket;
	socket.on('movement',function(data){
		console.log(data);
		if(data.tecla === "s" || data.tecla === "S"){
			socket.y += playerSpeed;
		}else if(data.tecla === "W" || data.tecla === "w"){
			socket.y -= playerSpeed;
		}else if(data.tecla === "d" || data.tecla === "D"){
			socket.x += playerSpeed;
		}else if(data.tecla === "a" || data.tecla === "A"){
			socket.x -= playerSpeed;
		}
	});
	socket.on('disconnect',function(){
		delete SOCKET_LIST[socket.id];
	})
})

setInterval(function(){
	var pacote = []
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		
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