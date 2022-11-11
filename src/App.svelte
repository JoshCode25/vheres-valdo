<script>
   import Header from "./Header.svelte";
   import Valdo from "./Valdo.svelte";
   import ValdoDisplay from "./ValdoDisplay.svelte";
</script>

<Header />
<ValdoDisplay>
   <Valdo slot="svg-display" />
</ValdoDisplay>

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
