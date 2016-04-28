var SQUARE_ROOT_2 = Math.sqrt(2);

var heuristic = function(a, b) {
  var diffX = Math.abs(b.x - a.x);
  var diffY = Math.abs(b.y - a.y);
  return Math.min(diffX, diffY) * SQUARE_ROOT_2 + Math.abs(diffX - diffY);
};

var scorePathStep = function(direction) {
  return direction.x === 0 || direction.y === 0 ? 1 : SQUARE_ROOT_2;
};

var computePath = function(node) {
  var current = node;
  var path = [];
  while (current.path.parent) {
    path.unshift(current);
    current = current.path.parent;
  }
  return path;
};

var fringe = new BinaryHeap(function(node) {
  return node.path.pathScore + node.path.heuristicScore;
});

var pathfind = function(level, start, end) {
  var traversed = [];

  fringe.empty();

  start.path = {
    pathScore: 0,
    heuristicScore: heuristic(start.position, end.position),
  };
  fringe.push(start);
  traversed.push(start);

  while (fringe.length() > 0) {
    var node = fringe.pop();

    if (node === end) {
      var path = computePath(node);
      traversed.forEach(function(node) { node.path = null; });
      return path;
    }

    node.neighbours.forEach(function(direction) {
      var neighbour = level.get(node.position.clone().add(direction));
      var pathScore = node.path.pathScore + scorePathStep(direction);

      if (neighbour.path && pathScore >= neighbour.path.pathScore) {
        return;
      }

      if (neighbour.path) {
        neighbour.path.parent = node;
        neighbour.path.pathScore = pathScore;

        fringe.rescoreElement(neighbour);
      }

      else {
        neighbour.path = {
          parent: node,
          pathScore: pathScore,
          heuristicScore: heuristic(neighbour.position, end.position),
        };

        fringe.push(neighbour);
        traversed.push(neighbour);
      }
    });
  }

  traversed.forEach(function(node) { node.path = null; });
  return false;
};
