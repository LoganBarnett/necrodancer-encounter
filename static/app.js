console.log('In app.js...')
// Copied from ChatGPT.  Suspect it.
function get(url, successFn, failureFn) {
  const xhr = new XMLHttpRequest();
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
  const xhr = new XMLHttpRequest();
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

function directionToElement(direction) {
  const el = document.createElement('li')
  el.innerText = direction
  return el
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
  const ul = document.querySelector('#directions')
  ul.innerHTML = ''
  console.log('innerHTML (after clear)', ul.innerHTML)
  directions
    .split(',')
    .map(nameToDirection)
    .map(directionToElement)
    .forEach(el => ul.appendChild(el))
  console.log('innerHTML (after set)', ul.innerHTML)
}

function directionsLoad() {
  get('/directions', directionsRender, e => console.error("HTTP error: " + e))
}

function directionsRegenerate() {
  count = document.querySelector('#directions-count').value
  post(
    '/directions?direction_count=' + count,
    directionsLoad,
    e => console.error("HTTP error: " + e)
  )
}

(function() {
  console.log('Loading...')
  directionsLoad()
})()
