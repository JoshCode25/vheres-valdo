<script>
  export let neckPoint = {};
  export let shoulderPoint = {};
  export let limbThickness = 4;
  export let skinColor = 'black';
</script>

<line
  x1={neckPoint.x}
  y1={neckPoint.y}
  x2={shoulderPoint.x}
  y2={shoulderPoint.y}
  stroke={skinColor}
  stroke-width={limbThickness}
/>
