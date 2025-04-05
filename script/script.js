const canvas = document.getElementById("canvas");
const reset_button = document.getElementById("reset-button");
const ctx = canvas.getContext("2d");

var board = {
   width: 500,
   height: 500
};
var player = {
   x: 150,
   y: 150,
   velY: 0,
   width: 35,
   height: 35,
   gravity: 0.2,
   jumpHeight: 3.5
};
var pipes = {
   array: [],
   speed: 1.5,
   interval: 2.5, //In Seconds
   gap: 150, 
   maxDeviation: 150, 
   width: 75,
   height: 50
};
var logic = {
   keys: [],
   score: 0,
   stop: false
};
let createPipes;


window.onload = () => {
   canvas.width = board.width;
   canvas.height = board.height;

   document.body.addEventListener("keydown", function (e) {
      logic.keys[e.keyCode] = true;
   });
   document.body.addEventListener("keyup", function (e) {
      logic.keys[e.keyCode] = false;
   });
   
   createPipes = setInterval(createPipeSet, pipes.interval * 1000);
   createPipeSet(120);
   update();
};

function startGame() {
  logic.stop = false;
  createPipes = setInterval(createPipeSet, pipes.interval * 1000);
   createPipeSet(120);
   update();
}

function update() {
   if (logic.stop) {
      return;
   }
   requestAnimationFrame(update);
   ctx.clearRect(0, 0, board.width, board.height);

   if (logic.keys[38] || logic.keys[32]) {
      player.velY = player.jumpHeight * -1;
   }
   player.velY += player.gravity;
   player.y += player.velY;
  
   if(
     player.y + player.height > board.width ||
     player.y < 0
    ) {
     logic.stop = true;
   }

   ctx.beginPath();
   ctx.fillStyle = "yellow";
   ctx.fillRect(player.x, player.y, player.width, player.height);

   ctx.fillStyle = "green";
   for (let i = 0; i < pipes.array.length; i++) {
      const pipe = pipes.array[i];
      pipe.x -= pipes.speed;

     //Check for player collision
      if (
         player.x + player.width > pipe.x &&
         player.x < pipe.x + pipes.width &&
         player.y + player.height > pipe.y &&
         player.y < pipe.y + pipe.height
      ) {
         logic.stop = true;
      }

      if (pipe.x + pipes.width <= 0) {
         pipes.array.shift();
         logic.score += 0.5;
         continue;
      }
      ctx.fillRect(pipe.x, pipe.y, pipes.width, pipe.height);
   }
  ctx.fillStyle = "black";
     ctx.font = "24px sans";
  ctx.fillText(`Score: ${Math.floor(logic.score)}`, 10, 50);
}

function createPipeSet() {
  if (logic.stop) {
      return;
   }
   const deviation = randomNumber(pipes.maxDeviation);
   const topPipe = {
      x: board.width,
      y: 0,
      height: pipes.height + deviation
   };

   const bottomPipe = {
      x: board.width,
      y: topPipe.height + pipes.gap,
      height: board.height
   };

   pipes.array.push(topPipe);
   pipes.array.push(bottomPipe);
}

reset_button.addEventListener('click', () => {
  player.y = 150;
  player.velY = 0;
  pipes.array = [];
  clearInterval(createPipes);
  logic.score = 0;
  startGame();
});

function randomNumber(max) {
   const random = Math.floor(Math.random() * max);
   return random;
}

document.body.addEventListener("click", function (e) {
      player.velY = player.jumpHeight * -1;
});
