<script>
  import { gameTimer } from './Stores/timerStore.js';
  //NEED TO RESET BAR ON GAME RESTART
  let timerBarColorList = ['green', 'orange', 'red'];
  let timerBarColor = timerBarColorList[0];
  let greenPercentage = 50;
  let orangePercentage = 10;

  $: if (
    $gameTimer.remainingPercent >= greenPercentage &&
    timerBarColor !== timerBarColorList[0]
  ) {
    timerBarColor = timerBarColorList[0];
  } else if (
    $gameTimer.remainingPercent < greenPercentage &&
    timerBarColor !== timerBarColorList[1]
  ) {
    timerBarColor = timerBarColorList[1];
  } else if (
    $gameTimer.remainingPercent < orangePercentage &&
    timerBarColor !== timerBarColorList[2]
  ) {
    timerBarColor = timerBarColorList[2];
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
