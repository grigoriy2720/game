var pjs = new PointJS(1100, 620, {backgroundColor: ''})//создание игнового поля
pjs.system.initFullPage();
var game = pjs.game;
var mouse = pjs.mouseControl;
mouse.initControl();
var key = pjs.keyControl;//переменная для отслеживания нажатия клавиш
key.initControl();
var r = pjs.math.random;//переменная для получения случайных значений
var WH = pjs.game.getWH();//получение высоты и ширины
var W = WH.w;//ширина
var H = WH.h;//высота
var player = game.newImageObject({//обьект мяч
    file: "img/ball.png",
    x: 200,
    y: 200,
    w: 32,
    h: 32,
    delay: 3
});
// var bird = game.newAnimationObject({//обьект птица
//     animation : pjs.tiles.newImage("img/2.png").getAnimation(0, 0, 34, 24, 4), 
//     x : 200, 
//     y : 200,
//     w : 34,
//     h : 24,
//     delay: 3
// }); 
let speed = 3;//скорость игры
var fon = game.newImageObject({ // фон
    file: "img/1.jpg",
    x: 0,
    y: 0,
});
var box = [];//массив коробок
var bird = [];//массив птиц
let DX = 0; // сдвиг столбиков по оси Х
let count = 0;//очки
var generate = function () {//генерация препятствий
    for (var i = 0; i < 5; i++) {
        DX += r(300, 500);
        box.push(
            game.newImageObject({//обьект коробка
                file: "img/box.png",
                x: DX + W,
                y: 390,
            }));
    }
};
var generate_2 = function () {//генерация препятствий
    for (var i = 0; i < 5; i++) {
        DX += r(300, 500);
        box.push(
            game.newAnimationObject({//обьект птиц
                animation : pjs.tiles.newImage("img/2.png").getAnimation(0, 0, 34, 24, 4),
                x: DX + W,
                y: 0 - 24,
                w: 34,
                h: 24
            }));
    }
};
game.newLoop('menu', function () {//запуск меню
    speed = 3;
    box = [];
    player.x = 400;
    player.y = 420;
    player.angle = 0;
    fon.x = 0;
    fon.y = 0;
    fon.draw();
    player.draw();

    pjs.brush.drawText({//отрисовка уведомления
        text: "Нажми левую кнопку мыши, чтобы начать игру",
        x: 200, y: 20,
        color: "black",
        size: 20
    });
    pjs.brush.drawText({//вывод счета
        text: "Счет: " + count,
        x: 20, y: 50,
        color: "black",
        size: 20
    });
    if (mouse.isDown('LEFT')) {//отслеживание нажатия левой кнопки мыши
        DX = 0;//обнуление сдвига по х
        generate();//генерация препятствий
        generate_2();//генерация препятствий
        count = 0;//обнуление счета
        game.setLoop('game');//запуск игры
    }
})
game.newLoop('game', function () {//функция начала игры
    pjs.presets.bgCycle(fon, -2);//циклирование фона
    fon.draw();// отрисовка фона
    player.draw();//отрисовка игрока
    player.angle += 1;//установка вращения мяча
    if (key.isDown('LEFT') || key.isDown('A')) {//движение персонажа при нажатии клавиш влево
        if (player.x != 0) {
            player.x -= 2;
            player.angle -= 3;
        }
    }
    if (key.isDown('RIGHT') || key.isDown('D')) {//движение персонажа при нажатии клавиш вправо
        if (player.x < W - player.w) {
            player.x += 2;
            player.angle += 1;
        }
    }
    if (player.y > 420) {//установка базового позиционирования
    	player.y = 420;
    }
    if (player.y == 420) {//отслеживание возможности для прыжка
        if (key.isDown('UP') || key.isDown('W')) {//функция прыэка
            let timerId = setInterval(() => player.y -= 4, 62.5);//взлет персонажа
            setTimeout(() => {
                clearInterval(timerId);
            }, 1000)
            let timer = setInterval(() => player.y += 2, 62.5);//опускание персонажа
            setTimeout(() => {
                clearInterval(timer);
            }, 2000)
            speed += 0.01;//ускорение игры
        }
    }
    for (var i in box) {//цикл для отрисовки каждого препятствия
        box[i].x -= speed;//движение коробок
        if (count > 0) {
        	bird[i].x -= 3;
        	bird[i].y += 4;
        	bird[i].draw();
        }
        
        if (box[i].x + box[i].w < 0 && box[i].y > 0) {//увеличение счета
            count++;
        }
        if (box[i].x + box[i].w < 0) {
            box[i].x = 2400;
        }
        if (player.isStaticIntersect(box[i].getStaticBox())) {//проверка столкновения
			game.setLoop('menu');
        }
        box[i].draw();//отрисовка препятствия
        
    }
    pjs.brush.drawText({//вывод счета
        text: "Счет: " + count,
        x: 20, y: 20,
        color: "black",
        size: 20
    });
})
game.setLoop('menu');
game.start();//запуск игры