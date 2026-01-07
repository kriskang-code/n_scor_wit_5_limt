window.requestAnimationFrame(function () {
  var game = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager)
  window.attachTimePressure(game.inputManager)
})
