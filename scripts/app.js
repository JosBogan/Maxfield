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
  const nameTag = document.querySelector('#name_tag')


  const sectionImages = document.querySelectorAll('.section_image')
  const sectionImageContainers = document.querySelectorAll('.section_image_container')
  const sectionTitles = document.querySelectorAll('.section_title')
  const sectionTitleContainers = document.querySelectorAll('.section_title_container')
  const sectionTitleMovementControlContainter = document.querySelectorAll('.section_title_movement_control_containter')
  // const pencil = document.querySelector('#pencil_img')

  let windowWidth = window.innerWidth
  let windowHeight = window.innerHeight

  document.documentElement.style.setProperty('--vh', `${windowHeight * 0.01}px`)
  document.documentElement.style.setProperty('--vw', `${windowWidth * 0.01}px`)

  const queryString = location.search.substring(1)

  let scrolling = false
  let previousDelta = 0

  let currentLocation = 0

  let lastTouch
  let touchScrollTimer

  let wasTouchMove = false

  // const pages = ['title_section', 'about_me', 'my_work', 'contact']

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
  
  // const colours = ['#C03221', '#88CCF1', '#F2D0A4', '#545E75', '#3F826D']
  const colours = ['#AA7DCE', '#8663a3', 'c28fec'] 
  
  const client = {
    x: null,
    y: null
  }

  const paralaxClient1 = {
    x: null,
    y: null
  }

  const paralaxClient2 = {
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
    wasTouchMove = false
    clearTimeout(movementTimer)
    client.x = event.clientX
    client.y = event.clientY
    // To reset ball movement
    movementTimer = setTimeout(clearMovement, 1000)

    // Paralax Setup
    paralaxClient1.x = 0 - ((event.clientX - (windowWidth / 2)) / 50)
    paralaxClient1.y = 0 - ((event.clientY - (windowHeight / 2)) / 50)
    paralaxClient2.x = 0 - ((event.clientX - (windowWidth / 2)) / 10)
    paralaxClient2.y = 0 - ((event.clientY - (windowHeight / 2)) / 10)
    // console.log(paralaxClient)
    // ! 3D Rotation
    // nameTag.style.transform = `rotateY(${paralaxClient.x}deg) rotateZ(${paralaxClient.y}deg)`
    // ! 2D Transform
    // ! content moving

    if (wasTouchMove) return

    sectionImages.forEach(image => {
      // console.log('doing this?')
      image.style.transform = `translate(${paralaxClient1.x}px, ${paralaxClient1.y}px)`
    })
    // sectionImages[currentLocation - 1].style.transform = `translate(${paralaxClient1.x}px, ${paralaxClient1.y}px)`
    sectionTitleMovementControlContainter.forEach(title => {
      title.style.transform = `translate(${paralaxClient2.x}px, ${paralaxClient2.y}px)`
    })
    // sectionTitleMovementControlContainter[currentLocation - 1].style.transform = `translate(${paralaxClient2.x}px, ${paralaxClient2.y}px)`
  }

  function touchMove(event) {
    wasTouchMove = true
    if (event.touches.length > 1) {
      client.x = event.touches[0].clientX
      client.y = event.touches[0].clientY
    } else {
      if (event.type === 'touchmove') {
        console.log('movin')
        // touchScrolling = true
        clearTimeout(touchScrollTimer)
        if (!lastTouch) lastTouch = event.touches[0].clientY
        else touchScroll(lastTouch - event.touches[0].clientY)
        touchScrollTimer = setTimeout(() => lastTouch = null, 500)
      }
    }
  }

  function setAnimation(index) {
    resetAnimations()
    console.log(index)
    if (index >= 0) sectionImageContainers[index].classList.add('animation_rightside')
    if (index >= 0) sectionTitleContainers[index].classList.add('animation_leftside')
  }


  function resetAnimations() {
    sectionImageContainers.forEach(image => {
      image.classList.remove('animation_rightside')
    })
    sectionTitleContainers.forEach(title => {
      title.classList.remove('animation_leftside')
    })
  }

  function touchScroll(directionRaw) {

    console.log(directionRaw)
    
    if (directionRaw > 0 && (main_section.scrollTop + windowHeight) >= main_section.scrollHeight ) return
    if (directionRaw < 0 && main_section.scrollTop <= 0) return

    
    const direction = Math.sign(directionRaw)
    
    let isSafari = navigator.userAgent.indexOf('Safari') > -1
    const isChrome = navigator.userAgent.indexOf('Chrome') > -1
    if ((isChrome) && (isSafari)) isSafari = false
    
    console.log('second stage')
    switch (direction) {
      case 1:
        if (!scrolling) {
          scrolling = true
          //! For Safari vs Chrome
          if (isSafari) {
            SmoothVerticalScrolling(400, 'down')
          } else {
            main_section.scrollBy(0, windowHeight)
          }
          // ANIMATION DOES NOT OCCUR WHEN YOU CLICK THE DOWN ARROW
          setAnimation(currentLocation)
        }
        break
      case -1:
        if (!scrolling) {
          scrolling = true
          // ! For Safari vs Chrome
          if (isSafari) {
            SmoothVerticalScrolling(400, 'up')
          } else {
            console.log('Getting through')
            main_section.scrollBy(0, -windowHeight)
          }
          // ANIMATION DOES NOT OCCUR WHEN YOU CLICK THE DOWN ARROW
          setAnimation(currentLocation - 2)

        }
    }

  }

  function mouseScroll(event) {
    
    if (event.deltaY > 0 && (main_section.scrollTop + windowHeight) >= main_section.scrollHeight ) return
    if (event.deltaY < 0 && main_section.scrollTop <= 0) return
    
    const direction = Math.sign(event.deltaY)
    
    // ! Browswer check
    let isSafari = navigator.userAgent.indexOf('Safari') > -1
    const isChrome = navigator.userAgent.indexOf('Chrome') > -1
    if ((isChrome) && (isSafari)) isSafari = false
    
    // console.log(event.deltaY)

    switch (direction) {
      case 1:
        if (!scrolling && event.deltaY > previousDelta) {
          scrolling = true
          //! For Safari vs Chrome
          if (isSafari) {
            SmoothVerticalScrolling(400, 'down')
          } else {
            main_section.scrollBy(0, windowHeight)
          }
          // ANIMATION DOES NOT OCCUR WHEN YOU CLICK THE DOWN ARROW
          setAnimation(currentLocation)
        }
        break
      case -1:
        if (!scrolling && event.deltaY < previousDelta) {
          scrolling = true
          // ! For Safari vs Chrome
          if (isSafari) {
            SmoothVerticalScrolling(400, 'up')
          } else {
            console.log('Getting through')
            main_section.scrollBy(0, -windowHeight)
          }
          // ANIMATION DOES NOT OCCUR WHEN YOU CLICK THE DOWN ARROW
          setAnimation(currentLocation - 2)

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

  function autoScroll(sectionId) {
    // ! Browswer check
    let isSafari = navigator.userAgent.indexOf('Safari') > -1
    const isChrome = navigator.userAgent.indexOf('Chrome') > -1
    if ((isChrome) && (isSafari)) isSafari = false

    main_section.scrollTo(0, windowHeight * parseInt(sectionId))
    setAnimation(parseInt(sectionId) - 1)

    const locationDifference = currentLocation - parseInt(sectionId)

    if (isSafari) {
      console.log('is safari')
      if (Math.sign(locationDifference) === -1) {
        SmoothVerticalScrolling(400, 'down', Math.abs(locationDifference))
      } else if (Math.sign(locationDifference) === 1) {
        SmoothVerticalScrolling(400, 'up', Math.abs(locationDifference))
      }
    } else {
      main_section.scrollTo(0, windowHeight * parseInt(sectionId))
    }
    setAnimation(parseInt(sectionId) - 1)
  }

  // ! FOR SAFARI?

  function SmoothVerticalScrolling(time, d, multiplier = 1) {
    const totalScrollDistance = windowHeight * multiplier
    const distancePerLoop = totalScrollDistance / 100
    let currentTime = 0
    let loop = 1
    while (currentTime < time) {
      setTimeout(SVS_B, currentTime, distancePerLoop, loop, d)
      currentTime += time / 100
      loop++
    }
  }

  function SVS_B(distancePerLoop, loop, d) {

    // ! CANT USE SCROLLBY HERE BECAUSE IT DOESNT TAKE FLOATING POINTS SO THERE IS A MAJOR OFFSET!
    if (d === 'down') {
      main_section.scrollTop = (currentLocation * windowHeight) + distancePerLoop * loop
    } else {
      main_section.scrollTop = (currentLocation * windowHeight) - distancePerLoop * loop
    }
  }



  // ! TESTING OTHER SCROLLING METHODS
  // function help() {
  //  window.open('#about_me')
  //   aboutMe.scrollIntoView()
  // }

  function finishedScrolling(event) {

    // console.log('scrolling')
    if (main_section.scrollTop % windowHeight === 0) {
      // console.log('finished scrolling')
      scrolling = false
      currentLocation = main_section.scrollTop / windowHeight
      // nextButton.href = `#${pages[currentLocation + 1]}`
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

  function navClickedScroll(event) {
    autoScroll(event.target.dataset.id)
    // console.log(event.target.dataset.id)
  }
  
  
  createCircles(numberOfCircles)
  onTick()

  if (queryString === 'contact') {
    autoScroll(3)
  }


  window.addEventListener('resize', () => {
    windowWidth = window.innerWidth
    windowHeight = window.innerHeight
  
    document.documentElement.style.setProperty('--vh', `${windowHeight * 0.01}px`)
    document.documentElement.style.setProperty('--vw', `${windowWidth * 0.01}px`)
  })
  quickNavLines.forEach(link => {
    link.addEventListener('click', navClickedScroll)
  })
  burgerMenu.addEventListener('click', burgerMenuFunction)
  main_section.addEventListener('scroll', finishedScrolling)
  document.addEventListener('touchstart', touchMove)
  document.addEventListener('touchmove', touchMove)
  document.addEventListener('mousemove', mouseMove)
  document.addEventListener('wheel', mouseScroll)
  // ! NEED TO ADD BUTTON PRESSES FOR SMOOTH SCROLLING ON SAFARI
  // document.addEventListener('keydown', help) // ! Testing other scrolling methods
}

document.addEventListener('DOMContentLoaded', init)