<script>
  import { gameTimer } from './Stores/timerStore.js';
  //NEED TO RESET BAR ON GAME RESTART
  let timerBarColorList = ['green', 'orange', 'red'];
  let timerBarColor = timerBarColorList[0];

  $: if (
    $gameTimer.remainingPercent < 50 &&
    timerBarColor === timerBarColorList[0]
  ) {
    timerBarColor = timerBarColorList[1];
    console.log($gameTimer.remainingPercent, timerBarColor);
  } else if (
    $gameTimer.remainingPercent < 10 &&
    timerBarColor === timerBarColorList[1]
  ) {
    timerBarColor = timerBarColorList[2];
    console.log($gameTimer.remainingPercent, timerBarColor);
  }
  $: timerBarStyle = `--width: ${$gameTimer.remainingPercent}%; --background-color: ${timerBarColor}`;
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
