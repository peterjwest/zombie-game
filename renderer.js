var Renderer = function(canvas) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  // TODO: Deal with unsupported browsers
};

Renderer.prototype.render = function(level, entities) {
  this.clear();
  level.iterate(this.renderTile.bind(this));
  level.iterate(this.renderTileWalls.bind(this));
  entities.map(this.renderEntity.bind(this));
};

Renderer.prototype.renderTile = function(tile) {
  this.context.fillStyle = tile.ground ? "rgb(160, 200, 100)" : "rgb(120, 120, 100)";
  this.context.strokeStyle = "rgb(50, 50, 50)";
  this.context.fillRect(
    tile.position.x * level.tileSize,
    tile.position.y * level.tileSize,
    level.tileSize,
    level.tileSize
  );
};

Renderer.prototype.renderTileWalls = function(tile) {
  if (tile.walls.x) {
    this.context.beginPath();
    this.context.moveTo(tile.position.x * level.tileSize - 1, (tile.position.y + 1) * level.tileSize);
    this.context.lineTo((tile.position.x + 1) * level.tileSize + 1, (tile.position.y + 1) * level.tileSize);
    this.context.lineWidth = 2;
    this.context.stroke();
  }
  if (tile.walls.y) {
    this.context.beginPath();
    this.context.moveTo((tile.position.x + 1) * level.tileSize, tile.position.y * level.tileSize - 1);
    this.context.lineTo((tile.position.x + 1) * level.tileSize, (tile.position.y + 1) * level.tileSize + 1);
    this.context.lineWidth = 2;
    this.context.stroke();
  }
};

Renderer.prototype.renderEntity = function(entity) {
  this.context.fillStyle = "rgb(120, 120, 200)";
  this.context.fillRect(
    Math.floor(entity.position.x),
    Math.floor(entity.position.y),
    4,
    4
  );
};

Renderer.prototype.clear = function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};
