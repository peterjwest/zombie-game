var level = [
  [[1,0,0], [1,0,0], [1,0,0], [1,0,0], [1,0,0], [1,0,0], [0,0,0]],
  [[1,0,0], [1,0,0], [1,1,0], [1,1,1], [1,0,0], [1,1,0], [1,0,0]],
  [[0,0,0], [1,0,0], [1,0,0], [1,1,0], [1,1,1], [1,0,0], [1,0,0]],
  [[0,0,0], [1,0,0], [1,0,1], [1,0,0], [1,0,0], [1,0,0], [0,0,0]],
  [[0,0,0], [0,0,0], [1,0,0], [1,0,0], [0,0,0], [1,0,0], [1,0,0]],
];

var data = level.map(function(row, y) {
  return row.map(function(tile, x) {
    return { position: V2(x, y), ground: !!tile[0], walls: { x: !!tile[1], y: !!tile[2] }};
  });
});

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

// Gets walls between a tile and it's adjacent tile in a direction
Level.prototype.getDirectionWalls = function(pos, dir) {
  // Moving north/south
  if (dir.x === 0) {
    temp.copy(pos);
    if (dir.y < 0) temp.add(dir);
    return [this.get(temp).walls.x];
  }

  // Moving east/west
  if (dir.y === 0) {
    temp.copy(pos);
    if (dir.x < 0) temp.add(dir);
    return [this.get(temp).walls.y];
  }

  // If we are this far, the direction must be diagonal
  // First work out the minimum corner of the two tiles
  var corner = temp.copy(pos).add(dir).min(pos);

  // Take the relevant walls
  return [
    this.get(corner.x, corner.y).walls.x,
    this.get(corner.x, corner.y).walls.y,
    this.get(corner.x + 1, corner.y).walls.x,
    this.get(corner.x, corner.y + 1).walls.y,
  ];
};

var level = new Level(data);

var current = level.get(0, 0);
var path = [];

// Render level
level.iterate(function(tile) {
  var div = document.createElement('div');
  div.className = 'tile';
  if (tile.ground) div.classList.add('tile--solid');
  if (tile.walls.x) div.classList.add('tile--wall-x');
  if (tile.walls.y) div.classList.add('tile--wall-y');
  if (tile.position.x === 0) div.classList.add('tile--line-start');
  div.addEventListener('click', function() {
    var route = pathfind(level, current, tile);
    if (route !== false) {
      path = _.reverse(route)
    }
  });
  document.body.appendChild(div);
  tile.element = div;
});

current.element.classList.add('tile--current');

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
    var wall = level.getDirectionWalls(position, adjacent)[0];
    if (level.get(temp.copy(position).add(adjacent)).ground && !wall) {
      tile.neighbours.push(adjacent);
    }
  });

  Level.diagonals.map(function(adjacent) {
    var walls = level.getDirectionWalls(position, adjacent);

    var adjacentTiles = [
      level.get(position.x + adjacent.x, position.y + adjacent.y),
      level.get(position.x, position.y + adjacent.y),
      level.get(position.x + adjacent.x, position.y),
    ];

    if (!_.some(adjacentTiles, ['ground', false]) && !_.some(walls)) {
      tile.neighbours.push(adjacent);
    }
  });
});
