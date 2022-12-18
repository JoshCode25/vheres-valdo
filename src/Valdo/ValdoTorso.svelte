<script>
  import { valdoApparelColorStore } from "../Stores/valdoApparelStore";
  
  export let shoulderPoint = {};
  export let hipPoint = {};
  export let torsoThickness = 4;
  export let fullName = 'Jack Gerifor';
  export let skinTone = 'black';

  let firstName = fullName[0].toLowerCase();
</script>

<line
  x1={shoulderPoint.x}
  y1={shoulderPoint.y}
  x2={hipPoint.x}
  y2={hipPoint.y}
  stroke={skinTone}
  stroke-width={torsoThickness}
/>
<line
  x1={shoulderPoint.x}
  y1={shoulderPoint.y}
  x2={hipPoint.x}
  y2={hipPoint.y}
  stroke={$valdoApparelColorStore.apparelColorList[firstName[0]]}
  stroke-width={torsoThickness * $valdoApparelColorStore.apparelThickness * 2}
/>
