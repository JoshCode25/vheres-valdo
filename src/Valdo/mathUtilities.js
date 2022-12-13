export function getPointDist(point1, point2) {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
}

//receives two points and returns the distances between them broken into x-y components
export function getPointDeltaAngle(startPoint, endPoint) {
  let {x:startX, y:startY} = startPoint;
  let {x:endX, y:endY} = endPoint;
  let deltaX = endX - startX;
  let deltaY = endY - startY;
  let angleToHoriz = Math.atan(deltaY / deltaX)
  let pointDeltas = {
    x: endX - startX,
    y: endY - startY,
    angleToHoriz: angleToHoriz
  }
  return pointDeltas;
}
