<script>
  export function getPointDist(point1, point2) {
    return Math.sqrt(
      Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
    );
  }

  export function getPointDeltaAngle(point1, point2) {
    let deltaX = point1.x - point2.x;
    let deltaY = point1.y - point2.y;
    let angleToHoriz = Math.atan(deltaY / deltaX);

    return {
      deltaX: deltaX,
      deltaY: deltaY,
      angleToHoriz: angleToHoriz,
    };
  }
</script>
