function init() {

  const canvas = document.querySelector('#canvas')
  const pageHeader = document.querySelector('#page_header')
  const burgerMenu = document.querySelector('#burger_menu')
  const menuOverlay = document.querySelector('#menu_overlay')

  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  canvas.width = windowWidth
  // canvas.height = windowHeight
  canvas.height = windowHeight - 100 // ! To account for tags!

  const ctx = canvas.getContext('2d')
  
  const numberOfCircles = Math.floor(windowWidth / 30)
  // const numberOfCircles = 1 // ! FOR TESTING PURPOSES
  const maxRadius = 30
  const minRadius = 3
  const circleSensitivity = 200
  const circleSpeed = 30
  const circleStaticSpeed = 4
  let movementTimer

  let burgerOpen = false
  
  const circles = []

  const colours = ['#AA7DCE', '#8663a3', 'c28fec'] 
  
  const client = {
    x: null,
    y: null
  }

  class Circle {
    constructor(radius, position) {
      this.colour = colours[randomColours()]
      this.radius = radius
      this.position = {
        x: position[0],
        y: position[1]
      }
      this.direction = [(parseFloat(Math.random().toFixed(2)) - 0.5) / circleStaticSpeed, (parseFloat(Math.random().toFixed(2)) - 0.5) / circleStaticSpeed]
    }
  }

  function createCircle() {
    const radius = Math.floor(Math.random() * (maxRadius - minRadius)) + minRadius
    let positionX = Math.ceil(Math.random() * windowWidth)
    positionX = Math.min(Math.max(positionX, 0 + radius), windowWidth - radius)
    let positionY = Math.ceil(Math.random() * windowHeight) 
    positionY = Math.min(Math.max(positionY, 0 + radius), windowHeight - radius)
    return { radius, positionX, positionY }
  }

  function checkForOverlap(circle, newCircle) {
    return calculateDistanceBetweenCircles(circle, newCircle.positionX, newCircle.positionY, newCircle.radius)
  }
  
  // For circle collision
  function circleChecker(newCircle) {
    for (let x = 0; x < circles.length; x++) {
      if (checkForOverlap(circles[x], newCircle)) {
        return createCircle()
      }
    }
    return newCircle
  }

  function createCircles(num) {
    for (let i = 0; i < num; i++) {
      const newCircle = createCircle()
      // console.log(newCircle)
      // newCircle = circleChecker()
      circles.push(new Circle(newCircle.radius, [newCircle.positionX, newCircle.positionY]))
    }
    console.log(circles)
  }
  
  function randomColours() {
    return Math.ceil(Math.random() * colours.length) - 1
  }
  
  function drawCircles() {
    circles.forEach(circle => {
      
      ctx.fillStyle = circle.colour
      // ! Do the shadows look good? - too Performant
      // ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      // ctx.shadowBlur = 145
      // ctx.shadowOffsetX = 3
      // ctx.shadowOffsetY = 63
      //  box-shadow: 0px 63px 154px -20px rgba(0, 0, 0, 0.5);

      ctx.beginPath()
      ctx.ellipse(circle.position.x, circle.position.y, circle.radius, circle.radius, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.closePath()
    })
  }
  
  function calculateDistance(circle) {
    const opp = Math.pow(circle.position.x - client.x, 2)
    const adj = Math.pow(circle.position.y - client.y, 2)
    const hyp = Math.sqrt(opp + adj)
    return hyp
  }
  
  function calculateDistanceBetweenCircles(circle, pointX, pointY, radius) {
    const opp = Math.pow(circle.position.x - pointX, 2)
    const adj = Math.pow(circle.position.y - pointY, 2)
    const hyp = Math.abs(Math.sqrt(opp + adj))
    if (circle.radius + radius <= hyp) return true
    return false
  }
  
  function calculateUnitVector(circle) {
    const opp = circle.position.x - client.x
    const adj = circle.position.y - client.y
    const magnitude = Math.sqrt(Math.pow(opp, 2) + Math.pow(adj, 2) )
    const unitVector = [opp / magnitude, adj / magnitude]
    return unitVector
  }
  
  function onTick() {
    ctx.clearRect(0, 0, windowWidth, windowHeight)
    circles.forEach(circle => {
      // checking if the mouse is near
      const distance = calculateDistance(circle)
      if (
        distance < circleSensitivity &&
        client.x !== null && client.y !== null
      ) {
        const unitVector = calculateUnitVector(circle) // Use this to find the angle it is flying off in
        const magnitude = circleSensitivity - distance
        // console.log(magnitude)
        if (
          !(circle.position.x + (unitVector[0] * (magnitude / circleSpeed)) + circle.radius >= windowWidth) &&
          !(circle.position.x + (unitVector[0] * (magnitude / circleSpeed)) - circle.radius <= 0)
        ) {
          const vector = unitVector[0] * (magnitude / circleSpeed)
          // ISSUE OCURRING BECAUSE THE DISTANCE IS BEING HALVED EACH TIME TO IT NEVER ACTUALLY GETS BEYOND THE DISTANCE
          circle.position.x += vector
        }
        if (
          !(circle.position.y + (unitVector[1] * (magnitude / circleSpeed)) + circle.radius >= windowHeight) &&
          !(circle.position.y + (unitVector[1] * (magnitude / circleSpeed)) - circle.radius <= 0)
        ) {
          const vector = unitVector[1] * (magnitude / circleSpeed)
          // ISSUE OCURRING BECAUSE THE DISTANCE IS BEING HALVED EACH TIME TO IT NEVER ACTUALLY GETS BEYOND THE DISTANCE
          circle.position.y += vector
        }
      } else {
        if (
          !(circle.position.x + circle.direction[0] + circle.radius >= windowWidth) &&
          !(circle.position.x + circle.direction[0] - circle.radius <= 0)
        ) {
          circle.position.x += circle.direction[0]
        } else {
          circle.direction[0] = (parseFloat(Math.random().toFixed(2)) - 0.5) / circleStaticSpeed
        }
        if (
          !(circle.position.y + circle.direction[1] + circle.radius >= windowHeight) &&
          !(circle.position.y + circle.direction[1] - circle.radius <= 0)
        ) {
          circle.position.y += circle.direction[1]
        } else {
          circle.direction[1] = (parseFloat(Math.random().toFixed(2)) - 0.5) / circleStaticSpeed
        }
      }
    })

    drawCircles()
    window.requestAnimationFrame(onTick)
  }

  function clearMovement() {
    client.x = null
    client.y = null
  }

  function mouseMove(event) {
    clearTimeout(movementTimer)
    console.log('here')
    client.x = event.clientX
    client.y = event.clientY
    // To reset ball movement
    movementTimer = setTimeout(clearMovement, 1000)
  }

  function touchMove(event) {
    client.x = event.touches[0].clientX
    client.y = event.touches[0].clientY
  }

  function pageScroll(event) {
    // pageHeader.style.top = `${200 + (window.scrollY / 2)}px`
    pageHeader.style.transform = `translateY(${-window.scrollY / 2}px)`
    // pageHeader.style.transform = `translateY(${Math.floor(window.scrollY / 2)}px)`
    // console.log(window.scrollY)
  }

  function burgerMenuFunction() {
    const burgerLines = burgerMenu.childNodes
    switch (burgerOpen) {
      case true:
        burgerLines[0].classList.remove('burger_line_top_clicked')
        burgerLines[1].classList.remove('burger_line_bot_clicked')
        // burgerMenu
        menuOverlay.classList.remove('menu_overlay_open')
        burgerOpen = false
        break
      case false:
        burgerLines[0].classList.add('burger_line_top_clicked')
        burgerLines[1].classList.add('burger_line_bot_clicked')
        menuOverlay.classList.add('menu_overlay_open')
        burgerOpen = true
        break
    }
  }

  createCircles(numberOfCircles)
  onTick()

  burgerMenu.addEventListener('click', burgerMenuFunction)
  document.addEventListener('touchstart', touchMove)
  document.addEventListener('touchmove', touchMove)
  document.addEventListener('mousemove', mouseMove)
  document.addEventListener('scroll', pageScroll)

}


document.addEventListener('DOMContentLoaded', init)
