
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

const scoreEl = document.querySelector('#scoreEl')

class Player {
    constructor() {
        this.x = canvas.width / 2
        this.y = canvas.height / 2
        this.width = 32
        this.height = 48
        this.frameX = 0
        this.frameY = 0
        this.speed = 3
        this.moving = false
    }
    movement() {
        if (keys[38] && this.y > 5) {
            this.y -= this.speed
            this.frameY = 3
            this.moving = true
        }
        if (keys[37] && this.x > 5) {
            this.x -= this.speed
            this.frameY = 1
            this.moving = true
        }
        if (keys[40] && this.y < canvas.height - this.height) {
            this.y += this.speed
            this.frameY = 0
            this.moving = true
        }
        if (keys[39] && this.x < canvas.width - this.width) {
            this.x += this.speed
            this.frameY = 2
            this.moving = true
        }
    }
    handlePlayerFrame() {
        if (this.frameX < 3 && this.moving) this.frameX++
        else this.frameX = 0
    }
}

const player = new Player()
const keys = []

window.addEventListener('keydown', function (e) {
    keys[e.keyCode] = true
    player.moving = true
})

window.addEventListener('keyup', function (e) {
    delete keys[e.keyCode]
    player.moving = false
})

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }
    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

const friction = 0.97
class Effect {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }
    draw() {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.restore()
    }
    update() {
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
}


const playerSprite = new Image()
playerSprite.src = 'images/COWBOY.png'

const enemySprite = new Image()
enemySprite.src = 'images/alien.png'

const images = []
const enemies = []
const projectiles = []
const effects = []

class Enemy {
    constructor() {
        this.width = 32
        this.height = 48
        this.frameX = 0
        this.frameY = 0
        this.type = true
        this.x = Math.random() < 0.5 ? 0 - this.width : canvas.width + this.width
        this.y = Math.random() < 0.5 ? 0 - this.height : canvas.height + this.height
        this.speed = Math.random() / 1.5 + 0.5
    }
    drawEnemy() {
        drawSprite(enemySprite, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)

        if (this.frameX < this.maxFrame) this.frameX++
        else this.frameX = this.minFrame
    }
    handleAlienFrame() {
        if (this.frameX < 3 && this.moving) this.frameX++
        else this.frameX = 0
    }
    update() {
        let check = false
        if (player.x > this.x) {
            this.x += this.speed
            check = true
        } else if (player.x < this.x) {
            this.x -= this.speed
            check = true
        }
        if (player.y > this.y) {
            this.y += this.speed
            check = true
        } else if (player.y < this.y) {
            this.y -= this.speed
            check = true
        }
    }
}

function createEnemies() {
    setInterval(() => {
        let x
        let y
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - this.width : canvas.width + this.width
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - this.height : canvas.height + this.height
        }

        enemies.push(new Enemy())
    }, 300)

}
createEnemies()

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
}

window.addEventListener('click', (e) => {
    const angle = Math.atan2(
        e.clientY - canvas.height / 2, e.clientX - canvas.width / 2
    )
    const velocity = {
        x: Math.cos(angle) * 3,
        y: Math.sin(angle) * 3
    }
    projectiles.push(new Projectile(
        canvas.width / 2, canvas.height / 2, 3, 'black', velocity)
    )
})

let animationId
let score = 0

function animate() {
    animationId = requestAnimationFrame(animate)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height)
    player.movement()
    player.handlePlayerFrame()
    //calling and removing explosion effects
    effects.forEach((effect, index) => {
        if (effect.alpha <= 0) {
            effects.splice(index, 1)
        } else {
            effect.update()
        }
    })


    projectiles.forEach((projectile, index) => {
        projectile.update()
        //removing projectiles after leaving canvas
        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height
        ) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        }
    })

    enemies.forEach((enemy, index) => {
        drawSprite(enemySprite, enemy.width * enemy.frameX, enemy.height * enemy.frameY, enemy.width, enemy.height, enemy.x, enemy.y, enemy.width, enemy.height)
        enemy.update()

        //end game 
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if (dist - enemy.width - player.width < 1 || dist - enemy.height - player.height < 1) {
            cancelAnimationFrame(animationId)
        }

        enemy.handleAlienFrame()
        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

            //removing enemies and projectiles
            if (dist - enemy.width - projectile.radius < 1 || dist - enemy.height - projectile.radius < 1) {
                //increasing score
                scoreEl.innerHTML = score
                score += 50

                //creating effects
                for (let i = 0; i < 20; i++) {
                    effects.push(new Effect(projectile.x, projectile.y, Math.random() * 2, 'red',
                        {
                            x: (Math.random() - 0.5) * (Math.random() * 5), y: (Math.random() - (Math.random() * 5))
                        }))
                }
                setTimeout(() => {
                    enemies.splice(index, 1)
                    projectiles.splice(projectileIndex, 1)
                }, 0)
            }
        })
    })
}



animate()

