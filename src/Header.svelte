<script>
  import TimerBar from './TimerBar.svelte';
  import { gameTimer } from './Stores/timerStore.js';
  import { valdoStore } from './Stores/valdoStore';

  export let valdoName = 'Terry';

  let timerId;
  let completedGame = false;

  function startTimer() {
    if (!$valdoStore.activatedGame) {
      valdoStore.startNewGame();
    }
    gameTimer.setTimerActive();
    timerId = setInterval(() => checkTimer(timerId), 1000);
    console.log($gameTimer);
  }

  function checkTimer(id) {
    if ($gameTimer.remainingTime > 0) {
      gameTimer.decrementTime(1);
    } else if ($gameTimer.remainingTime <= 0) {
      console.log('finished game:', completedGame, $valdoStore, $gameTimer);
      stopTimer(id);
    }
  }

  function stopTimer(id) {
    clearInterval(id);
    gameTimer.setTimerInactive();
    if ($gameTimer.score > $gameTimer.highScore) {
      gameTimer.setHighscore($gameTimer.score);
    }
    completedGame = true;
    gameTimer.resetTime();
    valdoStore.finishGame();
    console.log('finished game:', completedGame, $valdoStore, $gameTimer);
  }
</script>

<header>
  <h3>Current Score: {$gameTimer.score}</h3>
  <h4>Current Valdo: {valdoName}</h4>
  {#if !$valdoStore.activatedGame && !completedGame}
    <button class="hoverPointer" on:click={startTimer}>Click to Start</button>
  {:else if $valdoStore.activatedGame}
    <button>Good Luck!</button>
  {:else if completedGame}
    <button class="hoverPointer" on:click={startTimer}>Play Again?</button>
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

  button.hoverPointer:hover {
    cursor: pointer;
  }

  h4 {
    flex-grow: 3;
  }
</style>
