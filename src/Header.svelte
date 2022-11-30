<script>
  import TimerBar from './TimerBar.svelte';
  import { gameTimer } from './Stores/timerStore.js';
  import { valdoStore } from './Stores/valdoStore';

  export let score = 0;
  export let valdoName = 'Terry';
  export let highScore = 5;

  let timerId;

  function toggleTimer() {
    if (!$valdoStore.activatedGame) {
      valdoStore.startNewGame();
    }
    if ($gameTimer.timerActive) {
      gameTimer.setTimerInactive;
      stopTimer(timerId);
    } else {
      gameTimer.setTimerActive();
      timerId = setInterval(() => checkTimer(timerId), 1000);
    }
  }

  function checkTimer(id) {
    if ($gameTimer.remainingTime > 0) {
      gameTimer.decrement(1);
    } else if ($gameTimer.remainingTime === 0) {
      stopTimer(id);
    }
  }

  function stopTimer(id) {
    clearInterval(id);
    gameTimer.setTimerInactive();
  }
</script>

<header>
  <h3>Current Score: {score}</h3>
  <h4>Current Valdo: {valdoName}</h4>
  <button on:click={toggleTimer}>
    Starting Time: {$gameTimer.initialTime}s
  </button>
  <h3>
    Remaining Time: {$gameTimer.remainingTime}s
    {$gameTimer.remainingPercent}%
  </h3>
  <h3>High Score: {highScore}</h3>
</header>
<TimerBar />

<style>
  header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  header > * {
    margin: 5px;
  }

  h3,
  button {
    flex-grow: 1;
  }

  h4 {
    flex-grow: 3;
  }
</style>
