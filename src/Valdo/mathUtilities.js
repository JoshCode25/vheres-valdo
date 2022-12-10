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

//receives two points and returns the distances between them broken into x-y components
export function getPointDeltas(startPoint, endPoint) {
  let {x:startX, y:startY} = startPoint;
  let {x:endX, y:endY} = endPoint;
  let pointDeltas = {
    x: endX - startX,
    y: endY - startY
  }
  console.log(startPoint, endPoint, pointDeltas);
  return pointDeltas;
}

export function getShiftedPoint(startPoint, deltas) {
  
}