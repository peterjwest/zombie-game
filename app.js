// Creates a randomised level
var data = _.times(16, function(y) {
  return _.times(16, function(x) {
    return {
      position: V2(x, y),
      ground: x === 0 && y === 0 ? 1 : Math.random() > 0.05,
      walls: {
        x: x === 0 && y === 0 ? 0 : Math.random() > 0.8,
        y: x === 0 && y === 0 ? 0 : Math.random() > 0.8,
      },
      highlight: 0,
    };
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
