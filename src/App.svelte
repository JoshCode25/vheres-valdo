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
    { height: 100, skinTone: skinPalette[0] },
    //  { height: 75, skinTone: skinPalette[1] },
    //  { height: 115, skinTone: skinPalette[2] },
    //  { height: 35, skinTone: skinPalette[3] },
  ];
</script>

<style>
  /* main {
      text-align: center;
      padding: 1em;
      max-width: 240px;
      margin: 0 auto;
   }

   h1 {
      color: #ff3e00;
      text-transform: uppercase;
      font-size: 4em;
      font-weight: 100;
   }

   @media (min-width: 640px) {
      main {
         max-width: none;
      }
   } */
</style>

<Header />
<ValdoDisplay>
  {#each valdoList as valdoData}
    <Valdo {valdoData} />
  {/each}
</ValdoDisplay>
