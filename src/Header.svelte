<script>
  import TimerBar from './TimerBar.svelte';

  export let score = 0;
  export let valdoName = 'Terry';
  export let maxTime = 90;
  export let remainingTime = maxTime;
  export let highScore = 5;
</script>

<header>
  <h3>Current Score: {score}</h3>
  <h4>Current Valdo: {valdoName}</h4>
  <button on:click={toggleTimer}>Time Setting: {maxTime}s</button>
  <h3>Remaining Time: {remainingTime} {timePercent}%</h3>
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
