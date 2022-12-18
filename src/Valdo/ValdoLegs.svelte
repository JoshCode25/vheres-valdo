<script>
  import { getPointDist, getPointDeltaAngle } from './mathUtilities.js';
  import {valdoApparelColorStore} from '../Stores/valdoApparelStore.js'

  export let hipPoint = { x: 10, y: 10 };
  export let leftFootPoint = { x: 15, y: 15 };
  export let rightFootPoint = { x: 15, y: 15 };
  export let headDiameter = 5;
  export let maxLegLength = 3 * headDiameter;
  export let limbThickness = 4;
  export let skinTone = 'black';
  export let fullName = 'Jimberly Hanifred';
  export let displayDots = true;
  export let gender = 'none';

  let troubleshooting = false;
  let lastName = fullName.split(' ')[1];

//establish left and right deltas
  let leftKneeDeltas = {};
  let leftFootDeltas = {};
  let rightKneeDeltas = {};
  let rightFootDeltas = {};

//establish left and right hip and foot distances
  let leftHipFootDist = getPointDist(hipPoint, leftFootPoint);
  let leftHipKneeDist = maxLegLength / 2;
  let { angleToHoriz: leftAngleToHoriz } = getPointDeltaAngle(hipPoint, leftFootPoint);
  leftAngleToHoriz = leftAngleToHoriz + Math.PI;

  let rightHipFootDist = getPointDist(hipPoint, rightFootPoint);
  let rightHipKneeDist = maxLegLength / 2;
  let { angleToHoriz: rightAngleToHoriz } = getPointDeltaAngle(hipPoint, rightFootPoint);

//adjust left and right foot position to not exceed max leg length
  if (leftHipFootDist >= maxLegLength) {
    leftFootDeltas = {
      x: maxLegLength * Math.cos(leftAngleToHoriz),
      y: maxLegLength * Math.sin(leftAngleToHoriz),
    };
    leftKneeDeltas = {
      x: (maxLegLength * Math.cos(leftAngleToHoriz)) / 2,
      y: (maxLegLength * Math.sin(leftAngleToHoriz)) / 2,
    };
  } else if (leftHipFootDist < maxLegLength) {
    let leftIsoscelesAngleInner = Math.acos(leftHipFootDist / (2 * leftHipKneeDist));
    let leftIsoscelesAngleToHoriz = leftAngleToHoriz - leftIsoscelesAngleInner;

    leftKneeDeltas = {
      x: leftHipKneeDist * Math.cos(leftIsoscelesAngleToHoriz),
      y: leftHipKneeDist * Math.sin(leftIsoscelesAngleToHoriz),
    };
  }

  if (rightHipFootDist >= maxLegLength) {
    rightFootDeltas = {
      x: maxLegLength * Math.cos(rightAngleToHoriz),
      y: maxLegLength * Math.sin(rightAngleToHoriz),
    };
    rightKneeDeltas = {
      x: (maxLegLength * Math.cos(rightAngleToHoriz)) / 2,
      y: (maxLegLength * Math.sin(rightAngleToHoriz)) / 2,
    };
  } else if (rightHipFootDist < maxLegLength) {
    let rightIsoscelesAngleInner = Math.acos(rightHipFootDist / (2 * rightHipKneeDist));
    let rightIsoscelesAngleToHoriz = rightAngleToHoriz - rightIsoscelesAngleInner;

    rightKneeDeltas = {
      x: rightHipKneeDist * Math.cos(rightIsoscelesAngleToHoriz),
      y: rightHipKneeDist * Math.sin(rightIsoscelesAngleToHoriz),
    };
  }

//establish adjusted left and right knee points
  let leftKneePoint = {
    x: hipPoint.x + leftKneeDeltas.x,
    y: hipPoint.y + leftKneeDeltas.y,
  };
  let rightKneePoint = {
    x: hipPoint.x + rightKneeDeltas.x,
    y: hipPoint.y + rightKneeDeltas.y,
  };

//establish left and right dot points
  let pointNames = ['hip', 'knee', 'foot'];
  let leftPointList = [hipPoint, leftKneePoint, leftFootPoint];
  let leftKneeFootDeltas = getPointDeltaAngle(leftKneePoint, leftFootPoint);
  let rightPointList = [hipPoint, rightKneePoint, rightFootPoint];
  let rightKneeFootDeltas = getPointDeltaAngle(rightKneePoint, rightFootPoint);

//establish left and right leg paths
  let leftLegPath = `M ${hipPoint.x} ${hipPoint.y} 
    l ${leftKneeDeltas.x} ${leftKneeDeltas.y} 
    l ${leftKneeFootDeltas.x} ${leftKneeFootDeltas.y}`;
  let rightLegPath = `M ${hipPoint.x} ${hipPoint.y} 
    l ${rightKneeDeltas.x} ${rightKneeDeltas.y} 
    l ${rightKneeFootDeltas.x} ${rightKneeFootDeltas.y}`;

//define pant path if male
  let pantPath = '';
  if (gender === 'male') {

  }
  //determine sleeve length and color
  let isPant = lastName.length > $valdoApparelColorStore.apparelLengths[0] ? true : false;

  //determine sleeve color based on first letter of first name
  let pantColor = $valdoApparelColorStore.apparelColorList[lastName[0].toLowerCase()];

  //if there is a sleeve, determine if it's short or long based on first name length
  if (isPant) {
    let pantLength = lastName.length > $valdoApparelColorStore.apparelLengths[1] ? 'long' : 'short';
    let pantleftKneeDeltas;
    let pantleftFootDeltas;

    if (pantLength === 'long') {
      pantleftKneeDeltas = leftKneeDeltas;
      pantleftFootDeltas = {
        x: leftKneeFootDeltas.x * $valdoApparelColorStore.sleevePantLength,
        y: leftKneeFootDeltas.y * $valdoApparelColorStore.sleevePantLength
      }
      pantPath = `M ${hipPoint.x} ${hipPoint.y} 
        l ${pantleftKneeDeltas.x} ${pantleftKneeDeltas.y} 
        l ${pantleftFootDeltas.x} ${pantleftFootDeltas.y}`;

    } else if (pantLength === 'short') {
      pantleftKneeDeltas = {
        x: leftKneeDeltas.x * $valdoApparelColorStore.sleevePantLength,
        y: leftKneeDeltas.y * $valdoApparelColorStore.sleevePantLength
      }
      pantPath = `M ${hipPoint.x} ${hipPoint.y} 
        l ${pantleftKneeDeltas.x} ${pantleftKneeDeltas.y}`; 
    }
  }
</script>

<path
  id={`${fullName}${legType}arm`}
  d={legPath}
  stroke={skinTone}
  stroke-width={limbThickness}
/>
{#if isPant}
  <path 
    id={`${fullName}${legType}pant`}
    d={pantPath}
    stroke={pantColor}
    stroke-width={$valdoApparelColorStore.apparelThickness*limbThickness}
  />
{/if}
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
