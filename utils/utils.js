const Promise = require('bluebird');
const co = Promise.coroutine;
const CONFIG = require('../config.json');

const animalNames = CONFIG.randomNames;

function wrapPromiseHandler(promiseRequestHandler) {
  if (typeof promiseRequestHandler !== 'function') {
    throw new Error('expected function argument');
  }
  // TODO: Add logging here.
  return co(function *genHandler(req, res, next) {
    try {
      const result = yield Promise.try(function tryHandler() {
        return promiseRequestHandler(req, res, next);
      });
      res.send(result);
      // Success response are sent by each handler
    } catch (err) {
      const status = err.status || 500;
      console.log(err);
      res.status(status).send({
        error: err
      });
    }
  });
}

class ApiError extends Error {
  constructor (status, message) {
    super();
    this.message = message;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = status || this.constructor.status || 500;
  }
}

function selectRandomName(usedNames) {
  usedNames = new Set(usedNames);
  let used = usedNames.size;
  // If number of usedNames exceeds available names we add a postfix to increase range of names and have no collisions
  let postfix = used >= animalNames.length ?  ('_' + Math.round(Math.random() * (10000 - 1000) + 1000)) : '';
  // Index used to search for a random name
  let index = Math.round(Math.random() * animalNames.length);
  let name = animalNames[index] + postfix;

  while (usedNames.has(name)) {
    index += 1; // Linear handling of collisions
    name = animalNames[index] + postfix;
  }
  return animalNames[index];
}

module.exports = { wrapPromiseHandler, ApiError, selectRandomName };
