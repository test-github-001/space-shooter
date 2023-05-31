'use strict';

/*
**  ИНИЦИАЛИЗАЦИЯ
*/

// Скрываем курсор
document.body.style.cursor = 'none';

// Константы
const _2PI = Math.PI * 2;
const _RAD = Math.PI / 180;

// Функции
function getExistsObjectsFromArr(arr) {
    // Удаляем, если: object.isExist = false
    const filteredArr = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].isExist) filteredArr.push(arr[i]);
    }
    return filteredArr;
}

function turnTo( object, target, turnSpeed ) {
    let pointDirection = Math.atan2(target.y - object.y, target.x - object.x);
    let angle = (pointDirection - object.direction) % _2PI;

    if (angle < -Math.PI) angle += _2PI;
    if (angle >  Math.PI) angle -= _2PI;

    if (angle >= 0 &&  angle > turnSpeed) object.direction += turnSpeed;
    if (angle <  0 && -angle > turnSpeed) object.direction -= turnSpeed;
}

function getDistance(object, target) {
    let dx = target.x - object.x;
    let dy = target.y - object.y;
    return Math.sqrt( dx**2 + dy**2 );
}

function moveTo( object, target, speed ) {
    if (object.x !== target.x || object.y !== target.y) {
        let distance = getDistance(object, target)
        
        if (distance <= speed) {
            object.x = target.x;
            object.y = target.y;
        } else {
            let moveRate = speed / distance;
            object.x += moveRate * (target.x - object.x);
            object.y += moveRate * (target.y - object.y);
        }
    }
}

// Классы спрайтов и текста
class Text {
    constructor(text = '', x = 0, y = 0, size = 12, color = '#00ff00') {
        this.y = y;
        this.x = x;
        this.size = size;
        this.color = color;

        this.img = document.createElement('canvas');
        this.ctx = this.img.getContext('2d');
        this.img.width = this.getTextWidth(text);
        this.img.height = size;

        this.render(text);
    }

    getTextWidth(text) {
        this.ctx.font = `${this.size}px PTSans, Arial, sans-serif`;
        return this.ctx.measureText(text).width;
    }

    render(text) {
        this.ctx.clearRect(0, 0, this.img.width, this.img.height);
        this.img.width =  this.getTextWidth(text);
        this.ctx.font = `${this.size}px PTSans, Arial, sans-serif`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillStyle = this.color
        this.ctx.fillText(text, 0, 0);
    }

    draw() {
        ctx.drawImage( this.img, this.x,  this.y);
    }
}

class Sprite {
    constructor(imageName, x, y) {
        this.img = IMG[imageName];
        this.x = x;
        this.y = y;
        this.w = this.img.width;
        this.h = this.img.height;
        this.hw = Math.floor(this.w / 2);
        this.hh = Math.floor(this.h / 2);

        this.direction = 0;
    }

    draw() {
        if (this.direction === 0) ctx.drawImage( this.img, this.x - this.hw,  this.y - this.hh);
        else {
            ctx.setTransform(1, 0, 0, 1, this.x, this.y);
            ctx.rotate(this.direction);
            ctx.drawImage(this.img, -this.hw, -this.hh);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
}

class SpriteSheet {
    constructor(imageName, x, y, fw, fh, frames, fps = 60) {
        this.img = IMG[imageName];
        this.x = x;
        this.y = y;
        this.w = fw;
        this.h = fh;
        this.hw = Math.floor(this.w / 2);
        this.hh = Math.floor(this.h / 2);
        
        this.framesArr = this.getFramesArr(fw, fh, frames);
        this.frame = 0
        this.frames = frames;
        this.nextFrame = Math.floor(1000 / fps);
        this.nextFrameTimeout = this.nextFrame;

        this.direction = 0;
    }

    getFramesArr(fw, fh, frames) {
        const framesArr = [];
        for( let yy = 0; yy < this.img.height; yy += fh) {
            for( let xx = 0; xx < this.img.width; xx += fw) {
                framesArr.push( {x: xx, y: yy} );
            }
        }
        framesArr.length = frames;
        return framesArr;
    }

    drawWithAnimation(dt) {
        this.nextFrameTimeout -= dt
        if (this.nextFrameTimeout < 0) {
            this.nextFrameTimeout += this.nextFrame;
            this.frame++;
            if (this.frame === this.frames) this.frame = 0;
        }

        if (this.direction === 0) this.draw(this.x - this.hw, this.y - this.hh);
        else {
            ctx.setTransform(1, 0, 0, 1, this.x, this.y);
            ctx.rotate(this.direction);
            this.draw(-this.hw, -this.hh);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }

    draw(pointX, pointY) {
        ctx.drawImage(
            this.img,
            this.framesArr[this.frame].x, this.framesArr[this.frame].y, 
            this.w, this.h,
            pointX, pointY,
            this.w, this.h
        );
    }
}

// CANVAS
let vw, vh, vcx, vcy;
const canvas = document.createElement('canvas');
canvas.width = vw = innerWidth;
canvas.height = vh = innerHeight;
vcx = Math.floor(vw / 2);
vcy = Math.floor(vh / 2);
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, vw, vh);
document.body.prepend(canvas);

// Проигрование звуков
const BG_MUSIC = new Audio();

const bgMusicsArr = [
    'bgm_space_1.mp3',
    'bgm_space_2.mp3',
    'bgm_space_3.mp3',
];

let bgMusicIndex = 0;

function playBgMusic() {
    BG_MUSIC.src = SOUNDS_PATH + bgMusicsArr[bgMusicIndex];
    BG_MUSIC.play();
    bgMusicIndex++;
    if (bgMusicIndex === bgMusicsArr.length) bgMusicIndex = 0;
    BG_MUSIC.addEventListener('ended', playBgMusic);
}

playBgMusic();

function playSound( soundName ) {
    SE[soundName].currentTime = 0;
    SE[soundName].play();
}

// Управление
const CURSOR = {
    isOnClick : false,
    x : vcx,
    y : vcy
};

document.onmousemove = (event) => {
    CURSOR.x = event.pageX;
    CURSOR.y = event.pageY;
};

document.onclick = () => CURSOR.isOnClick = true;

const KEY = {
    space : false,
};
document.addEventListener('keydown', (event) => {
    switch(event.code) {
        case 'Space' : KEY.space = true; break;
    }
});

document.addEventListener('keyup', (event) => {
    switch(event.code) {
        case 'Space' : KEY.space = false; break;
    }
    // можно просмотреть event.code для кнопок
    // и при необходимости выше дописать их обработку
    console.log('key code :', event.code);
});

// Запуск анимации
let isOnFocus, previousTimeStamp;

window.onblur = stopAnimation;
window.onfocus = startAnimation;

function startAnimation() {
    console.log('start animation');
    isOnFocus = true;
    BG_MUSIC.play();
    previousTimeStamp = performance.now();
    requestAnimationFrame ( animation );
}

function stopAnimation() {
    console.log('stop animation');
    isOnFocus = false;
    BG_MUSIC.pause();
}

function animation(timeStamp) {
    const dt = timeStamp - previousTimeStamp;
    previousTimeStamp = timeStamp;

    ctx.clearRect(0, 0, vw, vh);
    gameLoop(dt);

    CURSOR.isOnClick = false;

    if (isOnFocus) requestAnimationFrame( animation );
}

const GAME_SCRIPT = document.createElement('script');
GAME_SCRIPT.src = './js/game.js';
document.body.append(GAME_SCRIPT);
GAME_SCRIPT.onload = startAnimation;