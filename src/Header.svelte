<script>
  import TimerBar from './TimerBar.svelte';
  import { gameTimer } from './Stores/timerStore.js';
  import { valdoStore } from './Stores/valdoStore';
  import Valdo from './Valdo/Valdo.svelte';

  export let displaySVG = true;

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
    gameTimer.resetGame();
    valdoStore.finishGame();
    console.log('finished game:', completedGame, $valdoStore, $gameTimer);
  }
  $: console.log($valdoStore.activeValdo);
</script>

<header>
  <div class="gameInfoWrapper">
    <h3>Current Score: {$gameTimer.score}</h3>
    <h3>High Score: {$gameTimer.highScore}</h3>
    <h3>
      Remaining Time: {$gameTimer.remainingTime}s
    </h3>
  </div>
  <div>
    {#if !$valdoStore.activatedGame && !completedGame}
      <button class="hoverPointer" on:click={startTimer}>Click to Start</button>
    {:else if $valdoStore.activatedGame}
      <h2>Current Valdo:</h2>
    {:else if completedGame}
      <button class="hoverPointer" on:click={startTimer}>Play Again?</button>
    {/if}
  </div>
  <div class="currentValdoWrapper">
    {#if $valdoStore.activatedGame}
      {#key $valdoStore.activeValdo}
        <Valdo
          totalHeight={100}
          valdoData={$valdoStore.activeValdo}
          {displaySVG}
          hoverPointer={false}
        />
      {/key}
    {:else}
      <h4>New Valdo Pending...</h4>
    {/if}
  </div>
</header>
<TimerBar />

<style>
  header {
    position: relative;
    display: flex;
    justify-content: left;
    align-items: center;
    height: 120px;
    margin: 0 5px;
  }
  header > div {
    margin-right: 20px;
  }
  h2 {
    font-size: 20px;
  }

  h3 {
    margin: 5px;
  }
  .gameInfoWrapper {
    text-align: left;
  }
  .currentValdoWrapper {
    display: flex;
    flex-flow: row-reverse;
  }

  button.hoverPointer:hover {
    cursor: pointer;
  }
</style>
