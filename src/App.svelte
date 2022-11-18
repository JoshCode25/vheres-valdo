<script>
  import Header from './Header.svelte';
  import Valdo from './Valdo.svelte';
  import ValdoDisplay from './ValdoDisplay.svelte';

  const skinPalette = [
    //from https://huebliss.com/skin-color-code/
    'rgb(141, 85, 36)',
    'rgb(198, 134, 66)',
    'rgb(224, 172, 105)',
    'rgb(241, 194, 125)',
    'rgb(255, 219, 172)',
  ];
  let valdoList = [
    { height: 70, skinTone: skinPalette[0] },
    //  { height: 75, skinTone: skinPalette[1] },
    //  { height: 115, skinTone: skinPalette[2] },
    //  { height: 35, skinTone: skinPalette[3] },
  ];
</script>

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

<Header />
<ValdoDisplay>
  {#each valdoList as valdoData}
    <Valdo {valdoData} />
  {/each}
</ValdoDisplay>
