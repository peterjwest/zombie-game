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

// Gets the walls between a tile and an adjacent tile
Level.prototype.wallInDirection = function(position, direction) {
  // Moving north/south
  if (direction.x === 0) {
    temp.copy(position);
    if (direction.y < 0) temp.add(direction);
    return this.get(temp).walls.x;
  }

  // Moving east/west
  if (direction.y === 0) {
    temp.copy(position);
    if (direction.x < 0) temp.add(direction);
    return this.get(temp).walls.y;
  }
};

Level.prototype.random = function() {
  return random.pick(random.pick(this.data));
};

Level.prototype.computeNeighbours = function() {
  // Calculate adjacent neighbours
  level.iterate(function(tile) {
    var position = tile.position;
    tile.neighbours = [];

    if (!level.get(position).ground) return;

    Level.adjacents.forEach(function(direction) {
      var wall = level.wallInDirection(position, direction);
      if (level.get(temp.copy(position).add(direction)).ground && !wall) {
        tile.neighbours.push(direction);
      }
    });
  });

  // Calculate diagonal neighbours
  level.iterate(function(tile) {
    var position = tile.position;

    Level.diagonals.forEach(function(direction) {
      var neighbour = level.get(temp.copy(position).add(direction));
      var componentNeighbours = [
        level.get(temp.copy(position).add(direction.components[0])),
        level.get(temp.copy(position).add(direction.components[1])),
      ];

      if (_.intersection(tile.neighbours, direction.components).length === 2
        && _.includes(componentNeighbours[0].neighbours, direction.components[1])
        && _.includes(componentNeighbours[1].neighbours, direction.components[0])
      ) {
        tile.neighbours.push(direction);
      }
    });
  });
};
