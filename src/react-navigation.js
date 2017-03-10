/*
 * @noflow - get/set properties not yet supported by flow. also `...require(x)` is broken #6560135
 */

 /* eslint-disable global-require */

module.exports = {

  // Header
  get Header() { return require('./views/Header').default; },
};
