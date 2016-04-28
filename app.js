// Shorthand for defining a level (temporary)
var level = [
  [[1,0,0], [1,0,0], [1,0,0], [0,0,0], [1,0,0], [1,0,0], [0,0,0]],
  [[1,0,0], [1,0,0], [1,1,0], [1,1,1], [1,0,0], [1,1,0], [1,0,0]],
  [[0,0,0], [1,0,0], [1,0,0], [1,1,0], [1,1,1], [1,0,0], [1,0,0]],
  [[0,0,0], [1,0,0], [1,0,1], [1,0,0], [1,0,0], [1,0,0], [0,0,0]],
  [[0,0,0], [0,0,0], [1,0,0], [1,0,0], [0,0,0], [1,0,0], [1,0,0]],
];

// Maps data from shorthand above to tile objects
var data = level.map(function(row, y) {
  return row.map(function(tile, x) {
    return { position: V2(x, y), ground: !!tile[0], walls: { x: !!tile[1], y: !!tile[2] }, highlight: 0 };
  });
});

var level = new Level(data, 16);
var renderer = new Renderer(document.getElementById('game'));

var current = level.get(0, 0);

var temp = V2();

// Calculate tile neighbours
level.iterate(function(tile) {
  var position = tile.position;

  tile.neighbours = [];

  if (!level.get(position).ground) return;

  Level.adjacents.map(function(direction) {
    var wall = level.getWallsInDirection(position, direction)[0];
    if (level.get(temp.copy(position).add(direction)).ground && !wall) {
      tile.neighbours.push(direction);
    }
  });

  Level.diagonals.map(function(direction) {
    var walls = level.getWallsInDirection(position, direction);

    var adjacentTiles = [
      level.get(temp.copy(position).add(direction)),
      level.get(temp.copy(position).add(direction.components[0])),
      level.get(temp.copy(position).add(direction.components[1])),
    ];

    if (!_.some(adjacentTiles, ['ground', false]) && !_.some(walls)) {
      tile.neighbours.push(direction);
    }
  });
});

var entities = [new Entity(16), new Entity(16), new Entity(16)];
entities.map(function(entity) {
  entity.setPosition(current);
  setTimeout(function() {
    setInterval(function() {
      level.findPath(entity, level.random());
    }, Math.random() * 3000);
  }, Math.random() * 1000);
});

current.highlight = 3;

var step = function() {
  entities.map(function(entity) {
    entity.update();
  });
  renderer.render(level, entities);
  window.requestAnimationFrame(step);
};
step();
