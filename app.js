function init() {
  console.log('here')

  const canvas = document.querySelector('#canvas')
  const aboutMe = document.querySelector('#about_me')
  
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  
  canvas.width = windowWidth
  canvas.height = windowHeight
  
  const ctx = canvas.getContext('2d')
  // ctx.translate(0.5, 0.5)

  
  const numberOfCircles = Math.floor(windowWidth / 30)
  const maxRadius = 30
  const minRadius = 3
  const circleSensitivity = 200
  const circleSpeed = 30

  const circleStaticSpeed = 4
  
  const circles = []
  
  const colours = ['#C03221', '#F7F7FF', '#F2D0A4', '#545E75', '#3F826D']
  
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
      // ctx.shadowColor = 'rgba(0, 0, 0, 0.35)'
      // ctx.shadowBlur = 5
      // ctx.shadowOffsetX = 3
      // ctx.shadowOffsetY = 3

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
      if (distance < circleSensitivity) {
        const unitVector = calculateUnitVector(circle) // Use this to find the angle it is flying off in
        const magnitude = circleSensitivity - distance
        // console.log(magnitude)
        if (
          !(circle.position.x + (unitVector[0] * (magnitude / circleSpeed)) + circle.radius >= windowWidth) &&
          !(circle.position.x + (unitVector[0] * (magnitude / circleSpeed)) - circle.radius <= 0)
        ) {
          circle.position.x += (unitVector[0] * (magnitude / circleSpeed))
        }
        if (
          !(circle.position.y + (unitVector[1] * (magnitude / circleSpeed)) + circle.radius >= windowHeight) &&
          !(circle.position.y + (unitVector[1] * (magnitude / circleSpeed)) - circle.radius <= 0)
        ) {
          circle.position.y += (unitVector[1] * (magnitude / circleSpeed))
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
  
  function mouseMove(event) {
    client.x = event.clientX
    client.y = event.clientY

  }

  function mouseScroll(event) {
    if (event.deltaY > 0) {
      aboutMe.scrollIntoView()
    } else {
      console.log('up')
    }
  }
  
  
  createCircles(numberOfCircles)
  onTick()
  
  document.addEventListener('mousemove', mouseMove)
  document.addEventListener('wheel', mouseScroll)
}

document.addEventListener('DOMContentLoaded', init)