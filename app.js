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

        user.find({}, (err, people) => {
            if (err) return console.log(err);
            res.render('users', {users: people});
            console.log(people);
        });
    });

    app.get('/add', (req, res) => {
        res.render('index');
    });

    //post request posts form data to db
    app.post('/users', (req, res) => {
        let person = new user({
            userId: req.body.userId,
            name: req.body.name,
            email: req.body.email,
            age: req.body.age
        });
        //save person to db collection user
        person.save(function (err, person) {
            if (err) return console.log(err);
            console.log(person);

            user.find({}, (err, people) => {
                if (err) return console.log(err);
                res.render('users', {users: people});
                console.log(people);
            });
        });
    });

    // get the user page
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


    //all sort /get requests below
    app.get('/sortId', (req, res) => {
        user.find({}).sort( { userId: -1 } );
        // user.sort((a, b) => {
            // if(a.userId < b.userId){return -1}
            // else if(a.name > b.name){return 1}
            // else return 0;
        res.redirect('users');
    });
    app.get('/sortName', (req, res) => {
        user.sort({}).sort( { name: -1 } );
        res.redirect('users');
    });
    app.get('/sortEmail', (req, res) => {
        user.sort({}).sort( { email: -1} );
        res.redirect('users');
    });
    app.get('/sortAge', (req,res) => {
        user.sort({}).sort( { age: -1 } );
        res.redirect('users');
    });


    //port for server
    app.listen(3000, () => {
        console.log('listening on port 3000')
    });
});

//data dump












