<script>
  import ValdoArm from './ValdoArm.svelte';
  import ValdoHead from './ValdoHead.svelte';
  import ValdoLeg from './ValdoLeg.svelte';
  import ValdoNeck from './ValdoNeck.svelte';
  import ValdoTorso from './ValdoTorso.svelte';

  export let height = 500;
  export let width = (height * 5) / 6;

  let midPoint = { x: width / 2, y: height / 2 };
  let headDiameter = height / 7;
  let strokeWidth = 2;
  let limbThickness = 6;
  let skinColor = 'black';
  let torsoThickness = limbThickness;
  let maxArmLength = headDiameter * 3;
  let maxLegLength = headDiameter * 3;
  let headPoint = { x: midPoint.x, y: strokeWidth + headDiameter / 2 };
  let neckPoint = { x: midPoint.x, y: 2 + headDiameter };
  let shoulderPoint = { x: midPoint.x, y: 2 + 1.5 * headDiameter };
  let hipPoint = { x: midPoint.x, y: 4 * headDiameter };
  let rightHandPoint = { x: midPoint.x + 2 * headDiameter, y: hipPoint.y };
  let leftHandPoint = { x: midPoint.x - 2 * headDiameter, y: hipPoint.y };
  let rightFootPoint = { x: midPoint.x + 2 * headDiameter, y: height };
  let leftFootPoint = { x: midPoint.x - 2 * headDiameter, y: height };
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
