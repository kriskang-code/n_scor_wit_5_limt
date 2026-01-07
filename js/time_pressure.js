// js/time_pressure.js
(function () {
  const MOVE_LIMIT_MS = 5000; // 5 seconds
  const TICK_MS = 100;        // update frequency for smooth UI

  let remainingMs = MOVE_LIMIT_MS;
  let timer = null;
  let lastTick = null;
  let enabled = true;
  let isForcing = false;

  function getRandomDirection() {
    // 0 up, 1 right, 2 down, 3 left
    return Math.floor(Math.random() * 4);
  }

  function ensureTimerUI() {
    let el = document.getElementById("timePressureTimer");
    if (el) return el;

    el = document.createElement("div");
    el.id = "timePressureTimer";
    el.style.marginTop = "8px";
    el.style.fontSize = "16px";
    el.style.fontWeight = "600";
    el.textContent = "Next move in: 5.0s";

    const anchor = document.querySelector(".scores-container");
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(el, anchor.nextSibling);
    } else {
      document.body.appendChild(el);
    }
    return el;
  }

  function setUI(ms) {
    const el = ensureTimerUI();
    el.textContent = `Next move in: ${(ms / 1000).toFixed(1)}s`;
  }

  function reset() {
    remainingMs = MOVE_LIMIT_MS;
    lastTick = performance.now();
    setUI(remainingMs);
  }

  function tick(inputManager) {
    if (!enabled) return;

    const now = performance.now();
    const dt = now - (lastTick ?? now);
    lastTick = now;

    remainingMs -= dt;

    if (remainingMs <= 0) {
      // Force a RANDOM move via the game's own event system
      isForcing = true;
      inputManager.emit("move", getRandomDirection());
      isForcing = false;

      reset();
      return;
    }

    setUI(remainingMs);
  }

  // Call this once after you create the game:
  // window.attachTimePressure(game.inputManager)
  window.attachTimePressure = function (inputManager) {
    // Reset countdown whenever the game receives ANY move (player move or forced move)
    // If you want reset ONLY on player moves, keep the isForcing check
    inputManager.on("move", function () {
      if (!isForcing) reset(); // <-- key fix: reset on user move
    });

    inputManager.on("restart", function () {
      reset();
    });

    inputManager.on("keepPlaying", function () {
      reset();
    });

    reset();

    clearInterval(timer);
    timer = setInterval(function () {
      tick(inputManager);
    }, TICK_MS);
  };
})();
