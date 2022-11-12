<script>
  export let shoulderPoint = {};
  export let hipPoint = {};
  export let torsoThickness = 4;
  export let skinTone = 'black';
</script>

<line
  x1={shoulderPoint.x}
  y1={shoulderPoint.y}
  x2={hipPoint.x}
  y2={hipPoint.y}
  stroke={skinTone}
  stroke-width={torsoThickness}
/>
