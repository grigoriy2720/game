var pjs = new PointJS(1100, 620, {backgroundColor: ''})
pjs.system.initFullPage();
var game = pjs.game;
var mouse = pjs.mouseControl;
mouse.initControl();
var key = pjs.keyControl;
key.initControl();
var r = pjs.math.random;
var WH = pjs.game.getWH();
var W=WH.w;
var H=WH.h;
var player = game.newImageObject({ 
     file : "img/ball.png", 
     x : 200, 
     y : 200,
     w : 32,
     h : 32,
     delay: 3
   }); 
let speed = 3;
var fon = game.newImageObject({ 
     file : "img/1.jpg", 
     x : 0, 
     y : 0,
   });
var wall = [];
let DX = 0; // сдвиг столбиков по оси Х
let count=0;
var generate = function() {
for (var i = 0; i<5; i++) {
DX += r(300, 500);
wall.push(
   game.newImageObject({ 
     file : "img/box.png", 
     x : DX + W, 
     y : 390,
   }));
};
};
game.newLoop('menu', function () {
speed = 3;
wall = [];
player.x=400;
player.y=420;
player.angle=0;
fon.x = 0;
fon.y = 0;
fon.draw();
player.draw();

pjs.brush.drawText({
  text : "Нажми мышкой на сцене, чтобы начать игру", 
  x : 20, y : 20, 
  color : "black",
  size: 20
});
pjs.brush.drawText({
  text : "Счет: " + count, 
  x : 20, y : 50, 
  color : "black",
  size: 20
});
if (mouse.isDown('LEFT')) {
	DX=0;
	generate();
	count=0;
	game.setLoop('game');
}
})
game.newLoop('game', function () {
pjs.presets.bgCycle(fon, -2);
fon.draw();
player.draw();
player.angle += 1;
if (key.isDown('LEFT')||key.isDown('A')) {
	if (player.x != 0) {
		player.x -= 2;
		player.angle -= 3;
	}
}
if (key.isDown('RIGHT')||key.isDown('D')) {
	if (player.x < W - player.w) {
		player.x += 2;
		player.angle += 1;
	}
}
if (player.y == 420) {
	if (key.isDown('UP')||key.isDown('W')) {
		let timerId = setInterval(() => player.y -= 4, 62.5);
		setTimeout(() => {clearInterval(timerId);}, 1000)
		let timer = setInterval(() => player.y += 2, 62.5);
		setTimeout(() => {clearInterval(timer);}, 2000)
		speed += 0.01;
	}
}
for (var i in wall) {
    wall[i].x -= speed;
 if (wall[i].x + wall[i].w < 0 && wall[i].y>0) {
 	var G = r(-110, 110);
 	count++;
 }
    if (wall[i].x + wall[i].w <0) {
    	wall[i].x = 2400;
    }
    if (player.isStaticIntersect(wall[i].getStaticBoxW())) {
    	if (key.isDown('W')||key.isDown('UP')) {
    		let timerId = setInterval(() => player.y -= 1.5, 50);
    		setTimeout(() => {clearInterval(timerId);}, 2000);
		}
    }
    if (player.isStaticIntersect(wall[i].getStaticBoxA())) {
    	game.setLoop('menu');
    }
	wall[i].draw();
}
pjs.brush.drawText({
  text : "Счет: " + count, 
  x : 20, y : 20, 
  color : "black",
  size: 20
});
})
game.setLoop('menu');
game.start();