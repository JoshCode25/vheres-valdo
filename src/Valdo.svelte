<script>
  import ValdoArm from './ValdoArm.svelte';
  import ValdoHead from './ValdoHead.svelte';
  import ValdoLeg from './ValdoLeg.svelte';
  import ValdoNeck from './ValdoNeck.svelte';
  import ValdoTorso from './ValdoTorso.svelte';

  export let valdoData = {};
  let {
    height = 500,
    width = (height * 5) / 6,
    strokeWidth = 2,
    skinColor = 'black',
    midPoint = { x: width / 2, y: height / 2 },
    headDiameter = height / 7,
    headPoint = { x: midPoint.x, y: strokeWidth + headDiameter / 2 },
    neckPoint = { x: midPoint.x, y: 2 + headDiameter },
    shoulderPoint = { x: midPoint.x, y: 2 + 1.5 * headDiameter },
    hipPoint = { x: midPoint.x, y: 4 * headDiameter },
    rightHandPoint = {
      x: midPoint.x + 2 * headDiameter,
      y: hipPoint.y,
    },
    leftHandPoint = {
      x: midPoint.x - 2 * headDiameter,
      y: hipPoint.y,
    },
    rightFootPoint = { x: midPoint.x + 2 * headDiameter, y: height },
    leftFootPoint = { x: midPoint.x - 2 * headDiameter, y: height },
    limbThickness = height / 50,
    torsoThickness = limbThickness,
    maxArmLength = headDiameter * 3,
    maxLegLength = headDiameter * 3,
  } = valdoData;
</script>

<svg {width} {height}>
  <!-- Head -->
  <ValdoHead {headPoint} {headDiameter} {strokeWidth} {skinColor} />
  <!-- Neck -->
  <ValdoNeck {neckPoint} {shoulderPoint} {limbThickness} {skinColor} />
  <!-- Torso -->
  <ValdoTorso {shoulderPoint} {hipPoint} {torsoThickness} {skinColor} />
  <!-- Right Arm -->
  <ValdoArm
    {shoulderPoint}
    handPoint={rightHandPoint}
    {limbThickness}
    {skinColor}
  />
  <!-- Left Arm -->
  <ValdoArm
    {shoulderPoint}
    handPoint={leftHandPoint}
    {limbThickness}
    {skinColor}
  />
  <!-- Right Leg -->
  <ValdoLeg {hipPoint} footPoint={rightFootPoint} {limbThickness} {skinColor} />
  <!-- Left Leg -->
  <ValdoLeg {hipPoint} footPoint={leftFootPoint} {limbThickness} {skinColor} />
</svg>

<p>Midpoint x = {midPoint.x} y = {midPoint.y}</p>
