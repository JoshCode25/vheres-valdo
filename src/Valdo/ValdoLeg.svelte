<script>
  import { getPointDist, getPointDeltaAngle } from './mathUtilities.js';

  export let hipPoint = { x: 10, y: 10 };
  export let footPoint = { x: 15, y: 15 };
  export let headDiameter = 5;
  export let maxLegLength = 3 * headDiameter;
  export let limbThickness = 4;
  export let skinTone = 'black';
  export let fullName = 'Jimberly Hanifred';
  export let legType = 'none';
  export let displayDots = true;

  let troubleshooting = false;
  let kneeDeltas = {};
  let footDeltas = {};

  let hipFootDist = getPointDist(hipPoint, footPoint);
  let hipKneeDist = maxLegLength / 2;
  let { angleToHoriz } = getPointDeltaAngle(hipPoint, footPoint);
  if (legType === 'left') angleToHoriz = angleToHoriz + Math.PI;

  if (hipFootDist >= maxLegLength) {
    footDeltas = {
      x: maxLegLength * Math.cos(angleToHoriz),
      y: maxLegLength * Math.sin(angleToHoriz),
    };
    kneeDeltas = {
      x: (maxLegLength * Math.cos(angleToHoriz)) / 2,
      y: (maxLegLength * Math.sin(angleToHoriz)) / 2,
    };
  } else if (hipFootDist < maxLegLength) {
    let isoscelesAngleInner = Math.acos(hipFootDist / (2 * hipKneeDist));
    let isoscelesAngleToHoriz = angleToHoriz - isoscelesAngleInner;

    kneeDeltas = {
      x: hipKneeDist * Math.cos(isoscelesAngleToHoriz),
      y: hipKneeDist * Math.sin(isoscelesAngleToHoriz),
    };
  }

  let kneePoint = {
    x: hipPoint.x + kneeDeltas.x,
    y: hipPoint.y + kneeDeltas.y,
  };
  let pointList = [hipPoint, kneePoint, footPoint];
  let pointNames = ['hip', 'knee', 'foot'];
  let kneeFootDeltas = getPointDeltaAngle(kneePoint, footPoint);

  let legPath = `M ${hipPoint.x} ${hipPoint.y} 
  l ${kneeDeltas.x} ${kneeDeltas.y} 
  l ${kneeFootDeltas.x} ${kneeFootDeltas.y}`;

  if (troubleshooting) {
    console.log(legType, legPath);
    console.log(angleToHoriz, Math.cos(angleToHoriz), Math.sin(angleToHoriz));
    console.log(
      `${fullName + legType}Points- 
    hip: x${hipPoint.x} y${hipPoint.y} 
    knee: x${kneePoint.x} y${kneePoint.y} 
    foot: x${footPoint.x} y${footPoint.y}`
    );

    console.log(
      `${fullName + legType}Deltas- 
    knee: x${kneeDeltas.x} y${kneeDeltas.y} 
    foot: x${footDeltas.x} y${footDeltas.y}
    kneefoot: x${kneeFootDeltas.x} y${kneeFootDeltas.y} `
    );
  }
</script>

<path
  id={`${fullName}${legType}arm`}
  d={legPath}
  stroke={skinTone}
  stroke-width={limbThickness}
/>
{#if displayDots}
  {#each pointList as point, i (point.x)}
    <circle
      id={pointNames[i] + legType}
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
