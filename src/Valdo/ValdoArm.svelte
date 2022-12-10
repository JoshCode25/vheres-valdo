<script>
  import {
    getPointDist,
    getPointDeltaAngle,
    getPointDeltas,
  } from './mathUtilities.js';

  export let shoulderPoint = { x: 10, y: 10 };
  export let handPoint = { x: 15, y: 15 };
  export let headDiameter = 5;
  export let maxArmLength = 3 * headDiameter;
  export let limbThickness = 4;
  export let skinTone = 'black';
  export let fullName = 'Jimberly Hanifred';
  export let armType = 'none';

  let elbowDeltas = {};
  let handDeltas = {};

  //RIGHT ARM NEEDS TO HAVE MIDPOINT ADDED TO X VALUES
  let straightLine = true;
  let shoulderHandDist = getPointDist(shoulderPoint, handPoint);
  let shoulderElbowDist = maxArmLength / 2;
  let { angleToHoriz } = getPointDeltaAngle(shoulderPoint, handPoint);

  if (shoulderHandDist >= maxArmLength) {
    handDeltas = {
      x: maxArmLength * Math.cos(angleToHoriz),
      y: maxArmLength * Math.sin(angleToHoriz),
    };
    elbowDeltas = {
      x: (maxArmLength * Math.cos(angleToHoriz)) / 2,
      y: (maxArmLength * Math.sin(angleToHoriz)) / 2,
    };
    // console.log(handPoint);
  } else if (shoulderHandDist < maxArmLength) {
    // console.log('shoulderhand<maxArm', shoulderHandDist, maxArmLength);
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
  //Need to calculate elbow point from elbow deltas from shoulder point to
  //calculate required deltas to handpoint
  let elbowPoint = 'TBD';

  let elbowHandDeltas = getPointDeltas(elbowPoint, handPoint);
  console.log(`${fullName + armType}:`, shoulderPoint, elbowPoint, handPoint);

  let armPath = `M ${shoulderPoint.x} ${shoulderPoint.y} 
    l ${elbowDeltas.y} ${elbowDeltas.x} 
    l ${elbowHandDeltas.y} ${elbowHandDeltas.x}`;
</script>

<path
  id={`${fullName.replace(' ', '')}${armType}arm`}
  d={armPath}
  stroke={skinTone}
  stroke-width={limbThickness}
/>
