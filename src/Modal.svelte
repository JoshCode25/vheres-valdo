<script>
  import { fly, fade } from 'svelte/transition';

  export let isModalOpen = false;

  function closeModal() {
    isModalOpen = false;
  }
</script>

{#if isModalOpen}
  <div class="modal-wrapper" transition:fly={{ opacity: 0, y: 100 }}>
    <button on:click={closeModal} aria-label="Close Modal Box">Close</button>
    <slot />
  </div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div on:click={closeModal} transition:fade class="background" />
{/if}

<style>
  .modal-wrapper {
    position: fixed;
    inset: 100px 0;
    min-width: 320px;
    max-width: 530px;
    margin: 0 auto;
    width: 100%;
    z-index: 1001;
  }

  .background {
    background: black;
    cursor: pointer;
    inset: 0;
    opacity: 0.9;
    position: fixed;
    z-index: 1000;
  }
</style>
