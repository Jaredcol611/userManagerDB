const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017';
const dbName = 'testProject';
const app = express();
let userArr = [];

// use and set code

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views',  path.join(__dirname, 'views'));
app.set('view engine', 'pug');




//Mongoose beginning

mongoose.connect('mongodb://localhost/test');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    //Schema
    const mySchema = mongoose.Schema({
        userId: String,
        name: String,
        email: String,
        age: Number
    });
    let user = mongoose.model('user', mySchema);
    // express code ----------------------------------------------------------------------------

    // get root page, render index which contains form
    app.get('/', (req, res) => {
        res.render('index');
        //check users add user button. need to reconnect to client here on button press
    });

    //post request pushes form data to array
    app.post('/users', (req, res) => {
        let person = new user({
            userId: req.body.userId,
            name: req.body.name,
            email: req.body.email,
            age: req.body.age
        });
        person.save(function (err, person) {
            if (err) return console.log(err);
            console.log(person);

            user.find({}, (err, people) => {
                if (err) return console.log(err);
                res.render('users', {users: people});
                console.log(people);
            });
        });
        //userArr.push(user);

        // Not using userArr anymore, will need to render the document. ??

    });

    app.get('/users', (req, res) => {
        user.find({}, (err, people) => {
            if (err) console.log(err);

            res.render('users', {users: people})
        })
    });

    //edit page grabs id from user to render on a new form
    app.get('/edit/:_id', (req, res) => {

        user.findById(req.params._id, (err, person) => {
            if (err) console.log(err);
            res.render('edit', {user: person})
        });
    });

    // edit page form passing in new, edited information
    app.post('/edit/:_id', (req, res) => {

        user.update({_id: req.params._id},

            {
                $set:
                    {
                        userId: req.body.userId,
                        name: req.body.name,
                        email: req.body.email,
                        age: req.body.age,
                    }
            }, (err) => {
                if (err) console.log(err);

                res.redirect('/users');
            });
    });

    // deletes specific user from array and removes them from table
    app.get('/delete/:_id', (req, res) => {
        user.remove({_id: req.params._id}, (err) => {
            if (err) return console.log(err);


            res.redirect('/users');
        });
    });
    //port for server
    app.listen(3000, () => {
        console.log('listening on port 3000')
    });
});














