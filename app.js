random.seed(0);

// Creates a randomised level
var data = _.times(14, function(y) {
  return _.times(14, function(x) {
    var start = (x === 0 && (y === 0 || y === 1));
    var outOfBounds = x - y > 6 || y - x > 6;
    return {
      position: V2(x, y),
      ground: outOfBounds ? 0 : (start ? 1 : random.boolean(0.95)),
      walls: {
        x: outOfBounds || start ? 0 : random.boolean(0.2),
        y: outOfBounds || start ? 0 : random.boolean(0.2),
      },
    };
  });
});

var level = new Level(data, 16);
var renderer = new Renderer(document.getElementById('game'));

var current = level.get(0, 0);

var temp = V2();

level.computeNeighbours();

var entities = _.times(30, function() {
  return new Entity(16);
});
entities.map(function(entity) {
  entity.setPosition(current);
  entity.path = [];
});

var step = function() {
  entities.map(function(entity) {
    entity.update(level);
  });
  renderer.render(level, entities);
  window.requestAnimationFrame(step);
};
step();

