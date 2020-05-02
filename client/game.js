let ctx = document.getElementById("ctx").getContext("2d");

let socket = io();
let sprites = document.getElementById("sprites");
console.log(sprites);

ctx.drawImage(sprites, 0, 0, 48, 48, 100, 0, 48, 48);
ctx.drawImage(sprites, 48, 0, 48, 48, 200, 0, 48, 48);
ctx.drawImage(sprites, 96, 0, 48, 48, 300, 0, 48, 48);

let teclado = false;

socket.on("positions", function (data) {
  ctx.clearRect(0, 0, 500, 500);
  data.forEach((player) => {
    ctx.drawImage(
      sprites,
      player.spritePos,
      0,
      48,
      48,
      player.x,
      player.y,
      48,
      48
    );
    ctx.fillText("danielhe4rt", player.x - 5, player.y - 6);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    teclado = !teclado;
  }
  socket.emit("movement", { keyPressed: event.key, pressing: true });
  // Validação para quando tiver em chat, não mover o personagemplayer
});

document.addEventListener("keyup", (event) => {
  socket.emit("movement", { keyPressed: event.key, pressing: false });
});

// DrawImage
//
