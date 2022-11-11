<script>
   export let height = 500;
   export let width = (height * 5) / 6;

   let midPoint = { x: height / 2, y: width / 2 };
   let headDiameter = height / 7;
   let maxArmLength = headDiameter * 3;
   let maxLegLength = headDiameter * 3;
</script>

<svg {width} {height}>
   <circle
      cx={midPoint.x}
      cy={midPoint.y}
      r={headDiameter}
      stroke="green"
      stroke-width="4"
      fill="yellow"
   />
</svg>
