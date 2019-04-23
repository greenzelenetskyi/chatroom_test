const { ObjectID } = require('mongodb');

// returns a Promise
async function findMessageById(dbCollection, messageId) {
  return dbCollection.findOne({ _id: ObjectID.createFromHexString(messageId) });
}

// returns a Promise
async function collectMessageListPortion(dbCollection, pageNum, size) {
  const result = await dbCollection.find({}, { skip: +pageNum * size, limit: size });
  return result.toArray();
}

async function recordNewMessage(dbCollection, email, message) {
  const creationDate = new Date().toISOString();
  const result = await dbCollection.insertOne({
    email, message, creationDate, updateTime: creationDate,
  });
  return result;
}

module.exports = {
  findMessageById,
  collectMessageListPortion,
  recordNewMessage,
};
