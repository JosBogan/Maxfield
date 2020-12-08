function init() {
  console.log('here')

  const canvas = document.querySelector('#canvas')
  const main_section = document.querySelector('#main_section')
  const aboutMe = document.querySelector('#about_me')
  const myWork = document.querySelector('#my_work')
  const contact = document.querySelector('#contact')
  const nextButton = document.querySelector('#next_button')
  const burgerMenu = document.querySelector('#burger_menu')
  const menuOverlay = document.querySelector('#menu_overlay')
  const quickNavLines = document.querySelectorAll('.quick_nav_buttons')
  // const pencil = document.querySelector('#pencil_img')

  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  let scrolling = false
  let previousDelta = 0

  let currentLocation = 0

  const pages = ['', 'about_me', 'my_work', 'contact']

  let burgerOpen = false
  
  canvas.width = windowWidth
  canvas.height = windowHeight

  // const pencilPosition = [0, 0]
  
  const ctx = canvas.getContext('2d')
  // ctx.translate(0.5, 0.5)

  
  const numberOfCircles = Math.floor(windowWidth / 30)
  // const numberOfCircles = 1 // ! FOR TESTING PURPOSES
  const maxRadius = 30
  const minRadius = 3
  const circleSensitivity = 200
  const circleSpeed = 30
  const circleStaticSpeed = 4
  let movementTimer
  
  const circles = []
  
  const colours = ['#C03221', '#88CCF1', '#F2D0A4', '#545E75', '#3F826D']
  
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
      // ! Do the shadows look good?
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
    client.x = event.clientX
    client.y = event.clientY
    movementTimer = setTimeout(clearMovement, 1000)
  }

  function touchMove(event) {
    client.x = event.touches[0].clientX
    client.y = event.touches[0].clientY
  }


  function mouseScroll(event) {
    // console.log(window.navigator)

    // Not a perfect solution
    // console.log(previousDelta, event.deltaY)
    
    if (event.deltaY > 0 && (main_section.scrollTop + windowHeight) >= main_section.scrollHeight ) return
    if (event.deltaY < 0 && main_section.scrollTop <= 0) return

    const direction = Math.sign(event.deltaY)

    switch (direction) {
      case 1:
        if (!scrolling && event.deltaY > previousDelta) {
          scrolling = true
          //! For Safari
          // SmoothVerticalScrolling(aboutMe, 275, 'top')
          //! for Chrome
          main_section.scrollBy(0, windowHeight)
        }
        break
      case -1:
        if (!scrolling && event.deltaY < previousDelta) {
          scrolling = true
          // ! For Safari
          // SmoothVerticalScrolling(aboutMe, 275, 'top')
          // ! For Chrome
          main_section.scrollBy(0, -windowHeight)
        }
    }

    previousDelta = event.deltaY
  
    // if (scrolling) return
    // scrolling = true
    // if (event.deltaY > 0 ) {
    //   main_section.scrollBy(0, windowHeight)
    // } else if (event.deltaY < 0){
    //   main_section.scrollBy(0, -windowHeight)
    // }

    //    previousDelta = event.deltaY
  }

  // ! FOR SAFARI?

  function SmoothVerticalScrolling(e, time, where) {
    var eTop = e.getBoundingClientRect().top
    console.log(eTop)
    var eAmt = eTop / 100
    var curTime = 0
    while (curTime <= time) {
      // console.log(curTime)
      window.setTimeout(SVS_B, curTime, eAmt, where)
      curTime += time / 100
    }
  }

  function SVS_B(eAmt, where) {
    console.log(eAmt, where)
    if (where == 'center' || where == '')
      main_section.scrollBy(0, eAmt / 2)
    if (where == 'top')
      main_section.scrollBy(0, eAmt)
  }

  // ! TESTING OTHER SCROLLING METHODS
  // function help() {
  //  window.open('#about_me')
  //   aboutMe.scrollIntoView()
  // }

  function finishedScrolling(event) {

    if (main_section.scrollTop % windowHeight === 0) {
      scrolling = false
      currentLocation = main_section.scrollTop / windowHeight
      nextButton.href = `#${pages[currentLocation + 1]}`
      quickNavLines.forEach(navLine => {
        navLine.classList.remove('quick_nav_line_long')
      })
      quickNavLines[currentLocation].classList.add('quick_nav_line_long')
    }
  }

  function burgerMenuFunction() {
    const burgerLines = burgerMenu.childNodes
    switch (burgerOpen) {
      case true:
        burgerLines[0].classList.remove('burger_line_top_clicked')
        burgerLines[1].classList.remove('burger_line_bot_clicked')
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
  main_section.addEventListener('scroll', finishedScrolling)
  document.addEventListener('touchstart', touchMove)
  document.addEventListener('touchmove', touchMove)
  document.addEventListener('mousemove', mouseMove)
  document.addEventListener('wheel', mouseScroll)
  // document.addEventListener('keydown', help) // ! Testing other scrolling methods
}

document.addEventListener('DOMContentLoaded', init)