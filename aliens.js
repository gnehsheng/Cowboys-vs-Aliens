//ALIEN ANIMATION & MOVEMENT
/**  @type (HTMLCanvasElement) */
const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = 748
canvas.height = 800
const numberOfAliens = 20
const aliensArr = []

let gameFrame = 0
class Alien {
    constructor() {
        this.image = new Image()
        this.image.src = 'images/death.png'
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.speed = Math.random() * 4 - 2
        this.spriteWidth = 32
        this.spriteHeight = 48
        this.width = 32
        this.height = 48
        this.frame = 0
        this.moveSpeed = Math.floor(Math.random() * 3 + 1)
    }
    update() {
        this.x += this.speed
        this.y += this.speed
        if (gameFrame % 2 === 0) {
            this.frame > 4 ? this.moveSpeed = 0 : this.frame++
        }
    }
    draw() {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height)
    }
}

for (let i = 0; i < numberOfAliens; i++) {
    aliensArr.push(new Alien())
}


function animate2() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    aliensArr.forEach(enemy => {
        enemy.draw()
        enemy.update()
    })
    gameFrame++
    requestAnimationFrame(animate)
}
animate2()