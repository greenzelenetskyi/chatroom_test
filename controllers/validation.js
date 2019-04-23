const { ObjectId } = require('mongodb');

// checks if the string can be converted to Mongo ObjectId
function isValidId(id) {
  return ObjectId.isValid(id);
}

// req.body validation
function isValidBodyStructure(body, pattern) {
  const arr = Object.keys(pattern);
  return arr.every((prop) => {
    return Object.prototype.hasOwnProperty.call(body, prop) && pattern[prop] === typeof body[prop];
  });
}

function isValidFormat(regex, testString) {
  return regex.test(testString);
}

module.exports = {
  isValidId,
  isValidBodyStructure,
  isValidFormat,
};
