<script>
  import TimerBar from './TimerBar.svelte';
  import { gameTimer } from './Stores/timerStore.js';

  export let score = 0;
  export let valdoName = 'Terry';
  export let highScore = 5;
</script>

<header>
  <h3>Current Score: {score}</h3>
  <h4>Current Valdo: {valdoName}</h4>
  <button>
    Time Setting: {$gameTimer.initialTime}s
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
