<script>
  export let headPoint = {};
  export let headDiameter = 15;
  export let strokeWidth = 4;
  export let skinTone = 'black';
</script>

<circle
  cx={headPoint.x}
  cy={headPoint.y}
  r={headDiameter / 2}
  stroke={skinTone}
  stroke-width={strokeWidth}
  fill={skinTone}
/>
