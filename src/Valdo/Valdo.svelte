<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  import ValdoArm from './ValdoArm.svelte';
  import ValdoHead from './ValdoHead.svelte';
  import ValdoLeg from './ValdoLeg.svelte';
  import ValdoNeck from './ValdoNeck.svelte';
  import ValdoTorso from './ValdoTorso.svelte';

  export let valdoData = {};
  export let displaySVG = true;
  export let totalHeight = 100;
  export let hoverPointer = true;
  export let showFullName = false;
  export let displayDots = true;

  let {
    firstName = 'Jeshua',
    lastName = 'Granstand',
    fullName = `${firstName} ${lastName}`,
    skinTone = 'black',
    greeting = 'hello',
    correctResponse = 'yes',
    incorrectResponse = 'no',
    height = totalHeight * 0.95,
    width = (height * 5) / 6,
    strokeWidth = 2,
    midPoint = { x: width / 2, y: height / 2 },
    headDiameter = height / 7,
    headPoint = { x: midPoint.x, y: strokeWidth + headDiameter / 2 },
    neckPoint = { x: midPoint.x, y: 2 + headDiameter },
    shoulderPoint = { x: midPoint.x, y: 2 + 1.5 * headDiameter },
    hipPoint = { x: midPoint.x, y: 4 * headDiameter },
    rightHandPoint = {
      x: midPoint.x + 2 * headDiameter,
      y: hipPoint.y * 0.75,
    },
    leftHandPoint = {
      x: midPoint.x - 2 * headDiameter,
      y: headPoint.y,
    },
    rightFootPoint = { x: midPoint.x + 2 * headDiameter, y: hipPoint.y * 1.25 },
    leftFootPoint = { x: midPoint.x - 2 * headDiameter, y: height },
    limbThickness = height / 50,
    torsoThickness = limbThickness,
  } = valdoData;

  const dispatch = createEventDispatcher();

  function handleclick() {
    dispatch('tag', {
      fullName: fullName,
      greeting: greeting,
      correctResponse: correctResponse,
      incorrectResponse: incorrectResponse,
    });
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class:hoverPointer on:click={handleclick} transition:fade>
  {#if displaySVG}
    <svg {width} height={totalHeight}>
      <!-- Head -->
      <ValdoHead {headPoint} {headDiameter} {strokeWidth} {skinTone} />
      <!-- Neck -->
      <ValdoNeck {neckPoint} {shoulderPoint} {limbThickness} {skinTone} />
      <!-- Torso -->
      <ValdoTorso {shoulderPoint} {hipPoint} {torsoThickness} {skinTone} {fullName}/>
      <!-- Right Arm -->
      <ValdoArm
        {displayDots}
        {fullName}
        armType={'right'}
        {shoulderPoint}
        {headDiameter}
        handPoint={rightHandPoint}
        {limbThickness}
        {skinTone}
      />
      <!-- Left Arm -->
      <ValdoArm
        {displayDots}
        {fullName}
        armType={'left'}
        {shoulderPoint}
        {headDiameter}
        handPoint={leftHandPoint}
        {limbThickness}
        {skinTone}
      />
      <!-- Right Leg -->
      <ValdoLeg
        {displayDots}
        {fullName}
        legType={'right'}
        {hipPoint}
        {headDiameter}
        footPoint={rightFootPoint}
        {limbThickness}
        {skinTone}
      />
      <!-- Left Leg -->
      <ValdoLeg
        {displayDots}
        {fullName}
        legType={'left'}
        {hipPoint}
        {headDiameter}
        footPoint={leftFootPoint}
        {limbThickness}
        {skinTone}
      />
    </svg>
    {#if showFullName}
      <p>{fullName}</p>
    {/if}
  {:else}
    <h3>{fullName}</h3>
  {/if}
</div>

<style>
  h3 {
    margin: 5px;
    border: 2px solid black;
  }
  div {
    background-color: white;
  }

  p {
    margin: 2px 0px;
  }

  div.hoverPointer:hover {
    cursor: pointer;
  }
</style>
