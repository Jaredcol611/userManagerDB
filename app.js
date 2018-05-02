const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dbName = 'testProject';
const app = express();

let user;
let userArr = [];
let userCount = 0;

// use and set code

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views',  path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// express code ----------------------------------------------------------------------------




// get root page, render index which contains form
app.get('/', (req,res) => {
    res.render('index', {id: userCount});
    //check users add user button. need to reconnect to client here on button press
});

//post request pushes form data to array
app.post('/users', (req, res) => {
    user = {
        userId: req.body.userId,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    };
    MongoClient.connect(url, (err, client) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        insertDocuments(db, user, () => {
                client.close();
        });
    });

    MongoClient.connect(url, (err, client) => {

        const db = client.db(dbName);
        const collection = db.collection('users');
        collection.find({}).toArray((err, docs) => {
            assert.equal(err, null);
            console.log("Found the following records");
            console.log(docs);
            res.render('./users', {users:docs.map(user =>
                    ({
                          userId: user.data.userId,
                          name: user.data.name,
                          email: user.data.email,
                          age: user.data.age
                    }))
                })
          });
            client.close();
        });
});

//edit page grabs id from user to render on a new form
app.get('/edit/:id', (req, res) => {
    let userInfo;
    for(let i = 0; i < userArr.length; i++){
        if(+req.params.id === userArr[i].id){
            userInfo = userArr[i];
            res.render('./edit', {user: userInfo});
        }
    }
});
// edit page form passing in new, edited information
app.post('/edit', (req, res) => {
    let userEdit = {
        userId: req.body.userId,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        //id: req.body.id
    };
    for(let i = 0; i < userArr.length; i++){
        if(+req.body.id === userArr[i].id){
            userArr[i] = userEdit;
        }
    }
    res.render('users', {users:userArr});
});

// deletes specific user from array and removes them from table
app.get('/delete/:id', (req, res) => {
    for(let i = 0; i < userArr.length; i++){
        if(+req.params.id === userArr[i].id){
            userArr.splice(i, 1);
        }
    }
    res.render('users', {users:userArr});
});

//port for server
app.listen(3000, () => {
    console.log('listening on port 3000')
});




// All mongodb functions below -----------------------------------------------------------

const insertDocuments = (db, data, callback) => {
    // Get the documents collection
    const collection = db.collection('users');
    // Insert some documents
    collection.insertOne(
        {data}, (err, result) => {
        assert.equal(err, null);
        console.log("Inserted document into the collection");
        callback(result);
    });
};
