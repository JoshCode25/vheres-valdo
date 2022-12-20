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

  let lastName = fullName.split(' ')[1];

//establish left and right delta placeholders
  let leftKneeDeltas = {};
  let leftKneePoint = {};
  let leftFootDeltas = getPointDeltaAngle(hipPoint, leftFootPoint);
  let rightKneeDeltas = {};
  let rightKneePoint = {};
  let rightFootDeltas = getPointDeltaAngle(hipPoint, rightFootPoint);

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
  leftKneePoint = {
    x: hipPoint.x + leftKneeDeltas.x,
    y: hipPoint.y + leftKneeDeltas.y,
  };
  rightKneePoint = {
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

//define pant path if male or dress path if female
  let leftPantPath = '';
  let rightPantPath = '';
  let dressPath = '';

  //determine pant color based on first letter of last name
  let pantColor = $valdoApparelColorStore.apparelColorList[lastName[0].toLowerCase()];
  let pantLength = '';

  //determine pant length based on length of last name
  if (lastName.length <= $valdoApparelColorStore.apparelLengths[0]) {
    pantLength = 'short';
  } else if (lastName.length >= $valdoApparelColorStore.apparelLengths[1]) {
    pantLength = 'long';
  } else {
    pantLength = 'medium';
  }
  console.log(pantLength)

  if (gender === 'male') {
    let pantLeftKneeDeltas;
    let pantLeftFootDeltas;
    let pantRightKneeDeltas;
    let pantRightFootDeltas;

    if (pantLength === 'long') {
      pantLeftKneeDeltas = leftKneeDeltas;
      pantLeftFootDeltas = {
        x: leftKneeFootDeltas.x * $valdoApparelColorStore.longLength,
        y: leftKneeFootDeltas.y * $valdoApparelColorStore.longLength
      }
      leftPantPath = `M ${hipPoint.x} ${hipPoint.y} 
        l ${pantLeftKneeDeltas.x} ${pantLeftKneeDeltas.y} 
        l ${pantLeftFootDeltas.x} ${pantLeftFootDeltas.y}`;
      
      pantRightKneeDeltas = rightKneeDeltas;
      pantRightFootDeltas = {
        x: rightKneeFootDeltas.x * $valdoApparelColorStore.longLength,
        y: rightKneeFootDeltas.y * $valdoApparelColorStore.longLength
      }
      rightPantPath = `M ${hipPoint.x} ${hipPoint.y} 
        l ${pantRightKneeDeltas.x} ${pantRightKneeDeltas.y} 
        l ${pantRightFootDeltas.x} ${pantRightFootDeltas.y}`;
      
    } else if (pantLength === 'short') {
      pantLeftKneeDeltas = {
        x: leftKneeDeltas.x * $valdoApparelColorStore.shortLength,
        y: leftKneeDeltas.y * $valdoApparelColorStore.shortLength
      }
      leftPantPath = `M ${hipPoint.x} ${hipPoint.y} 
        l ${pantLeftKneeDeltas.x} ${pantLeftKneeDeltas.y}`; 

      pantRightKneeDeltas = {
        x: rightKneeDeltas.x * $valdoApparelColorStore.shortLength,
        y: rightKneeDeltas.y * $valdoApparelColorStore.shortLength
      }
      rightPantPath = `M ${hipPoint.x} ${hipPoint.y} 
        l ${pantRightKneeDeltas.x} ${pantRightKneeDeltas.y}`; 

    } else if (pantLength === 'medium') {
      pantLeftKneeDeltas = leftKneeDeltas
      leftPantPath = `M ${hipPoint.x} ${hipPoint.y} 
        l ${pantLeftKneeDeltas.x} ${pantLeftKneeDeltas.y}`; 

      pantRightKneeDeltas = rightKneeDeltas
      rightPantPath = `M ${hipPoint.x} ${hipPoint.y} 
        l ${pantRightKneeDeltas.x} ${pantRightKneeDeltas.y}`; 
    }
  
  } else if (gender === 'female') {
    let dressLeftKneePoint;
    let dressLeftFootPoint;
    let dressRightKneePoint;
    let dressRightFootPoint;

    if (pantLength === 'long') {
      dressLeftKneePoint = leftKneePoint;
      dressLeftFootPoint = {
        x: dressLeftKneePoint.x + leftKneeFootDeltas.x * $valdoApparelColorStore.longLength,
        y: dressLeftKneePoint.y + leftKneeFootDeltas.y * $valdoApparelColorStore.longLength
      }
      dressRightKneePoint = rightKneePoint;
      dressRightFootPoint = {
        x: dressRightKneePoint.x + rightKneeFootDeltas.x * $valdoApparelColorStore.longLength,
        y: dressRightKneePoint.y + rightKneeFootDeltas.y * $valdoApparelColorStore.longLength
      }

      dressPath = `M ${hipPoint.x} ${hipPoint.y} 
        L ${dressLeftKneePoint.x} ${dressLeftKneePoint.y}
        L ${dressLeftFootPoint.x} ${dressLeftFootPoint.y}
        L ${dressRightFootPoint.x} ${dressRightFootPoint.y}
        L ${dressRightKneePoint.x} ${dressRightKneePoint.y}
        z`;
      
    } else if (pantLength === 'short') {
      dressLeftKneePoint = {
        x: hipPoint.x + leftKneeDeltas.x * $valdoApparelColorStore.shortLength,
        y: hipPoint.y + leftKneeDeltas.y * $valdoApparelColorStore.shortLength
      }

      dressRightKneePoint = {
        x: hipPoint.x + rightKneeDeltas.x * $valdoApparelColorStore.shortLength,
        y: hipPoint.y + rightKneeDeltas.y * $valdoApparelColorStore.shortLength
      }

      dressPath = `M ${hipPoint.x} ${hipPoint.y} 
        L ${dressLeftKneePoint.x} ${dressLeftKneePoint.y}
        L ${dressRightKneePoint.x} ${dressRightKneePoint.y}
        z`;

    } else if (pantLength === 'meduim') {
      dressLeftKneePoint = leftKneePoint;

      dressRightKneePoint = rightKneePoint

      dressPath = `M ${hipPoint.x} ${hipPoint.y} 
        L ${dressLeftKneePoint.x} ${dressLeftKneePoint.y}
        L ${dressRightKneePoint.x} ${dressRightKneePoint.y}
        z`;
      let dressPointArray = [
        dressLeftKneePoint, dressLeftFootPoint,
        dressRightKneePoint, dressRightFootPoint
      ]
      console.log(fullName, pantLength, dressPath);
      console.log(leftPointList, rightPointList);
      console.log(dressPointArray);
    }
  }
  
</script>

<!-- leg paths -->
<path
  class={'line'}
  id={`${fullName}leftleg`}
  d={leftLegPath}
  stroke={skinTone}
  stroke-width={limbThickness}
/>
<path
  class={'line'}
  id={`${fullName}rightleg`}
  d={rightLegPath}
  stroke={skinTone}
  stroke-width={limbThickness}
/>

<!-- pant paths if male -->
{#if gender === 'male'}
  <path
    class={'line'}
    id={`${fullName}leftpant`}
    d={leftPantPath}
    stroke={pantColor}
    stroke-width={$valdoApparelColorStore.apparelThickness*limbThickness}
  />
  <path
    class={'line'}
    id={`${fullName}rightpant`}
    d={rightPantPath}
    stroke={pantColor}
    stroke-width={$valdoApparelColorStore.apparelThickness*limbThickness}
  />
{:else if gender === 'female'}
<!-- dress path if female -->
  <path 
    id={`${fullName}dress`}
    d={dressPath}
    stroke={pantColor}
    fill={pantColor}
    stroke-width={$valdoApparelColorStore.apparelThickness*limbThickness}
  />
{/if}

<!-- dots identifying the input points -->
{#if displayDots}
  {#each leftPointList as point, i (point.x)}
    <circle
      id={pointNames[i] + 'left'}
      cx={point.x}
      cy={point.y}
      r={headDiameter / 4}
    />
  {/each}
    {#each rightPointList as point, i (point.x)}
    <circle
      id={pointNames[i] + 'right'}
      cx={point.x}
      cy={point.y}
      r={headDiameter / 4}
    />
  {/each}
{/if}

<style>
  path.line {
    fill: none;
  }
</style>
