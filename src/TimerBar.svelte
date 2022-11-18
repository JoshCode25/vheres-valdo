<script>
  import { gameTime } from './store.js';

  let { maxTime, remainingTime } = $gameTime;
  let timerId;
  let timerActive = false;
  let timerBarColorList = ['green', 'orange', 'red'];
  let timerBarColor = timerBarColorList[0];

  $: timePercent = Math.floor((remainingTime / maxTime) * 1000) / 10;
  $: if (timePercent < 50 && timerBarColor === timerBarColorList[0]) {
    timerBarColor = timerBarColorList[1];
    console.log(timePercent, timerBarColor);
  } else if (timePercent < 10 && timerBarColor === timerBarColorList[1]) {
    timerBarColor = timerBarColorList[2];
    console.log(timePercent, timerBarColor);
  }
  $: timerBarStyle = `--width: ${timePercent}%; --background-color: ${timerBarColor}`;

  function roundToTenth(number) {
    let multByTen = number * 10;
    let roundedTen = Math.floor(multByTen);
    let roundedToTenth = roundedTen / 10;
    return roundedToTenth;
  }
  function toggleTimer() {
    if (timerActive) {
      stopTimer(timerId);
    } else {
      timerId = setInterval(() => checkTimer(timerId), 100);
    }
  }
  function checkTimer(id) {
    timerActive = true;
    if (remainingTime > 0) {
      remainingTime = roundToTenth(remainingTime - 0.1);
    } else if (remainingTime === 0) {
      stopTimer(id);
    }
  }

  function stopTimer(id) {
    clearInterval(id);
    timerActive = false;
  }
</script>

<div class="timerBarWrapper" style={timerBarStyle}>
  <div class="timerBar" />
</div>

<style>
  .timerBarWrapper {
    --width: 100%;
    --background-color: green;
  }
  .timerBar {
    margin: 5px 0px;
    left: 0;
    height: 20px;
    width: var(--width, 100%);
    background-color: var(--background-color, green);
  }
</style>
