'use strict';

/*************
 * 
 *   CANVAS
 */

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

/******************************************
 * 
 *  ОТСЛЕЖИВАНИЕ ПОЛОЖЕНИЯ КУРСОРА МЫШИ
 */

let mouseX = vcx, mouseY = vcy;
document.onmousemove = (event) => {
    mouseX = event.pageX;
    mouseY = event.pageY;
};

const KEY = {
    up : false,
    down : false,
    left : false,
    right : false
};
document.addEventListener('keydown', (event) => {
    switch(event.code) {
        case 'KeyA' : KEY.left = true; break;
        case 'KeyD' : KEY.right = true; break;
        case 'KeyW' : KEY.up = true; break;
        case 'KeyS' : KEY.down = true; break;
    
        case 'ArrowLeft' : KEY.left = true; break;
        case 'ArrowRight' : KEY.right = true; break;
        case 'ArrowUp' : KEY.up = true; break;
        case 'ArrowDown' : KEY.down = true; break;
    }
});
  
document.addEventListener('keyup', (event) => {
    switch(event.code) {
        case 'KeyA' : KEY.left = false; break;
        case 'KeyD' : KEY.right = false; break;
        case 'KeyW' : KEY.up = false; break;
        case 'KeyS' : KEY.down = false; break;
    
        case 'ArrowLeft' : KEY.left = false; break;
        case 'ArrowRight' : KEY.right = false; break;
        case 'ArrowUp' : KEY.up = false; break;
        case 'ArrowDown' : KEY.down = false; break;
    }
    //console.log('keypress', event.code);
});

/****************************
 * 
 *   Проигрование звуков
 */

const BG_MUSIC = new Audio();

// массив с названием фоновых музык игры
const bgMusicsArr = [
    'bgm_2.mp3',
    'bgm_3.mp3',
    'bgm_1.mp3',
];
// выбераем случайную фоновую музыку
let bgMusicIndex = Math.floor(Math.random() * bgMusicsArr.length);

// функция для проигрования фоновых музык по очереди
function playBgMusic() {
    BG_MUSIC.src = SOUNDS_PATH + bgMusicsArr[bgMusicIndex];
    BG_MUSIC.play(); // включить выбранную из массива музыку
    bgMusicIndex++; // задать номер следующей музыки из массива
    // если это была последняя музыка - переключиться на первую
    if (bgMusicIndex === bgMusicsArr.length) bgMusicIndex = 0;
    // после окончания музыки вызываьб функцию "playBgMusic()"
    BG_MUSIC.addEventListener('ended', playBgMusic);
}

/*****************
 * 
 *  ЗАПУСК ИГРЫ
 */

let isGameStart = false;

function userPushStart() {
    fillCanvas();
    previousTimeStamp = performance.now();
    if (isOnFocus) requestAnimationFrame( animation );
    isGameStart = true;
    document.body.style.cursor = 'none';
}

let background, cursor, player, playerBulletsArr = [];

function fillCanvas() {
    background = new Background( 'scrolling-dark-bg-2000x900px.png' );
    cursor = new Cursor('player_cursor_48x48px_16frames.png', vcx, vcy);
    player = new Player( 'player_74x84px.png' );
}

/**********************
 * 
 *  ПОКИДАНИЕ ЭКРАНА
 */

let isOnFocus = true;
window.onfocus = () => {
    isOnFocus = true;
    if (isGameStart) {
        previousTimeStamp = performance.now();
        requestAnimationFrame ( animation );
    }
};
window.onblur = () => isOnFocus = false;

/**************
 * 
 *  АНИМАЦИЯ
 */

let previousTimeStamp;
function animation(timeStamp) {
    // обновляем временные метки
    const dt = timeStamp - previousTimeStamp;
    previousTimeStamp = timeStamp;

    // обнавляем canvas
    ctx.clearRect(0, 0, vw, vh);

    background.update(dt);

    cursor.update(dt, mouseX, mouseY);
    
    playerBulletsArr.forEach( bullet => bullet.update(dt) );
    playerBulletsArr = playerBulletsArr.filter( bullet => bullet.isExist );
    
    player.update(dt);
    
    // запускаем занова анимацию
    if (isOnFocus) requestAnimationFrame( animation );
}