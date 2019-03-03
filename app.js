var mongoose = require("mongoose"),
    express = require("express"),
    expressSession = require("express-session"),
    bodyParser = require("body-parser"),
    ObjectID = require("mongodb").ObjectID,
    _ = require("lodash"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    bcrypt = require("bcryptjs");

var Todo = require("./models/todo"),
    User = require("./models/user"),
    {authenticate} = require("./middleware/authenticate");

var app = express();

app.use(bodyParser.json());

app.get("/api/todos", authenticate, (req, res) => {
    Todo.find({
        _creator : req.user._id
    }).then((todo) => {
        res.send({todo});
    });
    
});

app.post("/api/todos", authenticate, (req, res) => {
    
    var newTodo = new Todo({
        description : req.body.description,
        _creator : req.user._id
    });

    newTodo.save().then((todo) => {
        res.send(todo);
    }).catch( (err) => {
        res.send(err);
    });
});

app.get("/api/todos/:id", authenticate,(req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findOne({
        _id : id,
        _creator : req.user._id
    }).then((todo) => {

        if(!todo){
            return res.status(400).send();
        }

        res.send(todo);
        
    }).catch((e) => {
        res.send(e);
    });

});

app.patch("/api/todos/:id", authenticate, (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    
    var body = _.pick(req.body, ['description', 'completed']);

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneUpdate({
        _id : id,
        _creator : req.user._id
        }, {$set : body}, {new : true}).then((todo) => {

        if(!todo){
            return res.status(400).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.send(e);
    });
});

app.delete("/api/todos/:id", authenticate, (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findOneAndRemove({
        _id : id,
        _creator : req.user.id
    }).then((todo) => {

        if(!todo){
            return res.status(400).send();
        } 
        res.send({todo});
    }).catch((e) => {
        res.send(e);
    });

});

app.get("/user/ne", authenticate, (req, res) => {
   
    res.send(req.user);
});



app.post("/signup", function(req, res){
    
    var body = _.pick(req.body, ["username", "password"]);

    var user = new User(body);

    user.save().then((user) => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth' , token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    })
    
});

app.post("/login", (req, res) => {
    var body = _.pick(req.body, ['username', 'password']);

    User.findByCredentials(body.username, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });

    }).catch((e) => {
        res.status(400).send(e);
    })
});

app.delete("/user/me/token", authenticate, (req, res) => {

    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }).catch((e) => {
        res.status(400).send();
    })
})





app.listen(3000, () => {
    console.log("listening on 3000 !!!!!!!!!!!!!!!!!!");
});