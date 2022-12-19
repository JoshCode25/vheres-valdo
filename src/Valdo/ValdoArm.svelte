<script>
  import { getPointDist, getPointDeltaAngle } from './mathUtilities.js';
  import {valdoApparelColorStore} from '../Stores/valdoApparelStore.js'

  export let shoulderPoint = { x: 10, y: 10 };
  export let handPoint = { x: 15, y: 15 };
  export let headDiameter = 5;
  export let maxArmLength = 3 * headDiameter;
  export let limbThickness = 4;
  export let skinTone = 'black';
  export let fullName = 'Jimberly Hanifred';
  export let armType = 'none';
  export let displayDots = true;

  let troubleshooting = false;
  let firstName = fullName.split(' ')[0];
  let elbowDeltas = {};
  let handDeltas = {};

//determine elbow and hand locations
  let shoulderHandDist = getPointDist(shoulderPoint, handPoint);
  let shoulderElbowDist = maxArmLength / 2;
  let { angleToHoriz } = getPointDeltaAngle(shoulderPoint, handPoint);
  if (armType === 'left') angleToHoriz = angleToHoriz + Math.PI;

  if (shoulderHandDist >= maxArmLength) {
    handDeltas = {
      x: maxArmLength * Math.cos(angleToHoriz),
      y: maxArmLength * Math.sin(angleToHoriz),
    };
    elbowDeltas = {
      x: (maxArmLength * Math.cos(angleToHoriz)) / 2,
      y: (maxArmLength * Math.sin(angleToHoriz)) / 2,
    };
  } else if (shoulderHandDist < maxArmLength) {
    let isoscelesAngleInner = Math.acos(
      shoulderHandDist / (2 * shoulderElbowDist)
    );
    let isoscelesAngleToHoriz = angleToHoriz - isoscelesAngleInner;

    elbowDeltas = {
      x: shoulderElbowDist * Math.cos(isoscelesAngleToHoriz),
      y: shoulderElbowDist * Math.sin(isoscelesAngleToHoriz),
    };
  }

  let elbowPoint = {
    x: shoulderPoint.x + elbowDeltas.x,
    y: shoulderPoint.y + elbowDeltas.y,
  };
  let pointList = [shoulderPoint, elbowPoint, handPoint];
  let pointNames = ['shoulder', 'elbow', 'hand'];
  let elbowHandDeltas = getPointDeltaAngle(elbowPoint, handPoint);

  let armPath = `M ${shoulderPoint.x} ${shoulderPoint.y} 
    l ${elbowDeltas.x} ${elbowDeltas.y} 
    l ${elbowHandDeltas.x} ${elbowHandDeltas.y}`;

  if (troubleshooting) {
    console.log(armType, armPath);
    console.log(angleToHoriz, Math.cos(angleToHoriz), Math.sin(angleToHoriz));
    console.log(
      `${fullName + armType}Points- 
        shoulder: x${shoulderPoint.x} y${shoulderPoint.y} 
        elbow: x${elbowPoint.x} y${elbowPoint.y} 
        hand: x${handPoint.x} y${handPoint.y}`
    );

    console.log(
      `${fullName + armType}Deltas- 
        elbow: x${elbowDeltas.x} y${elbowDeltas.y} 
        hand: x${handDeltas.x} y${handDeltas.y}
        elbowHand: x${elbowHandDeltas.x} y${elbowHandDeltas.y} `
    );
  }

//determine sleeve length and color
  let isSleeve = firstName.length > $valdoApparelColorStore.apparelLengths[0] ? true : false;
  let sleevePath = '';
  //determine sleeve color based on first letter of first name
  let sleeveColor = $valdoApparelColorStore.apparelColorList[firstName[0].toLowerCase()];

  //if there is a sleeve, determine if it's short or long based on first name length
  if (isSleeve) {
    let sleeveLength = firstName.length > $valdoApparelColorStore.apparelLengths[1] ? 'long' : 'short';
    let sleeveElbowDeltas;
    let sleeveHandDeltas;

    if (sleeveLength === 'long') {
      sleeveElbowDeltas = elbowDeltas;
      sleeveHandDeltas = {
        x: elbowHandDeltas.x * $valdoApparelColorStore.longLength,
        y: elbowHandDeltas.y * $valdoApparelColorStore.longLength
      }
      sleevePath = `M ${shoulderPoint.x} ${shoulderPoint.y} 
        l ${sleeveElbowDeltas.x} ${sleeveElbowDeltas.y} 
        l ${sleeveHandDeltas.x} ${sleeveHandDeltas.y}`;

    } else if (sleeveLength === 'short') {
      sleeveElbowDeltas = {
        x: elbowDeltas.x * $valdoApparelColorStore.longLength,
        y: elbowDeltas.y * $valdoApparelColorStore.longLength
      }
      sleevePath = `M ${shoulderPoint.x} ${shoulderPoint.y} 
        l ${sleeveElbowDeltas.x} ${sleeveElbowDeltas.y}`; 
    }
  }

</script>

<path
  id={`${fullName}${armType}arm`}
  d={armPath}
  stroke={skinTone}
  stroke-width={limbThickness}
/>
{#if isSleeve}
  <path 
    id={`${fullName}${armType}sleeve`}
    d={sleevePath}
    stroke={sleeveColor}
    stroke-width={$valdoApparelColorStore.apparelThickness*limbThickness}
  />
{/if}
{#if displayDots}
  {#each pointList as point, i (point.x)}
    <circle
      id={pointNames[i] + armType}
      cx={point.x}
      cy={point.y}
      r={headDiameter / 4}
    />
  {/each}
{/if}

<style>
  path {
    fill: none;
  }
</style>
