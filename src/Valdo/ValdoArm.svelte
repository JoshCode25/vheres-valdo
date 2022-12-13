<script>
  import { getPointDist, getPointDeltaAngle } from './mathUtilities.js';

  export let shoulderPoint = { x: 10, y: 10 };
  export let handPoint = { x: 15, y: 15 };
  export let headDiameter = 5;
  export let maxArmLength = 3 * headDiameter;
  export let limbThickness = 4;
  export let skinTone = 'black';
  export let fullName = 'Jimberly Hanifred';
  export let armType = 'none';
  export let displayDots = true;

  let elbowDeltas = {};
  let handDeltas = {};

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

    straightLine = false;
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
</script>

<path
  id={`${fullName}${armType}arm`}
  d={armPath}
  stroke={skinTone}
  stroke-width={limbThickness}
/>
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
