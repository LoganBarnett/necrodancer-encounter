'use strict'
// I just learned I have Firefox installed on the tablet, so I don't need to
// keep taking these 2010 era measures...
console.log('In app.js...')
// Copied from ChatGPT.  Suspect it.
function get(url, successFn, failureFn) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
      console.log('Response:', xhr.responseText);
      successFn(xhr.responseText)
    } else {
      console.error('Request failed. Status:', xhr.status);
      failureFn(xhr.responseText)
    }
  };
  xhr.onerror = function() {
    console.error('Network error or request failure');
    failureFn(xhr.responseText)
  };
  xhr.send();
}

function post(url, successFn, failureFn) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
      console.log('Response:', xhr.responseText);
      successFn(xhr.responseText)
    } else {
      console.error('Request failed. Status:', xhr.status);
      failureFn(xhr.responseText)
    }
  };
  xhr.onerror = function() {
    console.error('Network error or request failure');
    failureFn(xhr.responseText)
  };
  xhr.send();
}

function directionToOrientationIndex(direction) {
  switch(direction.toLowerCase()) {
  case 'up':
    return 0
  case 'right':
    return 1
  case 'down':
    return 2
  case 'left':
    return 3
  }
}

function directionToElement(direction, i) {
  var li = document.createElement('li')
  var img = document.createElement('img')
  var color = colorName((colorOffset + i) % totalColors)
  // Credit of the arrow goes to
  // https://www.deviantart.com/mamonstar761/art/SSB-Series-Symbols-DDR-FANMADE-874362413
  // This needs to go in the README and I should probably request permission to
  // use it.
  img.src = 'static/arrow-up-' + color + '.png'

  console.log('initial direction', direction.toLowerCase())
  console.log('orientations', orientations)
  img.className = orientations[directionToOrientationIndex(direction.toLowerCase())]
  console.log('adjusted direction', img.className)
  li.appendChild(img)
  // li.innerText = direction
  return li
}

function nameToDirection(name) {
  switch(name) {
  case 'Up':
    return '↑'
  case 'Right':
    return '→'
  case 'Down':
    return '↓'
  case 'Left':
    return '←'
  default:
    return '💀'
  }
}

function directionsRender(directions) {
  var ul = document.querySelector('#directions')
  ul.innerHTML = ''
  console.log('innerHTML (after clear)', ul.innerHTML)
  directions
    .split(',')
    // .map(nameToDirection)
    .map(directionToElement)
    .forEach(function(el) { return ul.appendChild(el) })
  console.log('innerHTML (after set)', ul.innerHTML)
}

function directionsLoad() {
  get(
    '/directions',
    (dirs) => {
      directions = dirs
      directionsRender(dirs)
    },
    function(e) { console.error("HTTP error: " + e) }
  )
}

function directionsRegenerate() {
  const count = document.querySelector('#directions-count').value
  post(
    '/directions?direction_count=' + count,
    directionsLoad,
    function(e) { console.error("HTTP error: " + e) }
  )
}

function colorName(i) {
  switch(i) {
  case 0:
    return 'red';
  case 1:
    return 'green';
  case 2:
    return 'blue';
  case 3:
    return 'purple';
  }
}

var colorOffset = 0
var totalColors = 4
var orientations = ['up', 'right', 'down', 'left']
var directions = []

function orientationFromCardinal(direction) {
  switch(direction) {
  case 'north':
    return ['up', 'right', 'down', 'left']
  case 'east':
    return ['left', 'up', 'right', 'down']
  // I'm not sure south makes any sense but whatever.
  case 'south':
    return ['down', 'left', 'up', 'right']
  case 'west':
    return ['right', 'down', 'left', 'up']
  }
}

function reorient(target) {
  console.log('target.value', target.value)
  orientations = orientationFromCardinal(target.value)
  directionsRender(directions)
}

;(function() {
  console.log('Loading...')
  directionsLoad()
  setInterval(function() {
    console.log('tick')
    directionsLoad()
    colorOffset += 1
    document
      .querySelectorAll('img')
      .forEach(function(el, i) {
        el.src = el.src.replace(
          /red|blue|green|purple/,
          colorName((colorOffset + i) % totalColors)
        )
      })
  }, 1000)
})()

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const dmMode = urlParams.get('dm');
  const kioskMode = urlParams.get('kiosk');
  if(dmMode == 'true') {
    document.querySelector('#dm-controls').style = ''
    document.querySelector('#player-controls').style = 'display: none;'
  } else {
    document.querySelector('#player-controls').style = ''
    document.querySelector('#dm-controls').style = 'display: none;'
  }
  if(kioskMode != null) {
    document.querySelector('#dm-controls').style = 'display: none;'
    document.querySelector('#player-controls').style = 'display: none;'
    orientations = orientationFromCardinal(kioskMode)
  }
})
