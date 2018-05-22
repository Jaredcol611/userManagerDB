const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// use, set and global booleans for sorting

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views',  path.join(__dirname, 'views'));
app.set('view engine', 'pug');

let sortId = true;
let sortFirstName = true;
let sortLastName = true;
let sortEmail = true;
let sortAge = true;

//Mongoose beginning

mongoose.connect('mongodb://localhost/test');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // Connected!
    // Schema
    const mySchema = mongoose.Schema({
        userId: String,
        firstName: String,
        lastName: String,
        email: String,
        age: Number
    });
    let user = mongoose.model('user', mySchema);
    // express code ----------------------------------------------------------------------------

    // get root page, render index which now displays the users table
    app.get('/', (req, res) => {
        user.find({}, (err, people) => {
            if (err) return console.log(err);
            res.render('users', {users: people});
            console.log(people);
        });
    });

    //when hitting the add new user button from users table
    app.get('/add', (req, res) => {
        res.render('index');
    });

    // posts form data to db
    app.post('/users', (req, res) => {
        let person = new user({
            userId: req.body.userId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            age: req.body.age
        });
        //save person to db collection user
        person.save(function (err, person) {
            if (err) return console.log(err);
            console.log(person);
            //find the new collection and display it on users table
            user.find({}, (err, people) => {
                if (err) return console.log(err);
                res.render('users', {users: people});
                console.log(people);
            });
        });
    });

    // get the users table page
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
            {$set:
                    {
                        userId: req.body.userId,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
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
    //Sort Id
    app.get('/sortId', (req, res) => {
        sortId ?
            user.find({}).sort('-userId').exec((err, users) => {
                if (err) console.log(err);
                res.render('users', {users: users});
                sortId = false;
            })
            :
            user.find({}).sort('userId').exec((err, users) => {
                if (err) console.log(err);
                res.render('users', {users: users});
                sortId = true;
            });
    });
    //Sort First Name
    app.get('/sortFirstName', (req, res) => {
        sortFirstName ?
            user.find({}).sort('-firstName').exec((err, users) => {
                if (err) console.log(err);
                res.render('users', {users: users});
                sortFirstName = false;
            })
            :
            user.find({}).sort('firstName').exec((err, users) => {
                if (err) console.log(err);
                res.render('users', {users: users});
                sortFirstName = true;
            });
    });
    //Sort Last Name
    app.get('/sortLastName', (req, res) => {
        sortLastName ?
            user.find({}).sort('-lastName').exec((err, users) => {
                if (err) console.log(err);
                res.render('users', {users: users});
                sortLastName = false;
            })
            :
            user.find({}).sort('lastName').exec((err, users) => {
                if (err) console.log(err);
                res.render('users', {users: users});
                sortLastName = true;
            });
    });
    //Sort Email
    app.get('/sortEmail', (req, res) => {
        sortEmail ?
            user.find({}).sort('-email').exec((err, users) => {
                if (err) console.log(err);
                res.render('users', {users: users});
                sortEmail = false;
            })
            :
            user.find({}).sort('email').exec((err, users) => {
                if (err) console.log(err);
                res.render('users', {users: users});
                sortEmail = true;
            });
    });
    //Sort Age
    app.get('/sortAge', (req,res) => {
        sortAge ?
            user.find({}).sort('-age').exec((err, users) => {
                if (err) console.log(err);
                res.render('users', {users: users});
                sortAge = false;
            })
            :
            user.find({}).sort('age').exec((err, users) => {
                if (err) console.log(err);
                res.render('users', {users: users});
                sortAge = true;
            });
    });


    // search function to find an individual by name
    app.post('/search', (req, res) => {
        let Search = req.body.search;
        user.find({firstName: Search}, (err, person) => {
            if(err) console.log(err);
            res.render('users', {users: person});
        });
    });

    // from the user page, after a search, swap back to showing all users
    app.get('/list', (req, res) => {
        user.find({}, (err, people) => {
            if(err) console.log(err);
            res.render('users', {users: people});
        });
    });

    //port for server
    app.listen(3000, () => {
        console.log('listening on port 3000')
    });
});

//data dump












