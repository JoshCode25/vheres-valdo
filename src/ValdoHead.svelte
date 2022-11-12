<script>
  export let headPoint = {};
  export let headDiameter = 15;
  export let strokeWidth = 4;
  export let skinColor = 'black';
</script>

<circle
  cx={headPoint.x}
  cy={headPoint.y}
  r={headDiameter / 2}
  stroke={skinColor}
  stroke-width={strokeWidth}
  fill={skinColor}
/>
