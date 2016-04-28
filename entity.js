var Entity = function(tileSize) {
  this.tileSize = tileSize;
  this.position = V2();
  this.velocity = V2();
  this.acceleration = V2();
  this.path = [];
  this.current = V2();
};

Entity.prototype.setPosition = function(tile) {
  this.current = tile;
  this.position = this.position.copy(tile.position).multiplyScalar(this.tileSize);
  this.position.add(V2((0.25 + Math.random()/2) * this.tileSize - 2, (0.25 + Math.random()/2) * this.tileSize - 2))
};

Entity.prototype.update = function() {
  if (this.path.length) {
    var target = _.last(this.path);
    var direction = temp.copy(target.position).sub(this.current.position);
    this.acceleration.copy(direction).multiplyScalar(0.1);
    if (temp.copy(this.position).multiplyScalar(1 / this.tileSize).floor().equals(target.position)) {
      this.current.highlight--;
      this.current = this.path.pop();
      this.current.highlight++;
    }
  } else {
    this.acceleration.set(0, 0);
  }
  this.velocity.add(this.acceleration).multiplyScalar(0.9);
  this.position.add(this.velocity);
};
