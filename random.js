var engine = Random.engines.mt19937();

var random = {
  seed: engine.seed,
  boolean: function(chance) {
    return Random.bool(chance === undefined ? 0.5 : chance)(engine);
  },
  integer: function(end, start) {
    return Random.integer(start === undefined ? 0 : start, end)(engine);
  },
  float: function(end, start) {
    return Random.real(start === undefined ? 0 : start, end)(engine);
  },
  pick: function(array) {
    return Random.pick(engine, array);
  },
};
