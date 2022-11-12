<script>
  export let hipPoint = {};
  export let footPoint = {};
  export let limbThickness = 4;
  export let skinTone = 'black';
</script>

<line
  x1={hipPoint.x}
  y1={hipPoint.y}
  x2={footPoint.x}
  y2={footPoint.y}
  stroke={skinTone}
  stroke-width={limbThickness}
/>
