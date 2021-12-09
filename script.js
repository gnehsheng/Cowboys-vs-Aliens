
let playerState = 'moving'

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
const canvas_width = canvas.wdth = 600
const canvas_height = canvas.height = 600

const playerImage = new Image()
playerImage.src = 'images/Player Front Sheet.png'
const spriteWidth = 240
const spriteHeight = 220

let gameFrame = 0
const staggerFrames = 15
const spriteAnimations = []
const animationStates = [
    {
        name: 'idle',
        frames: 5,
    },
    {
        name: 'moving',
        frames: 7,
    },
    {
        name: 'shooting',
        frames: 5,
    },
    {
        name: 'surprised',
        frames: 1,
    },
    {
        name: 'death',
        frames: 13,
    },
]
animationStates.forEach((state, index) => {
    let frames = {
        loc: [],
    }
    for(let j = 0; j < state.frames; j++){
        let positionX = j * spriteWidth
        let positionY = index * spriteHeight
        frames.loc.push({x: positionX, y: positionY})
    }
    spriteAnimations[state.name] = frames
})

function animate() {
    ctx.clearRect(0, 0, canvas_width, canvas_height)
    let position = Math.floor(gameFrame/staggerFrames) % spriteAnimations[playerState].loc.length
    let frameX = spriteWidth * position
    let frameY = spriteAnimations[playerState].loc[position].y

    ctx.drawImage(playerImage, frameX, frameY, spriteWidth,
    spriteHeight, 0, 0, spriteWidth, spriteHeight,)

    gameFrame++
    requestAnimationFrame(animate)
}
animate()