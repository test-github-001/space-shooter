'use strict';

/*
**  ЗАГРУЗЧИК
*/

const IMG = {/* game images */};
const IMAGES_PATH = './src/images/';

const SE = {/* sound effects */};
const SOUNDS_PATH = './src/sounds/';

const IMAGES_UPLOAD_ARR = [
    'scrolling_bg_2000x3400px.png',
    'black_hole_left_320x320px.png',
    'black_hole_right_320x320px.png',
    'galaxy_1200x800px.png',
    'galaxy_480x420px.png',
    'planets_920x760px.png',

    'player_74x100px_16frames.png',
    'player_bullet_10x40px.png',
    'player_rocket_30x12px.png',
    'player_cursor_48x48px_16frames.png',

    'explosion_200x200px_16frames.png',
    'smoke_32x32px_20frames.png',

    'asteroid_white_90x108px_29frames.png',
    'rock_white_50x50px_8frames.png',

    'enemy_100x130px.png',
    'enemy_bullet_10x40px.png',

    'bonus_empty_48x48px.png',
    'bonus_bullets_48x48px.png',
    'bonus_repair_48x48px.png',
    'bonus_rockets_48x48px.png',
    'bonus_scores_48x48px.png',
    'bonus_speed_48x48px.png',
];

const SOUNDS_UPLOAD_ARR = [
    'se_explosion.mp3',
    'se_laser_shut.mp3',
    'se_rocket_launch.mp3',
    'se_bonus.mp3',
];

let uploadSize = SOUNDS_UPLOAD_ARR.length + IMAGES_UPLOAD_ARR.length;
let uploadStep = 0;

const LOADING_STATUS_DIV = document.createElement('div');
LOADING_STATUS_DIV.id = 'loadingStatusDiv';
LOADING_STATUS_DIV.innerHTML = 'Загружено: ' + uploadStep + '/' + uploadSize;
document.body.append(LOADING_STATUS_DIV);

IMAGES_UPLOAD_ARR.forEach( data => uploadImage(data) );
SOUNDS_UPLOAD_ARR.forEach( data => uploadSound(data) );

function uploadImage(image_name) {
    IMG[image_name] = new Image();
    IMG[image_name].src = IMAGES_PATH + image_name;
    IMG[image_name].onload = () => updateLoadingProgress();
}

function uploadSound(sound_name) {
    SE[sound_name] = new Audio();
    SE[sound_name].src = SOUNDS_PATH + sound_name;
    SE[sound_name].oncanplaythrough = (event) => {
        event.target.oncanplaythrough = null; /* don't play */
        updateLoadingProgress();
    };
}

function updateLoadingProgress() {
    uploadStep++;
    LOADING_STATUS_DIV.innerHTML = 'Загружено: ' + uploadStep + '/' + uploadSize;
    console.log('Загружено: ' + uploadStep + '/' + uploadSize);
    if (uploadStep === uploadSize) loadingDone();
}

function loadingDone() {
    LOADING_STATUS_DIV.remove();
    const START_BUTTON = document.createElement('button');
    START_BUTTON.id = 'startButton';
    START_BUTTON.innerHTML = 'START';
    START_BUTTON.onclick = function() {
        START_BUTTON.remove();
        const INIT_SCRIPT = document.createElement('script');
        INIT_SCRIPT.src = './js/init.js';
        document.body.append(INIT_SCRIPT);
    };
    document.body.append(START_BUTTON);
}