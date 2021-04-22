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
var gravity = 1;
var player = game.newAnimationObject(   { 
     animation : pjs.tiles.newImage("img/2.png").getAnimation(0, 0, 128, 163, 8), 
     x : 200, 
     y : 200,
     w : 34,
     h : 24,
     delay: 3
   }); 
var helicopter_1 = game.newImageObject({
     file : "img/helicopter.png", 
     x : W, 
     y : 64,
     w : 64,
     h : 64,
});
var helicopter_2 = game.newImageObject({
	file : "img/helicopter.png", 
     x : W, 
     y : 64,
     w : 64,
     h : 64,
})
var helicopter_3 = game.newImageObject({
	file : "img/helicopter.png", 
     x : W, 
     y : 64,
     w : 64,
     h : 64,
})

var dy=0; // движение персонажа вних

var fon = game.newImageObject({ 
     file : "img/1.png", 
     x : 0, 
     y : 0,
   });
var music = new Audio();
music.src = "audio/music.mp3";

var wall = [];
var DX = 0; // сдвиг столбиков по оси Х
var DY =0; // сдвиг столбиков по оси Y

let life = 3;
var count=0;
let speedup = 0;
let speeddown = 0;
var start = game.newImageObject({ 
     file : "img/start.png", 
     x : 600, 
     y : 300,
   });
var generate = function() {

for (var i = 0; i<5; i++) {

DX += r(300, 500);
DY += r(-55, 55);

wall.push(
   game.newImageObject({ 
     file : "img/3.png", 
     x : DX + W, 
     y : 340 - DY,
   }));
};
};

game.newLoop('menu', function () {

wall = [];
life = 3;
start.x = 600;
helicopter_1.x = W;
helicopter_1.y = 64;
helicopter_2.x = W;
helicopter_2.y = 64;
helicopter_3.x = W;
helicopter_3.y = 64;
player.x=600;
player.y=270;
dy=0;
fon.x = 0;
fon.y = 0;
fon.draw();
start.draw();
player.draw();

pjs.brush.drawText({
  text : "Нажми мышкой на сцене, чтобы начать игру", 
  x : 20, y : 20, 
  color : "black",
  size: 20
});
pjs.brush.drawText({
  text : "Жизнь: " + life, 
  x : 20, y : 80, 
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
	DY=0;
	generate();
	count=0;
	game.setLoop('game');
}
})


game.newLoop('game', function () {

player.y += gravity;

pjs.presets.bgCycle(fon, -2);

gravity = 1;
fon.draw();
music.play();
start.draw();
player.draw();
helicopter_1.draw();
helicopter_2.draw();
helicopter_3.draw();

if (key.isDown('LEFT')||key.isDown('A')) {
	if (player.x != 0) {
		player.x -= 2;
	}
}
if (key.isDown('RIGHT')||key.isDown('D')) {
	if (player.x < W - player.w) {
		player.x += 2; 
	}
}
if (start.x > -300) {
	start.x -= 3;
}
    if (player.isStaticIntersect(start.getStaticBoxW())) {
    	gravity = 0;
    	if (key.isDown('W')||key.isDown('UP')) {
    		let timerId = setInterval(() => player.y -= 1.5, 50);
    		setTimeout(() => {clearInterval(timerId);}, 2000);
		}
		setTimeout("gravity = 1", 3000)
    }

for (var i in wall) {

    wall[i].x -=4;

 	if (wall[i].x + wall[i].w < 0 && wall[i].y>0) {
 		var G = r(-55, 55);
 		count++;
 	}


    if (wall[i].x + wall[i].w <0) {
    	wall[i].x = 2400;

        if (wall[i].y>0) {
        	wall[i].y = 340 - G;
        }
    }


    if (player.isStaticIntersect(wall[i].getStaticBoxW())) {
    	gravity = 0;
    	if (key.isDown('W')||key.isDown('UP')) {
    		let timerId = setInterval(() => player.y -= 1.5, 50);
    		setTimeout(() => {clearInterval(timerId);}, 2000);
		}
		setTimeout("gravity = 1", 500)

    }
    if (player.isStaticIntersect(wall[i].getStaticBoxA())) {
    	if (life > 0) {
    		life -= 1;
    		player.y = wall[i].y - player.h - 5;
    	}
    	else game.setLoop('menu');
		
    }
	wall[i].draw();
}
if (count >= 10) {
	helicopter_1.y += speedup;
 	helicopter_1.y -= speeddown;
 	helicopter_2.y += speedup;
 	helicopter_2.y -= speeddown;
 	helicopter_3.y += speedup;
 	helicopter_3.y -= speeddown;
 	if (player.isStaticIntersect(helicopter_1.getStaticBox())) {
		player.y += 32;
    	player.x += 64;
    }
    if (player.isStaticIntersect(helicopter_2.getStaticBox())) {
    	player.y += 32;
    }
    if (player.isStaticIntersect(helicopter_3.getStaticBox())) {
    	player.y += 32;
    	player.x -= 64;
    }
	if (helicopter_1.x != 0) {
    	helicopter_1.x -= 8;
    	if (helicopter_1.x < 0) {
    		helicopter_1.x = 0;
    	}
  	}
  	if (helicopter_1.x == 0 & helicopter_1.y <= 64) {
    	speedup = 3;
  		speeddown = 0;
    }
  	if (helicopter_2.y >= 260) {
    	speedup = 0;
    	speeddown = 3;
  	}
  	if (helicopter_2.x > W / 2) {
  		helicopter_2.x -= 6;
    }
  	if (helicopter_3.x != W - helicopter_3.w) {
  		helicopter_3.x -= 4;
  	}
}
pjs.brush.drawText({
  text : "Жизнь: " + life, 
  x : 20, y : 40, 
  color : "black",
  size: 20
});
pjs.brush.drawText({
  text : "Счет: " + count, 
  x : 20, y : 20, 
  color : "black",
  size: 20
});
})
game.setLoop('menu');
game.start();