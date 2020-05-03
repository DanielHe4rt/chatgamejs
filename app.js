var express = require("express");
var app = express();
var serv = require("http").Server(app);
let socketList = [];
const mapRange = {
  x: 3,
  y: 2,
};

const generateMap = () => {
  return Array(mapRange.x).fill(Array(mapRange.y).fill(0));
};
let map = generateMap(2, 3);
console.log(map);

app.use(express.static("client"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/client/index.html");
});

serv.listen(2000);
console.log("Servidor Online!");
let playerSpeed = 5;
let io = require("socket.io")(serv, {});
io.sockets.on("connection", function (socket) {
  console.log("Jogador Conectado!");
  socket.x = 0;
  socket.y = 0;
  socket.spritePos = 48;
  socketList.push(socket);

  socket.emit("generate-map", mapRange);

  socket.on("movement", function (data) {
    console.log(data);
    let key = data.keyPressed.toLowerCase();

    switch (key) {
      case "s":
        socket.y += playerSpeed;
        break;
      case "w":
        socket.y -= playerSpeed;
        break;
      case "w":
        socket.y -= playerSpeed;
        break;
      case "d":
        socket.x += playerSpeed;
        break;
      case "a":
        socket.x -= playerSpeed;
        break;
    }
  });
  socket.on("disconnect", () => {
    socketList = socketList.filter((player) => player.id !== socket.id);
  });
});

setInterval(function () {
  var playersPackage = [];

  socketList.forEach((socketPlayer) => {
    playersPackage.push({
      x: socketPlayer.x,
      y: socketPlayer.y,
      spritePos: socketPlayer.spritePos,
    });
  });
  socketList.forEach((socket) => {
    socket.emit("positions", playersPackage);
  });
}, 1000 / 25);
