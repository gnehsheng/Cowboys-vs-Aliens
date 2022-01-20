const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

const scoreEl = document.querySelector('#scoreEl')
const startGameEl = document.querySelector('#startGameEl')
const start = document.querySelector('.start')
const pts = document.querySelector('.pts')
const highScore = document.querySelector('#highScoreEl')

const friction = 0.97
let globalCounter = 0
let images = []
let enemies = []
let projectiles = []
let effects = []
let keys = []
let t
let fps = 30
let fpsInterval, startTime, now, then, elapsed
let animationId
let score = 0
let frame = 0
let foilages = []
let slowSpeed = false

const gameStartSound = new Audio(src = 'sounds/gamestart.wav')
const gameOverSound = new Audio(src = 'sounds/gameover.wav')
const increaseLevelSound = new Audio(src = 'sounds/levelsound.wav')
gameOverSound.volume = 0.4
gameStartSound.volume = 0.4
increaseLevelSound.volume = 0.4
increaseLevelSound.playbackRate = 1.5

function gunShot() {
    let sound = new Audio(src = 'sounds/gunshot.mp3')
    sound.load()
    sound.play()
    sound.volume = 0.25
}

function enemyDeathSound() {
    const sound = new Audio(src = 'sounds/enemydeath.wav')
    sound.load()
    sound.play()
    sound.volume = 0.3
}

const currentScore = document.querySelector('.score')
currentScore.addEventListener('click', (event) => {
    event.preventDefault()
})

function init() {
    images = []
    foilages = []
    enemies = []
    projectiles = []
    effects = []
    score = 0
    scoreEl.innerHTML = score
    pts.innerHTML = score
    player.resetCoords()

}

//player class
class Player {
    constructor() {
        this.x = canvas.width / 2
        this.y = canvas.height / 2
        this.width = 32
        this.height = 48
        this.frameX = 0
        this.frameY = 0
        this.minFrame = 0
        this.maxFrame = 3
        this.speed = 6
        this.moving = false
    }
    update() {
        if (frame % 4 === 0) {
            if (this.frameX < this.maxFrame) {
                this.frameX++
            } else {
                this.frameX = this.minFrame
            }
        }
    }

    resetCoords() {
        this.x = canvas.width / 2
        this.y = canvas.height / 2
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
        if (this.moving && frame % 6 === 0) {
            if (this.frameX < this.maxFrame) {
                this.frameX++
            }
        } else {
            this.frameX = this.minFrame
        }

        ctx.drawImage(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height)
    }
}

//bullet class
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

//"blood" splatter effect
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
        this.alpha -= 0.05
    }
}
class Enemy {
    constructor() {
        this.width = 32
        this.height = 48
        this.frameX = 0
        this.frameY = 0
        this.minFrame = 0
        this.maxFrame = 3
        this.type = true
        this.x = Math.random() < 0.5 ? 0 - this.width : canvas.width + this.width
        this.y = Math.random() < 0.5 ? 0 - this.height : canvas.height + this.height
        this.speed = Math.random() * 0.9 + 0.3
    }
    handleAlienFrame() {
        if (this.frameX < 3 && frame % 5 === 0) {
            if (this.frameX < this.maxFrame) {
                this.frameX++
            }
        } else {
            this.frameX = this.minFrame
        }
    }

    update() {
        //chasing logic
        let dx = player.x - this.x
        let dy = player.y - this.y

        dx > 0 ? (this.x += this.speed) : (this.x -= this.speed)
        dy > 0 ? (this.y += this.speed) : (this.y -= this.speed)
        //enemy sprite frame facing
        this.frameY = (dx >= dy) ? dx > 0 ? 2 : 1 : dy > 0 ? 0 : 3
    }
}

class Foilage {
    constructor() {
        this.random = Math.random()
        this.width = 49 + 49 * this.random
        this.height = 30 + 30 * this.random
        this.x = Math.random() * canvas.width - this.width
        this.y = Math.random() * canvas.height - this.height
    }
    draw() {
        ctx.drawImage(foilageSprite, this.x, this.y, this.width, this.height)
    }
}

const foilageSprite = new Image()
foilageSprite.src = 'images/foilage.png'

function createFoilage() {
    for (i = 0; i <= 30; i++) {
        let foilageImg = new Foilage()
        foilages.push(foilageImg)
    }

}

const player = new Player()
const playerSprite = new Image()
playerSprite.src = 'images/cowboy.png'

const enemySprite = new Image()
enemySprite.src = 'images/death.png'

