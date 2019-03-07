!(function () {
  "use strict"
  window.addEventListener('load', function (event) {

    var timer = document.getElementById('timer')
    var controls = document.getElementById('controls')
    var startPause = document.getElementById('start-pause')
    var setReset = document.getElementById('set-reset')
    var input = document.getElementById('input')
    var duration = 180


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
     * User sets new time
     */

    setReset.addEventListener('click', function (event) {
      var seconds = totalSeconds(input.value)
      var timeString = createTimeString(seconds)
      duration = seconds
      setReset.textContent = 'Reset'
      // TODO pick up here.
      // Input has to look closed
      // When use changes input again, the Reset turns back into set
    }, false)

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


    //User Clicks Set
    //User Clicks Start after Set
    //User Clicks Start before Set
    //User Clicks Reset while Timer is Running
    //User Clicks Reset while Timer is Paused
    //User Sets new characters while Timer is running
    //User Clicks Pause while Timer is Running
    //User Clicks Start while Timer is Paused


  }, false)
}());
