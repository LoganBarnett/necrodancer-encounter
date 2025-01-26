'use-strict'

const danceFloorTick = () => {
  console.log('tick')
  const body = document.querySelector('body')
  body.className = body.className == 'a-theme' ? 'b-theme' : 'a-theme'
}

document.addEventListener('DOMContentLoaded', () => {
  const floor = document.querySelector('#floor')
  const width = 20
  const height = 20
  Array(width * height)
    .fill()
    .map(n => {
      const li = document.createElement('li')
      li.className = 'tile'
      return li
    })
    .forEach(el => floor.appendChild(el))
  setInterval(danceFloorTick, 1000)
  danceFloorTick()
})
