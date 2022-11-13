<script>
  export let shoulderPoint = { x: 10, y: 10 };
  export let headDiameter = 5;
  export let maxArmLength = 3 * headDiameter;
  export let handPoint = { x: 15, y: 15 };
  export let elbowPoint = {};
  export let limbThickness = 4;
  export let skinTone = 'black';

  //RIGHT ARM NEEDS TO HAVE MIDPOINT ADDED TO X VALUES
  let straightLine = true;
  let shoulderHandDist = Math.sqrt(
    Math.pow(handPoint.x - shoulderPoint.x, 2) +
      Math.pow(handPoint.y - shoulderPoint.y, 2)
  );
  let shoulderElbowDist = maxArmLength / 2;

  if (shoulderHandDist !== maxArmLength) {
    let deltaX = handPoint.x - shoulderPoint.x;
    let deltaY = handPoint.y - shoulderPoint.y;
    let angleToHoriz = Math.atan(deltaY / deltaX);

    if (shoulderHandDist > maxArmLength) {
      console.log(
        'shoulderhand>maxArm',
        shoulderHandDist,
        maxArmLength,
        handPoint
      );
      handPoint = {
        x: maxArmLength * Math.cos(angleToHoriz),
        y: maxArmLength * Math.sin(angleToHoriz),
      };
      console.log(handPoint);
    } else if (shoulderHandDist < maxArmLength) {
      console.log('shoulderhand<maxArm', shoulderHandDist, maxArmLength);
      let isoscelesAngleInner = Math.acos(
        shoulderHandDist / (2 * shoulderElbowDist)
      );
      let isoscelesAngleToHoriz = angleToHoriz - isoscelesAngleInner;

      straightLine = false;
      elbowPoint = {
        x: shoulderElbowDist * Math.cos(isoscelesAngleToHoriz),
        y: shoulderElbowDist * Math.sin(isoscelesAngleToHoriz),
      };
    }
  }

  console.log(shoulderPoint, elbowPoint, handPoint);
</script>

{#if straightLine}
  <line
    x1={shoulderPoint.x}
    y1={shoulderPoint.y}
    x2={handPoint.x}
    y2={handPoint.y}
    stroke={skinTone}
    stroke-width={limbThickness}
  />
{:else}
  <line
    x1={shoulderPoint.x}
    y1={shoulderPoint.y}
    x2={elbowPoint.x}
    y2={elbowPoint.y}
    stroke={skinTone}
    stroke-width={limbThickness}
  />
  <line
    x1={elbowPoint.x}
    y1={elbowPoint.y}
    x2={handPoint.x}
    y2={handPoint.y}
    stroke={skinTone}
    stroke-width={limbThickness}
  />
{/if}
