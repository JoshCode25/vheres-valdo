<script>
  import ValdoArm from './ValdoArm.svelte';
  import ValdoHead from './ValdoHead.svelte';
  import ValdoLeg from './ValdoLeg.svelte';
  import ValdoNeck from './ValdoNeck.svelte';
  import ValdoTorso from './ValdoTorso.svelte';

  export let valdoData = {};
  let {
    nameFirst = 'Jeshua',
    nameLast = 'Granstand',
    height = 250,
    width = (height * 5) / 6,
    strokeWidth = 2,
    skinTone = 'black',
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
  <ValdoHead {headPoint} {headDiameter} {strokeWidth} {skinTone} />
  <!-- Neck -->
  <ValdoNeck {neckPoint} {shoulderPoint} {limbThickness} {skinTone} />
  <!-- Torso -->
  <ValdoTorso {shoulderPoint} {hipPoint} {torsoThickness} {skinTone} />
  <!-- Right Arm -->
  <ValdoArm
    {shoulderPoint}
    handPoint={rightHandPoint}
    {limbThickness}
    {skinTone}
  />
  <!-- Left Arm -->
  <ValdoArm
    {shoulderPoint}
    handPoint={leftHandPoint}
    {limbThickness}
    {skinTone}
  />
  <!-- Right Leg -->
  <ValdoLeg {hipPoint} footPoint={rightFootPoint} {limbThickness} {skinTone} />
  <!-- Left Leg -->
  <ValdoLeg {hipPoint} footPoint={leftFootPoint} {limbThickness} {skinTone} />
</svg>

<p>
  Midpoint x = {Math.round(midPoint.x * 1000) / 1000} y = {Math.round(
    midPoint.y * 1000
  ) / 1000}
</p>
