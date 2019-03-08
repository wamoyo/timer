!(function () {
  "use strict"
  window.addEventListener('load', function (event) {

    var body = document.getElementById('body')
    var timer = document.getElementById('timer')
    var controls = document.getElementById('controls')
    var startPause = document.getElementById('start-pause')
    var setReset = document.getElementById('set-reset')
    var input = document.getElementById('input')
    var duration = null
    var end = 0
    var running = false


    /*
     * Filter invalid user input
     */

    input.addEventListener('keydown', filterInvalidCharacters, false)

    function filterInvalidCharacters (event) {
      if (!event.key.match(/[0-9]|[:]|(Backspace)|(ArrowRight)|(Tab)|(ArrowLeft)|(Delete)|(PageUp)|(PageDown)|(Home)|(End)/)) {
        event.preventDefault()
      }
    }


    /*
     * User clicks Set/Reset Button
     */

    setReset.addEventListener('click', determineSetReset, false)
    setReset.addEventListener('keydown', determineSetReset, false)

    function determineSetReset (event) {
      if (event.type === 'keydown' && event.key !== 'Enter') return
      if (setReset.textContent == 'Set') setResetValue()
      else if (setReset.textContent == 'Reset') resetTime()
    }

    function resetTime () {
      var seconds = totalSeconds(input.value)
      var timeString = createTimeString(seconds)
      duration = seconds
      timeString.length > 5 ? timer.classList.add('hours') : timer.classList.remove('hours')
      timer.textContent = timeString
      body.classList.remove('end')
    }

    function setResetValue () {
      var seconds = totalSeconds(input.value)
      var timeString = createTimeString(seconds)
      setReset.textContent = 'Reset'
      input.value = timeString
      input.classList.add('set')
      setReset.blur()
      timer.textContent.match(/00\:00\:00/) || timer.textContent.match(/00\:00/) && resetTime() // TODO make this detect if anything other than zeros and colons is in the timer div.
    }

    input.addEventListener('click', changeResetValue, false)
    input.addEventListener('focus', changeResetValue, false)

    function changeResetValue (event) {
      duration = null
      setReset.textContent = 'Set'
      input.classList.remove('set')
      input.value = ''
    }

    function totalSeconds (userInput) {
      var timeBlocks = userInput.split(':').reverse()
      var seconds = timeBlocks[0]
      var minutes = timeBlocks[1] || 0
      var hours = timeBlocks[2] || 0
      return Number(seconds) + 60*Number(minutes) + 3600*Number(hours)
    }

    function createTimeString (seconds) {
      var hours = Math.floor( seconds/3600 )
      var afterHours = seconds - hours*3600
      var minutes = Math.floor( afterHours/60 )
      var seconds = seconds - hours*3600 - minutes*60
      var hourString = hours ? hours + ":" : ''
      var minuteString = minutes ? minutes + ":" : '00:'
      var secondString = seconds ? seconds : '00'
      var leadingMinuteZero = minuteString.toString().length == 2 ? '0' + minuteString : minuteString
      var leadingSecondZero = secondString.toString().length == 1 ? '0' + secondString : secondString
      return hourString + leadingMinuteZero + leadingSecondZero
    }

    /*
     * User Clicks Start
     */

    startPause.addEventListener('click', determineStartPause, false)
    startPause.addEventListener('keydown', determineStartPause, false)

    function determineStartPause (event) {
      if (event.type === 'keydown' && event.key !== 'Enter') return
      if (startPause.textContent == 'Start') startTimer()
      else if (startPause.textContent == 'Pause') pauseTimer()
    }

    function startTimer () {
      running = true
      startPause.textContent = 'Pause'
      end = ( new Date().valueOf() + totalSeconds(timer.textContent)*1000 ) || 0
      updateTime()
    }

    function pauseTimer () {
      running = false
      startPause.textContent = 'Start'
    }

    function updateTime () {
      if (running) {
        var now = new Date().valueOf()
        var remaining = Math.round( (end - now) / 1000 ) // TODO Don't use the view as a store of rounded remaining time.
        var remainingString = createTimeString(remaining)
        timer.textContent != remainingString && (timer.textContent = remainingString)
        timer.textContent.length <= 5 && timer.classList.remove('hours')
        if ( remaining <= 0) endTimer()
        requestAnimationFrame(updateTime)
      }
    }

    function endTimer () {
      running = false
      startPause.textContent = 'Start'
      body.classList.add('end')
    }

  }, false)
}());