function createEnemies() {
    t = setInterval(() => {
        let x
        let y
        let enemy = new Enemy()

        if (Math.random() < 0.5) {
            enemy.x = Math.random() < 0.5 ? 0 - enemy.width : canvas.width + enemy.width
            enemy.y = Math.random() * canvas.height
        } else {
            enemy.x = Math.random() * canvas.width
            enemy.y = Math.random() < 0.5 ? 0 - enemy.height : canvas.height + enemy.height
        }
        enemies.push(enemy)
        //increasing game difficulty
    }, globalCounter < 750 ? 1000 : globalCounter > 500 && globalCounter < 1500 ? 500 : 150)
}

function resetEnemies() {
    clearInterval(t)
    createEnemies()
    //visual indicator for increased spawnrate of enemies
    document.getElementById("canvas").className = "flashing"
    increaseLevelSound.play()
    setTimeout(() => {
        document.getElementById("canvas").className = ''
    }, 1200)
}

//firing projectiles 
function shootBullets(e) {
    const angle = Math.atan2(
        e.pageY - player.y - 24, e.pageX - player.x - 16
    )
    const velocity = {
        x: Math.cos(angle) * 30,
        y: Math.sin(angle) * 30
    }
    projectiles.push(new Projectile(
        player.x + player.width / 2, player.y + player.height / 2, 3, 'black', velocity)
    )
    gunShot()
}

function startAnimation(fps) {
    fpsInterval = 1000 / fps
    then = Date.now()
    startTime = then
    animate()
    createEnemies()
}

window.onload = function () {
    let scoreFromLocal = localStorage.getItem('#highScoreEl')
    if (scoreFromLocal != undefined) highScore.innerHTML = scoreFromLocal
}

//pressing keys down listener
window.addEventListener('keydown', function (e) {
    keys[e.keyCode] = true
    player.moving = true
})

//when releasing pressed keys listener
window.addEventListener('keyup', function (e) {
    delete keys[e.keyCode]
    player.moving = false
})

//when starting game
startGameEl.addEventListener('click', () => {
    init()
    startAnimation(120)
    createEnemies()
    createFoilage()
    gameStartSound.play()
    start.style.display = 'none'

    setTimeout(() => {
        window.addEventListener('click', shootBullets)
    }, 50)
})

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
}

function animate() {
    frame++
    animationId = requestAnimationFrame(animate)
    now = Date.now()
    elapsed = now - then
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval)

        globalCounter++
        globalCounter === 750 ? resetEnemies() : globalCounter === 1500 ? resetEnemies() : null

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        //creating players
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

        //creating projectiles
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

        //creating enemies
        enemies.forEach((enemy, index) => {
            drawSprite(enemySprite, enemy.width * enemy.frameX, enemy.height * enemy.frameY, enemy.width, enemy.height, enemy.x, enemy.y, enemy.width, enemy.height)
            enemy.handleAlienFrame()
            enemy.update()
            slowSpeed = false
            //end game 
            if (player.x < enemy.x + enemy.width && player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height && player.y + player.height > enemy.y) {
                cancelAnimationFrame(animationId)

                start.style.display = ''
                pts.innerHTML = score

                if (score > highScore.innerHTML) highScore.innerHTML = score
                localStorage.setItem('#highScoreEl', highScore.innerHTML)

                gameOverSound.play()
                globalCounter = 0
                clearInterval(t)
                window.removeEventListener('click', shootBullets)
            }

            projectiles.forEach((projectile, projectileIndex) => {
                //removing enemies and projectiles
                if (projectile.x < enemy.x + enemy.width && projectile.x + projectile.radius > enemy.x &&
                    projectile.y < enemy.y + enemy.height && projectile.y + projectile.radius > enemy.y) {
                    //increasing score
                    score += 50
                    scoreEl.innerHTML = score
                    enemyDeathSound()

                    //creating effects
                    for (let i = 0; i < 30; i++) {
                        effects.push(new Effect(projectile.x, projectile.y, Math.random() * 2, 'red',
                            {
                                x: (Math.random() + 0.1) * (Math.random() * 10), y: (Math.random() - (Math.random() * 10))
                            }))
                    }
                    setTimeout(() => {
                        enemies.splice(index, 1)
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                }
            })
        })
        foilages.forEach((foilageImg) => {
            foilageImg.draw()
            if (foilageImg.x < player.x + player.width && foilageImg.x + foilageImg.width > player.x &&
                foilageImg.y < player.y + player.height && foilageImg.y + foilageImg.height > player.y) {
                slowSpeed = true
            }
        })
        if (slowSpeed) {
            player.speed = 3
        } else {
            player.speed = 6
        }
    }
}