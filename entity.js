var ENTITY_ID = 1;

var Entity = function(tileSize) {
  this.id = ENTITY_ID++;
  this.tileSize = tileSize;
  this.position = V2();
  this.velocity = V2();
  this.acceleration = V2();
  this.path = [];
  this.center = V2(this.tileSize/2 - 2, this.tileSize/2 - 2);
  this.offset = V2(random.float(-0.2, 0.2), random.float(-0.2, 0.2));
  this.currentTile = null;
  this.targetTile = null;
  this.targetTime = 0;
  this.targetPosition = V2();
  this.progress = 0;

  this.waiting = 0;
  this.speed = 0.75 + random.float(0.5);
};

Entity.prototype.setPosition = function(tile) {
  if (this.currentTile) this.currentTile.removeEntity(this);
  this.currentTile = tile;
  if (this.currentTile) this.currentTile.addEntity(this);
  this.position.copy(tile.position).multiplyScalar(this.tileSize).add(this.center).add(this.offset);
  this.targetPosition.copy(this.position);
};

var temp = V2();

Entity.prototype.update = function(level) {
  // Set the next tile target
  if (!this.targetTile && this.path.length) {
    if (_.last(this.path).entityCount < 1) {
      this.targetTile = this.path.pop();

      if (this.targetTile === this.currentTile) {
        return this.targetTile = null;
      }

      this.progress = 0;
      var manhattanDist = temp.copy(this.targetTile.position).sub(this.currentTile.position).lengthManhattan();
      this.targetTime = 20 / this.speed * (manhattanDist === 2 ? SQUARE_ROOT_2 : 1);
    }
  }
  // Animate to the target
  if (this.targetTile) {
    this.progress++;

    // Calculate progress to target
    var ratio = Math.min(1, this.progress / this.targetTime);
    var motion = temp.copy(this.targetTile.position).sub(this.currentTile.position).multiplyScalar(ratio);
    this.targetPosition.copy(this.currentTile.position).add(motion).add(this.offset);

    // Map position to entity coordinates
    this.targetPosition.multiplyScalar(this.tileSize).add(this.center);

    if (ratio === 1) {
      if (this.currentTile) this.currentTile.removeEntity(this);
      this.currentTile = this.targetTile;
      if (this.currentTile) this.currentTile.addEntity(this);
      this.targetTile = null;
    }
  }

  // If the target has been reached, wait then pick a new target
  if (!this.targetTile && !this.path.length) {
    if (this.waiting > 0) {
      this.waiting--;
      if (this.waiting === 0) {
        while (!this.path.length) {
          this.findPath(level, level.random())
        }
      }
    } else {
      this.waiting = random.integer(90) + 30;
    }
  }

  this.acceleration.copy(this.targetPosition).sub(this.position).multiplyScalar(this.speed / 50);
  this.velocity.add(this.acceleration).multiplyScalar(0.8);
  this.position.add(this.velocity)
};

Entity.prototype.findPath = function(level, target) {
  var route = pathfind(level, this.currentTile, target);
  if (route !== false) this.path = route;
  return route !== false;
};
