var images = {
  tile: document.getElementById('tile'),
  'tile-blocked': document.getElementById('tile-blocked'),
  'wall-x': document.getElementById('wall-x'),
  'wall-y': document.getElementById('wall-y'),
  entity: document.getElementById('entity'),
}

var Renderer = function(canvas) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  // TODO: Deal with unsupported browsers
};

Renderer.prototype.render = function(level, entities) {
  this.clear();
  level.iterate(this.renderTile.bind(this));

  var self = this;
  var items = entities.map(function(entity) {
    var coords = self.screenCoordinates(temp.copy(entity.position).multiplyScalar(1 / level.tileSize).sub(V2(0.5, 0.5)));
    return ['entity', coords.x + 110, coords.y + 10];
  });

  level.iterate(function(tile) {
    if (tile.walls.x || tile.walls.y) {
      var coords = self.screenCoordinates(tile.position);
    }
    if (tile.walls.x) {
      items.push(['wall-x', coords.x + 110, coords.y + 10]);
    }
    if (tile.walls.y) {
      items.push(['wall-y', coords.x + 110, coords.y + 10]);
    }
  });

  items = items.sort(function(a, b) {
    return a[2] === b[2] ? a[1] - b[1] : a[2] - b[2];
  });

  items.forEach(function(item) {
    if (item[0] === 'wall-x' || item[0] === 'wall-y') {
      self.renderTileWall(item[0], item[1] + (item[0] === 'wall-x' ? -1 : 16), item[2] - 10);
    }
    if (item[0] === 'entity') {
      self.renderEntity(item[1] + 13, item[2] - 17);
    }
  });
};

Renderer.prototype.renderTile = function(tile) {
  var coords = this.screenCoordinates(tile.position);
  this.context.drawImage(images[tile.ground ? 'tile' : 'tile-blocked'], coords.x + 110, coords.y + 10);
};

Renderer.prototype.renderTileWall = function(type, x, y) {
  this.context.drawImage(images[type], x, y);
};

Renderer.prototype.renderEntity = function(x, y) {
  this.context.drawImage(images['entity'], x, y);
};

var tileSize = V2(36, 18);

var transform = new THREE.Matrix3();
transform.fromArray([
  tileSize.x / 2, tileSize.y / 2, 0,
  -tileSize.x / 2, tileSize.y / 2, 0,
  0, 0, 0,
]);

var vector3D = new THREE.Vector3();

Renderer.prototype.screenCoordinates = function(position) {
  vector3D.set(position.x, position.y, 0);
  vector3D.applyMatrix3(transform);
  return vector3D;
};

Renderer.prototype.clear = function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};
