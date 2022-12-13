<script>
  import Header from './Header.svelte';
  import Valdo from './Valdo/Valdo.svelte';
  import ValdoDisplay from './ValdoDisplay.svelte';
  import { valdoStore } from './Stores/valdoStore.js';
  import { gameTimer } from './Stores/timerStore';
  import Modal from './Modal.svelte';

  const displaySVG = true;

  let correctTagReward = 2;
  let incorrectTagPenalty = 5;
  let valdoTagBonus = 5;
  let tagPointReward = 1;
  let isModalOpen = true;

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

<Modal {isModalOpen}>
  <Valdo valdoData={$valdoStore.displayedValdos[1]} {displaySVG} />
</Modal>

<Header />
<ValdoDisplay>
  {#each $valdoStore.displayedValdos as valdoData (valdoData.firstName)}
    <Valdo on:tag={handleTag} {valdoData} {displaySVG} />
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
