var Tile = function(data) {
  var defaults = { entities: {}, entityCount: 0 };
  _.assign(this, defaults, _.pick(data, ['ground', 'position', 'walls']));
};

Tile.prototype.addEntity = function(entity) {
  if (!this.entities[entity.id]) this.entityCount++;
  this.entities[entity.id] = entity;
};

Tile.prototype.removeEntity = function(entity) {
  if (this.entities[entity.id]) this.entityCount--;
  this.entities[entity.id] = null;
};
