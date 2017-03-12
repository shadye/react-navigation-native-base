/*
 * @noflow - get/set properties not yet supported by flow. also `...require(x)` is broken #6560135
 */

 /* eslint-disable global-require */

module.exports = {

  // Header
  get Header() { return require('./views/Header').default; },

  // TabBar
  get TabBarBottom() { return require('./views/TabBarBottom').default; },
  //get TabBarTop() { return require('./views/TabBarTop').default; }, // TODO
};
