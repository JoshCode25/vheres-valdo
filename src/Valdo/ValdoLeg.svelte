<script>
  export let hipPoint = {};
  export let footPoint = {};
  export let limbThickness = 4;
  export let headDiameter = 2;
  export let maxLegLength = 3 * headDiameter;
  export let skinTone = 'black';

  if (maxLegLength < 1) {
  }
</script>

<line
  x1={hipPoint.x}
  y1={hipPoint.y}
  x2={footPoint.x}
  y2={footPoint.y}
  stroke={skinTone}
  stroke-width={limbThickness}
/>
