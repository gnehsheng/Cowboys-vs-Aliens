/**  @type (HTMLCanvasElement) */
const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

window.addEventListener("keydown", function (e) {
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

const keys = []


const player = {
    x: 200,
    y: 200,
    width: 32,
    height: 48,
    frameX: 0,
    frameY: 0,
    speed: 11,
    moving: false
}

//PLAYER SPRITE & MOVEMENT
const playerSprite = new Image()
playerSprite.src = 'images/indianajones.png'

window.addEventListener('keydown', function (e) {
    keys[e.keyCode] = true
    player.moving = true
})

window.addEventListener('keyup', function (e) {
    delete keys[e.keyCode]
    console.log(e.keyCode)
    player.moving = false
})

function movePlayer() {
    if (keys[38] && player.y > 5) {
        player.y -= player.speed
        player.frameY = 3
        player.moving = true
    }
    if (keys[37] && player.x > 5) {
        player.x -= player.speed
        player.frameY = 1
        player.moving = true
    }
    if (keys[40] && player.y < canvas.height - player.height) {
        player.y += player.speed
        player.frameY = 0
        player.moving = true
    }
    if (keys[39] && player.x < canvas.width - player.width) {
        player.x += player.speed
        player.frameY = 2
        player.moving = true
    }
}

function handlePlayerFrame() {
    if (player.frameX < 3 && player.moving) player.frameX++
    else player.frameX = 0
}
let fps, fpsInterval, startTime, now, then, elapsed
function startAnimation(fps) {
    fpsInterval = 1000 / fps
    then = Date.now()
    startTime = then
    animate()
}

//ALIEN LOGIC
// let gameFrame = 0
// let numberOfAliens = 20
// let aliensArr = []
// const characterActions = ['up', 'top right', 'right', 'down right', 'down'];
// class Alien {
//     constructor() {
//         this.image = new Image()
//         this.image.src = 'images/death.png'
//         this.spriteWidth = 32
//         this.spriteHeight = 48
//         this.width = 32
//         this.height = 48
//         this.x = Math.random() * (canvas.width - this.width)
//         this.y = Math.random() * (canvas.height - this.height)
//         this.newX = Math.random() * (canvas.width - this.width)
//         this.newY = Math.random() * (canvas.height - this.height)
//         this.frame = 0
//         this.speed = (Math.random() * 2) + 3

//         this.action = characterActions[Math.floor(Math.random() * characterActions.length)];
//     }
//         update(){
//             if (this.action === 'up') {
//                 if (this.y < 0 - (this.height * 5)) {
//                      this.y = canvas.height + this.height;
//                      this.x = Math.random() * canvas.width;
//                      this.speed = (Math.random() * 2) + 3
//                  } else {
//                      this.y -= this.speed;  
//                  }
//              }
//              else if (this.action === 'top right') {
//                  if (this.y < 0 - this.height && this.x > canvas.width + this.width) {
//                      this.y = canvas.height + this.height
//                      this.x = Math.random() * canvas.width;
//                      this.speed = (Math.random() * 2) + 3
//                  } else {
//                      this.y -= this.speed; 
//                      this.x += this.speed; 
//                  }
//              }
//              else if (this.action === 'right') {
//                  if (this.x > canvas.width + (this.width * 5)) {
//                      this.x = 0 - this.width;
//                      this.y = Math.random() * canvas.height; 
//                      this.speed = (Math.random() * 2) + 3
//                  } else {
//                      this.x += this.speed; 
//                  }
//              }
//              else if (this.action === 'down right') {
//                  if (this.y > canvas.height + this.height && this.x > canvas.width + this.width) {
//                      this.y = 0 - this.height
//                      this.x = Math.random() * canvas.width;
//                      this.speed = (Math.random() * 2) + 3
//                  } else {
//                      this.y += this.speed; 
//                      this.x += this.speed; 
//                  }
//              } 
//              else if (this.action === 'down') {
//                  if (this.y > canvas.height + (this.height * 5)) {
//                      this.y = 0 - this.height;
//                      this.x = Math.random() * canvas.width;
//                      this.speed = (Math.random() * 2) + 3
//                  } else {
//                      this.y += this.speed;  
//                  }
//              }
//              else if (this.action === 'jump') {

//              }

//         let dx = this.x - this.newX
//         let dy = this.y - this.newY
//         this.x -= dx / 500
//         this.y -= dy / 500

//         if (this.x + this.width < 0) this.x = canvas.width
//         // if (alienInterval % 200 === 0) {
//         //      this.frame > 4 ? this.frame = 0 : this.frame++
//         // }
//     }
//     draw() {
//         ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
//             this.x, this.y, this.width, this.height)
//     }

// }

// for (let i = 0; i < numberOfAliens; i++) {
//     aliensArr.push(new Alien())
// }

const images = {};
images.player = new Image();
images.player.src = 'images/alien.png';
const characterActions = ['up', 'top right', 'right', 'down right', 'down'];
const numberOfCharacters = 20;
const characters = [];

class Character {
    constructor() {
        this.width = 32;
        this.height = 48;
        this.frameX = 0;
        this.frameY = 0
        this.x = Math.random() * canvas.width - this.width;
        this.y = Math.random() * canvas.height - this.height;
        this.speed = (Math.random() * 1) + 0.5;
        this.minFrame = 0;
        this.action = characterActions[Math.floor(Math.random() * characterActions.length)];
        if (this.action === 'up') {
            this.frameY = 3;
            this.minFrame = 0;
            this.maxFrame = 3
        }
        else if (this.action === 'top right') {
            this.frameY = 2;
            this.minFrame = 0;
            this.maxFrame = 3

        }
        else if (this.action === 'right') {
            this.frameY = 2;
            this.minFrame = 0;
            this.maxFrame = 3
        }
        else if (this.action === 'down right') {
            this.frameY = 2;
            this.minFrame = 0;
            this.maxFrame = 3
        }
        else if (this.action === 'down') {
            this.frameY = 0;
            this.minFrame = 0;
            this.maxFrame = 3
        }
        else if (this.action === 'jump') {
            this.frameY = 1;
            this.minFrame = 0;
            this.maxFrame = 3
        }

    }
    draw() {
        drawSprite(images.player, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width * 1.5, this.height * 1.5);

        if (this.frameX < this.maxFrame) this.frameX++;
        else this.frameX = this.minFrame;
    }
    update() {
        if (this.action === 'up') {
            if (this.y < 0 - (this.height * 5)) {
                this.y = canvas.height + this.height;
                this.x = Math.random() * canvas.width;
                this.speed = (Math.random() * 1) + 0.5;
            } else {
                this.y -= this.speed;
            }
        }
        else if (this.action === 'top right') {
            if (this.y < 0 - this.height && this.x > canvas.width + this.width) {
                this.y = canvas.height + this.height
                this.x = Math.random() * canvas.width;
                this.speed = (Math.random() * 1) + 0.5;
            } else {
                this.y -= this.speed;
                this.x += this.speed;
            }
        }
        else if (this.action === 'right') {
            if (this.x > canvas.width + (this.width * 5)) {
                this.x = 0 - this.width;
                this.y = Math.random() * canvas.height;
                this.speed = (Math.random() * 1) + 0.5;
            } else {
                this.x += this.speed;
            }
        }
        else if (this.action === 'down right') {
            if (this.y > canvas.height + this.height && this.x > canvas.width + this.width) {
                this.y = 0 - this.height
                this.x = Math.random() * canvas.width;
                this.speed = (Math.random() * 1) + 0.5;
            } else {
                this.y += this.speed;
                this.x += this.speed;
            }
        }
        else if (this.action === 'down') {
            if (this.y > canvas.height + (this.height * 5)) {
                this.y = 0 - this.height;
                this.x = Math.random() * canvas.width;
                this.speed = (Math.random() * 1) + 0.5;
            } else {
                this.y += this.speed;
            }
        }
        else if (this.action === 'jump') {

        }
    }
}

for (i = 0; i < numberOfCharacters; i++) {
    characters.push(new Character());
}

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
}
function animate() {
    requestAnimationFrame(animate)
    now = Date.now()
    elapsed = now - then
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height)
        movePlayer()
        handlePlayerFrame()
    }
    for (i = 0; i < characters.length; i++) {
        characters[i].draw();
        characters[i].update();
    }

}
startAnimation(40)

// window.onload = setInterval(animate, 1000/20);