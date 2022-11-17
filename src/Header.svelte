<script>
  export let score = 0;
  export let valdoName = 'Terry';
  export let maxTime = 90;
  export let remainingTime = maxTime;
  export let highScore = 5;

  let timerId;

  function startTimer() {
    timerId = setInterval(checkTimer, 1000);
  }
  function clearTimer() {
    clearInterval(timerId);
  }
  function checkTimer() {
    if (remainingTime > 0) {
      remainingTime = remainingTime - 1;
      console.log(remainingTime);
    } else if (remainingTime === 0) {
      clearTimer();
    }
  }
</script>

<style>
  header {
    display: flex;
    justify-content: space-between;
  }

  h3 {
    flex-grow: 1;
  }

  h4 {
    flex-grow: 3;
  }
</style>

<header>
  <h3>Current Score: {score}</h3>
  <h4>Current Valdo: {valdoName}</h4>
  <h3 on:click={startTimer}>Time Setting: {maxTime}s</h3>
  <h3>High Score: {highScore}</h3>
</header>
<div>Remaining Time: {remainingTime}</div>
