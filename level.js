var Level = function(data, tileSize) {
  this.data = data;
  this.tileSize = tileSize;
};

Level.prototype.default = { ground: false, walls: {}};

Level.prototype.get = function(x, y) {
  if (arguments.length === 1) {
    y = x.y;
    x = x.x;
  }
  if (this.data[y] === undefined || this.data[y][x] === undefined) {
    return this.default;
  }
  return this.data[y][x];
};

Level.prototype.iterate = function(callback) {
  this.data.forEach(function(row) {
    row.forEach(callback);
  });
};

// Named directions
Level.directions = {
  n: V2(0, -1),
  e: V2(1, 0),
  s: V2(0, 1),
  w: V2(-1, 0),
  ne: V2(1, -1),
  se: V2(1, 1),
  sw: V2(-1, 1),
  nw: V2(-1, -1),
};

Level.directions.ne.components = [Level.directions.e, Level.directions.n];
Level.directions.se.components = [Level.directions.e, Level.directions.s];
Level.directions.sw.components = [Level.directions.w, Level.directions.s];
Level.directions.nw.components = [Level.directions.w, Level.directions.n];

// Adjacent tiles
Level.adjacents = [
  Level.directions.n,
  Level.directions.e,
  Level.directions.s,
  Level.directions.w,
];

// Diagonally adjacent tiles
Level.diagonals = [
  Level.directions.ne,
  Level.directions.se,
  Level.directions.sw,
  Level.directions.nw,
];

var temp = V2();
var temp2 = V2();

// Gets the walls between a tile and an adjacent tile
Level.prototype.getWallsInDirection = function(position, direction) {
  // Moving north/south
  if (direction.x === 0) {
    temp.copy(position);
    if (direction.y < 0) temp.add(direction);
    return [this.get(temp).walls.x];
  }

  // Moving east/west
  if (direction.y === 0) {
    temp.copy(position);
    if (direction.x < 0) temp.add(direction);
    return [this.get(temp).walls.y];
  }

  // If we are this far, the direction must be diagonal
  // First work out the minimum corner of the two tiles
  var corner = temp.copy(position).add(direction).min(position);

  // Take the relevant walls
  return [
    this.get(corner).walls.x,
    this.get(corner).walls.y,
    this.get(temp2.copy(corner).add(temp.copy(direction.components[0]).abs())).walls.x,
    this.get(temp2.copy(corner).add(temp.copy(direction.components[1]).abs())).walls.y,
  ];
};

Level.prototype.findPath = function(entity, target) {
  var route = pathfind(this, entity.current, target);
  if (route !== false) entity.path = route;
  return route !== false;
};

Level.prototype.random = function() {
  var row = this.data[Math.floor(Math.random() * this.data.length)];
  return row[Math.floor(Math.random() * row.length)];
};
