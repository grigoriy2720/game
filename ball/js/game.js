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
     w : 34,
     h : 24,
     delay: 3
   }); 
var dy=0; // движение персонажа вних

var fon = game.newImageObject({ 
     file : "img/1.png", 
     x : 0, 
     y : 0,
   });

var wall = [];
var DX = 0; // сдвиг столбиков по оси Х
var DY =0; // сдвиг столбиков по оси Y

var count=0;

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



// wall.push(
//    game.newImageObject({ 
//      file : "3.png", 
//      x : DX + W, 
//      y : -720 - DY,
//      angle: 180
//    }));
};
};

game.newLoop('menu', function () {

wall = [];
life = 3;
start.x = 600;
player.x=600;
player.y=270;
player.angle=0;
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

// dy+=0.5;
// player.angle=dy;
// if (mouse.isDown('LEFT')) {
// 	player.y -=30;
// }

pjs.presets.bgCycle(fon, -2);
fon.draw();
start.draw();
player.draw();

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
    }

for (var i in wall) {

    wall[i].x -=4;

 if (wall[i].x + wall[i].w < 0 && wall[i].y>0) {
 	var G = r(-110, 110);
 	count++;
 }


    if (wall[i].x + wall[i].w <0) {
    	wall[i].x = 2400;

        if (wall[i].y>0) {
        	wall[i].y = 340 - G;
        }

        if (wall[i].y<0) {
        	wall[i].y = -820 - G;
        }

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