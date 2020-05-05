const ARENA_HEIGHT = 500
const ARENA_WIDTH = 500
const BOMB_SPEED = 25
const BOMBER_DAMAGE_COUNT = 15
const USER_DAMAGE_COUNT = 30
const MAX_HEALTH = 150
const BARRIER_SETTINGS = {
  SPEED: 25,
  WIDTH: 100
}
window.GAME_STATUS = 0

var arenaRef, userHealthBar, bomberHealthBar, barrier
var leftMov = 1
var topMov = 1
var userDamage = 0
var bomberDamage = 0

initGameSettings = () => {
  bomberHealthBar.style.width = '150px'
  userHealthBar.style.width = '150px'
  window.GAME_STATUS = 1
  prepDefense()
}

window.onload = () => {
  arenaRef = document.getElementById('game-arena')
  userHealthBar = document.getElementById('user_damange')
  bomberHealthBar = document.getElementById('bomber_damage')
  barrier = document.getElementById('barrier')

  initGameSettings()
  startGame()
}

startGame = () => {
  let bomb1 = createBomb()
  fireBomb(bomb1)
  // setTimeout(() => {
  //   let bomb2 = createBomb()
  //   fireBomb(bomb2)
  // }, 3000)
}

createBomb = () => {
  window.bomb = document.createElement('img')
  bomb.setAttribute('class', 'bomb')
  bomb.setAttribute('src', './bombImage.png')
  bomb.style.top = '15px'
  bomb.style.left = (Math.random() * (400 - 0) + 0) + 'px'
  arenaRef.appendChild(bomb)
  return bomb
}

stopGame = () => {
  window.GAME_STATUS = 0
  clearInterval(window.TimerFunc)
  bomb.style.top = '220px'
  bomb.style.left = '220px'
}

getArenaPos = () => arenaRef.getBoundingClientRect()

/* ----------------Bomb Specific actions-------------------*/

detectBarrierCollision = () => {
  let bombBounds = bomb.getBoundingClientRect()
  let barrierBounds = barrier.getBoundingClientRect()
  barrierBounds = {
    minLeft: Math.abs(barrierBounds.x),
    maxLeft: Math.abs(barrierBounds.right),
    top: Math.abs(barrierBounds.top)
  }
  let bombPos = {
    x: Math.abs(bombBounds.x + (bombBounds.width / 2)), // center point of bom
    bottom: Math.abs(bombBounds.bottom)
  }

  let withinLeftRange = (bombPos.x >= barrierBounds.minLeft && bombPos.x <= barrierBounds.maxLeft)
  let topRange = (bombPos.bottom >= barrierBounds.top)
  if (withinLeftRange && topRange) {
    return true
  }
  return false

}


moveBomb = (bombRef) => {
  let pos = { x: bombRef.offsetLeft, y: bombRef.offsetTop }
  let arenaBounds = getArenaPos()
  let bombBounds = bombRef.getBoundingClientRect()

  if (bombBounds.right >= (arenaBounds.right -5) || pos.x < 0) {
    leftMov *= -1
  }
  if (bombBounds.bottom >= (arenaBounds.bottom - 5) || pos.y <= 0) {
    topMov *= -1
  }

  if (detectBarrierCollision()) {
    topMov *= -1
  }
  checkDamage(bombBounds)

  if (!window.GAME_STATUS) {
    return
  }
  bomb.style.left = ((pos.x) + (BOMB_SPEED * leftMov)) + 'px'
  bomb.style.top = ((pos.y) + (BOMB_SPEED * topMov)) + 'px'
}

fireBomb = (bombRef) => {
  window.TimerFunc = setInterval(() => {
    moveBomb(bombRef)
  }, 50)
}

checkDamage = (bombBounds) => {
  let posY = bomb.offsetTop
  let arenaBounds = getArenaPos()
  if ([userDamage, bomberDamage].includes(MAX_HEALTH)) {
    stopGame()
    return
  }
  if (bombBounds.bottom >= (arenaBounds.bottom - 5)) {
    userDamage += USER_DAMAGE_COUNT
    setUserDamageValue()
  }
  if (posY <= 0) {
    bomberDamage += BOMBER_DAMAGE_COUNT
    setBomberDamageValue()
  }
}

setBomberDamageValue = () => {
  bomberHealthBar.style.width = (MAX_HEALTH - bomberDamage) + 'px'
}
setUserDamageValue = () => {
  userHealthBar.style.width = (MAX_HEALTH - userDamage) + 'px'
}

/* ----------------User defense control---------------- */
prepDefense = () => {
  document.onkeydown = (event) => {
    if (event.keyCode === 37) {
      console.log('move left')
      moveUserBar('left')
      return
    }
    if (event.keyCode === 39) {
      console.log('move Right')
      moveUserBar('right')
      return
    }
  }
}

moveUserBar = (type) => {
  let posX = barrier.offsetLeft
  let dir = (type === 'left' ? -1 : 1)
  let speed = (BARRIER_SETTINGS.SPEED * dir)
  if ((posX === 0 && dir === -1) || ((posX + BARRIER_SETTINGS.WIDTH) > ARENA_WIDTH) && dir === 1) {
    return
  }
  if (posX + speed < 0) {
    speed = 0
    posX = 0
  }
  if (posX + BARRIER_SETTINGS.WIDTH + speed >= ARENA_WIDTH) {
    speed = 0
    posX = ARENA_WIDTH - BARRIER_SETTINGS.WIDTH
  }
  barrier.style.left = (posX + speed) + 'px'
}
