const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://viettt:vietdq@cluster0.mvbjz.mongodb.net/test";
const dbName = "my_store";


async function getDbo() {
    const client = await MongoClient.connect(url);
    const dbo = client.db(dbName);
    return dbo;
}

async function insertOneIntoCollection(document, collection) {
    const dbo = await getDbo();
    await dbo.collection(collection).insertOne(document);
}

async function searchProduct(condition, collectionName) {
    const dbo = await getDbo();
    const searchCondition = new RegExp(condition, 'i')
    var results = await dbo.collection(collectionName).
    find({ name: searchCondition }).toArray();
    return results;
}

async function findOneProduct(condition, collectionName) {
    const dbo = await getDbo();
    var results = await dbo.collection(collectionName).
    findOne(condition);
    return results;
}

async function editFromCollection(condition, collection, newData) {
    const dbo = await getDbo();
    await dbo.collection(collection).updateOne(condition, newData);
}

async function deleteFromCollection(condition, collection) {
    const dbo = await getDbo();
    await dbo.collection(collection).deleteOne(condition);
}

async function checkLogin(username, password) {
    const dbo = await getDbo();
    const results = await dbo.collection("users").
    findOne({ $and: [{ username: username }, { password: password }] });
    if (results != null)
        return true;
    else
        return false;
}

module.exports = { insertOneIntoCollection, searchProduct, editFromCollection, deleteFromCollection, checkLogin, findOneProduct };