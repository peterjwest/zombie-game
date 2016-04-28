var Level = function(data) {
  this.data = data;
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
  n: V2(-1, 0),
  e: V2(1, 0),
  s: V2(0, 1),
  w: V2(0, -1),
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
    this.get(corner.clone().add(direction.components[0])).walls.x,
    this.get(corner.clone().add(direction.components[1])).walls.y,
  ];
};

// Shorthand for defining a level (temporary)
var level = [
  [[1,0,0], [1,0,0], [1,0,0], [1,0,0], [1,0,0], [1,0,0], [0,0,0]],
  [[1,0,0], [1,0,0], [1,1,0], [1,1,1], [1,0,0], [1,1,0], [1,0,0]],
  [[0,0,0], [1,0,0], [1,0,0], [1,1,0], [1,1,1], [1,0,0], [1,0,0]],
  [[0,0,0], [1,0,0], [1,0,1], [1,0,0], [1,0,0], [1,0,0], [0,0,0]],
  [[0,0,0], [0,0,0], [1,0,0], [1,0,0], [0,0,0], [1,0,0], [1,0,0]],
];

// Maps data from shorthand above to tile objects
var data = level.map(function(row, y) {
  return row.map(function(tile, x) {
    return { position: V2(x, y), ground: !!tile[0], walls: { x: !!tile[1], y: !!tile[2] }};
  });
});

var level = new Level(data);

var current = level.get(0, 0);

// Render level
level.iterate(function(tile) {
  tile.element = document.createElement('div');
  tile.element.className = 'tile';
  if (tile === current) tile.element.classList.add('tile--current');
  if (tile.ground) tile.element.classList.add('tile--solid');
  if (tile.walls.x) tile.element.classList.add('tile--wall-x');
  if (tile.walls.y) tile.element.classList.add('tile--wall-y');
  if (tile.position.x === 0) tile.element.classList.add('tile--line-start');
  document.body.appendChild(tile.element);
});

// Animate entity on click
var path = [];
level.iterate(function(tile) {
  tile.element.addEventListener('click', function() {
    var route = pathfind(level, current, tile);
    if (route !== false) {
      path = _.reverse(route);
    }
  });
});
var last = 0;
var step = function(timestamp) {
  if (path.length && timestamp > last + 200) {
    current.element.classList.remove('tile--current');
    current = path.pop();
    current.element.classList.add('tile--current');
    last = timestamp;
  }
  window.requestAnimationFrame(step);
};
step();

// Calculate tile neighbours
level.iterate(function(tile) {
  var position = tile.position;

  tile.neighbours = [];

  if (!level.get(position).ground) return;

  Level.adjacents.map(function(adjacent) {
    var wall = level.getWallsInDirection(position, adjacent)[0];
    if (level.get(temp.copy(position).add(adjacent)).ground && !wall) {
      tile.neighbours.push(adjacent);
    }
  });

  Level.diagonals.map(function(adjacent) {
    var walls = level.getWallsInDirection(position, adjacent);

    var adjacentTiles = [
      level.get(temp.copy(position).add(adjacent)),
      level.get(temp.copy(position).add(adjacent.components[0])),
      level.get(temp.copy(position).add(adjacent.components[1])),
    ];

    if (!_.some(adjacentTiles, ['ground', false]) && !_.some(walls)) {
      tile.neighbours.push(adjacent);
    }
  });
});
