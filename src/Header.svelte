<script>
  import TimerBar from './TimerBar.svelte';
  import { gameTimer } from './Stores/timerStore.js';
  import { valdoStore } from './Stores/valdoStore';

  export let valdoName = 'Terry';

  let timerId;
  let completedGame = false;

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
      gameTimer.decrementTime(1);
    } else if ($gameTimer.remainingTime === 0) {
      stopTimer(id);
    }
  }

  function stopTimer(id) {
    clearInterval(id);
    gameTimer.setTimerInactive();
    if ($gameTimer.score > $gameTimer.highScore) {
      gameTimer.setHighscore($gameTimer.score);
    }
    valdoStore.finishRound();
  }
</script>

<header>
  <h3>Current Score: {$gameTimer.score}</h3>
  <h4>Current Valdo: {valdoName}</h4>
  {#if !completedGame}
    <button on:click={toggleTimer}>Click to Start</button>
  {:else if completedGame}
    <button on:click={toggleTimer}>Play Again?</button>
  {/if}
  <h3>
    Remaining Time: {$gameTimer.remainingTime}s
  </h3>
  <h3>High Score: {$gameTimer.highScore}</h3>
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

  button:hover {
    cursor: pointer;
  }

  h4 {
    flex-grow: 3;
  }
</style>
