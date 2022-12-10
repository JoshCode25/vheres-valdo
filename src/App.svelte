<script>
  import Header from './Header.svelte';
  import Valdo from './Valdo/Valdo.svelte';
  import ValdoDisplay from './ValdoDisplay.svelte';
  import { valdoStore } from './Stores/valdoStore.js';
  import { gameTimer } from './Stores/timerStore';

  const displaySVG = false;
  const skinPalette = [
    //from https://huebliss.com/skin-color-code/
    'rgb(141, 85, 36)',
    'rgb(198, 134, 66)',
    'rgb(224, 172, 105)',
    'rgb(241, 194, 125)',
    'rgb(255, 219, 172)',
  ];
  let correctTagReward = 2;
  let incorrectTagPenalty = 5;
  let valdoTagBonus = 5;
  let tagPointReward = 1;

  function handleTag(event) {
    if ($gameTimer.timerActive) {
      if (event.detail.fullName === $valdoStore.activeValdo.fullName) {
        gameTimer.increaseScore(tagPointReward);
        if (/valdo/i.test(event.detail.fullName)) {
          gameTimer.incrementTime(valdoTagBonus);
        } else {
          gameTimer.incrementTime(correctTagReward);
        }
        valdoStore.startNewRound();
      } else {
        gameTimer.decrementTime(incorrectTagPenalty);
      }
    }
  }
</script>

<Header valdoName={$valdoStore.activeValdo.fullName} />
<ValdoDisplay>
  {#each $valdoStore.displayedValdos as valdoData, i (valdoData.firstName)}
    <Valdo
      on:tag={handleTag}
      {valdoData}
      {displaySVG}
      skinTone={skinPalette[i % 5]}
    />
  {/each}
</ValdoDisplay>

<style>
  :global(body) {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    :global(body) {
      max-width: 1000px;
    }
  }
</style>
