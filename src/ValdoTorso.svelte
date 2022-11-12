<script>
  export let shoulderPoint = {};
  export let hipPoint = {};
  export let torsoThickness = 4;
  export let skinColor = 'black';
</script>

<line
  x1={shoulderPoint.x}
  y1={shoulderPoint.y}
  x2={hipPoint.x}
  y2={hipPoint.y}
  stroke={skinColor}
  stroke-width={torsoThickness}
/>
