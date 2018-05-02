const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'testProject';

// Use connect method to connect to the server

//use mongoclient.connect in every .post or .get
MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    insertDocuments(db, () => {
       // findDocuments(db, () => {
            client.close();
       // });
    });
});

const insertDocuments = (db, callback) => {
    // Get the documents collection
    const collection = db.collection('users');
    // Insert some documents
    let user = {
        name: "James",
        email: "james13@gmail.com",
        age: 25
    };
    collection.insertOne(user, (err, result) => {
        assert.equal(err, null);
        console.log("Inserted document into the collection");
        callback(result);
    });
};
const findDocuments = (db, callback) => {
    // Get the documents collection
    const collection = db.collection('users');
    // Find some documents
    collection.find({}).toArray((err, docs) => {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs);
        callback(docs);
    });
};

// const updateDocument = (db, callback) => {
//     // Get the documents collection
//     const collection = db.collection('documents');
//     // Update document where a is 2, set b equal to 1
//     collection.updateOne({ a : 2 }
//         , { $set: { b : 1 } }, (err, result) => {
//             assert.equal(err, null);
//             assert.equal(1, result.result.n);
//             console.log("Updated the document with the field a equal to 2");
//             callback(result);
//         });
// };

// const removeDocument = (db, callback) => {
//     // Get the documents collection
//     const collection = db.collection('documents');
//     // Delete document where a is 3
//     collection.deleteOne({ a : 3 }, (err, result) => {
//         assert.equal(err, null);
//         assert.equal(1, result.result.n);
//         console.log("Removed the document with the field a equal to 3");
//         callback(result);
//     });
// };