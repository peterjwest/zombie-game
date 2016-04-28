var V2 = function(x, y) {
  return new THREE.Vector2(x, y);
};

THREE.Vector2.prototype.abs = function() {
  this.x = Math.abs(this.x);
  this.y = Math.abs(this.y);
  return this;
};
