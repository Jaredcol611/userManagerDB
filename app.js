const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

const url = 'mongodb://localhost:27017';
const dbName = 'testProject';
const app = express();
let userArr = [];

// use and set code

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views',  path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Schema
const mySchema = mongoose.Schema({
    userId: String,
    name: String,
    email: String,
    age: Number
});

//Mongoose beginning
let User = mongoose.model('User', mySchema);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});



// express code ----------------------------------------------------------------------------




// get root page, render index which contains form
app.get('/', (req,res) => {
    res.render('index');
    //check users add user button. need to reconnect to client here on button press
});

//post request pushes form data to array
app.post('/users', (req, res) => {
    let user = new User({
        userId: req.body.userId,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    });
    user.save(function (err, user) {
        if (err) return console.error(err);
        console.log(user);
    });
    // Not using userArr anymore, will need to render the document. ??
    res.render('./users', {users:userArr});
});

//edit page grabs id from user to render on a new form
app.get('/edit/:id', (req, res) => {
    let userInfo;
    for(let i = 0; i < userArr.length; i++){
        if(+req.params.id === userArr[i].id){
            userInfo = userArr[i];
            res.render('edit', {user: userInfo});
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
        id: req.body.id
    };
    for(let i = 0; i < userArr.length; i++){
        if(+req.body.id === userArr[i].id){
            userArr[i] = userEdit;
        }
    }
    res.render('users', {user:userArr});
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




