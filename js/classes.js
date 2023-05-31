'use strict';

/********************** 
 * 
 *   ИГРОВЫЕ КЛАССЫ
 */

class Sprite {
    constructor(imageName, x, y) {
        this.img = IMG[imageName];
        this.x = x;
        this.y = y;
        this.w = this.img.width;
        this.h = this.img.height;
        this.hw = Math.floor(this.w / 2);
        this.hh = Math.floor(this.h / 2);
        this.isExist = true;
        this.direction = 0;
    }

    draw() {
        ctx.drawImage(
            this.img,        // ссылка на изображение
            0, 0,            // Координаты текущего кадра [x, y] на изображении
            this.w, this.h,  // Ширина и высоты текущего кадра
            this.x - this.hw,  this.y - this.hh, // Координаты на canvas [x, y] для отрисовки кадра
            this.w, this.h   // Ширина и высоты текущего кадра для отрисовки на canvas
        );
    }

    rotationDraw() {
        ctx.setTransform(1, 0, 0, 1, this.x, this.y);
        ctx.rotate(this.direction);
        ctx.drawImage(
            this.img, 0, 0, this.w, this.h,
            -this.hw, -this.hh, this.w, this.h
        );
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}

class AnimationSprite extends Sprite {
    constructor(imageName, x, y, fw, fh, frames, fps = 60, isInfinity = true) {
        super(imageName, x, y);
        this.framesArr = this.getFramesArr(fw, fh, frames);
        this.frame = 0
        this.fw = fw;
        this.fh = fh;
        this.fhw = Math.floor(this.fw / 2);
        this.fhh = Math.floor(this.fh / 2);
        this.frames = frames;
        this.nextFrame = Math.floor(1000 / fps);
        this.nextFrameTimeout = this.nextFrame;
        this.isInfinity = isInfinity;
        this.isExist = true;
        this.direction = 0;
    }

    getFramesArr(fw, fh, frames) {
        const framesArr = [];
        for( let yy = 0; yy < this.h; yy += fh) {
            for( let xx = 0; xx < this.w; xx += fw) {
                framesArr.push( {x: xx, y: yy} );
            }
        }
        framesArr.length = frames;
        return framesArr;
    }

    draw(dt) {
        // get current frame...
        this.nextFrameTimeout -= dt
        if (this.nextFrameTimeout < 0) {
            this.nextFrameTimeout += this.nextFrame;
            this.frame++;
            if (this.frame === this.frames) {
                if (this.isInfinity )this.frame = 0;
                else this.isExist = false;
            }
        }
        ctx.drawImage(
            this.img,
            this.framesArr[this.frame].x, this.framesArr[this.frame].y, 
            this.fw, this.fh,
            this.x - this.fhw,  this.y - this.fhh,
            this.fw, this.fh
        );
    }
}

class Cursor extends AnimationSprite {
    constructor(imageName, x, y) {
        super(imageName, x, y, 48, 48, 16, 15);
    }

    update(dt, x, y) {
        this.x = x;
        this.y = y;
        this.draw(dt);
    }
}

class Background extends Sprite {
    constructor (imageName) {
        super(imageName, 0, 0)
        this.x = Math.floor((vw -  this.w) / 2) ;
        this.y1 = -this.h;
        this.y2 = 0;
        this.scrollSpeed = 30 /* px/s */ / 1000 /* px/ms */;
    }

    update(dt) {
        let speed = this.scrollSpeed * dt;
        this.y1 += speed;
        this.y2 += speed;
        if (this.y2 >= this.h) {
            this.y1 = -this.h;
            this.y2 = 0;
        }
        ctx.drawImage(this.img, this.x, this.y1);
        ctx.drawImage(this.img, this.x, this.y2);
    }
}

class Player extends Sprite {
    constructor(imageName) {
        super(imageName, vcx, vcy);
        this.speed = 100 /* px/s */ / 1000 /* px/ms */;
        this.shutSpeed = 1 /* shut/s */ * 1000 /* ms for shut */;
        this.nextShutTimeout = this.shutSpeed;
        this.size = Math.floor(this.w * 0.8);
    }

    update(dt) {
        // turn
        if (mouseX !== this.x || mouseY !== this.y) {
            let dx = mouseX - this.x;
            let dy = mouseY - this.y;
            let distance = Math.sqrt( dx**2 + dy**2 );
            let fly = this.speed * dt;
            
            if (distance <= fly) {
                this.x = mouseX;
                this.y = mouseY;
            } else {
                let flyRate = fly / distance;
                this.x += flyRate * dx;
                this.y += flyRate * dy;
            }
        }

        // shut
        this.nextShutTimeout -= dt;
        if (this.nextShutTimeout <= 0) {
            this.nextShutTimeout += this.shutSpeed;
            playerBulletsArr.push( new PlayerBullet(this.x, this.y, 0.5) )
        }

        // draw
        this.draw();
    }
}

class PlayerBullet extends Sprite {
    constructor(x, y, speed) {
        super('player_bullet_10x40px.png', x, y);
        this.speed = speed;
        this.size = this.w;
    }

    update(dt) {
        this.y -= this.speed * dt;
        if (this.y < -this.h) this.isExist = false;
        else this.draw();
    }
}