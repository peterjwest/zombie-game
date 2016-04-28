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

level.computeNeighbours();

var entities = _.times(500, function() {
  return new Entity(16);
});
entities.map(function(entity) {
  entity.setPosition(current);
  entity.path = [current];
});

current.highlight = 500;

var step = function() {
  entities.map(function(entity) {
    entity.update(level);
  });
  renderer.render(level, entities);
  window.requestAnimationFrame(step);
};
step();
