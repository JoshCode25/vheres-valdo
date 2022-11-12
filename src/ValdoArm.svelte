<script>
  export let shoulderPoint = {};
  export let handPoint = {};
  export let limbThickness = 4;
  export let skinColor = 'black';
</script>

<line
  x1={shoulderPoint.x}
  y1={shoulderPoint.y}
  x2={handPoint.x}
  y2={handPoint.y}
  stroke={skinColor}
  stroke-width={limbThickness}
/>
