<script>
  import Header from './Header.svelte';
  import Valdo from './Valdo/Valdo.svelte';
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
    { height: 70, nameFirst: 'Jenathon', nameLast: 'Hatmoore' },
    { height: 70, nameFirst: 'Brinkle', nameLast: 'Sinkle' },
    //  { height: 75, skinTone: skinPalette[1] },
    //  { height: 115, skinTone: skinPalette[2] },
    //  { height: 35, skinTone: skinPalette[3] },
  ];
</script>

<Header />
<ValdoDisplay>
  {#each valdoList as valdoData, i}
    <Valdo {valdoData} skinTone={skinPalette[i % 5]} />
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
