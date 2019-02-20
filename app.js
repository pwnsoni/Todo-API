var mongoose = require("mongoose"),
    express = require("express"),
    bodyParser = require("body-parser"),
    ObjectID = require("mongodb").ObjectID;

var Todo = require("./models/todo");


var app = express();

app.use(bodyParser.json());

app.get("/api/todos", (req, res) => {
    Todo.find().then((todo) => {
        res.send({todo});
    });
    
});

app.post("/api/todos", (req, res) => {
    var newTodo = new Todo({
        description : req.body.description
    });

    newTodo.save().then((todo) => {
        res.send(todo);
    }).catch( (err) => {
        res.send(err);
    });
});

app.get("/api/todos/:id", (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {

        if(!todo){
            return res.status(400).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.send(e);
    });

});

app.delete("/api/todos/:id", (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo) => {

        if(!todo){
            return res.status(400).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.send(e);
    });

});




app.listen(3000, () => {
    console.log("listening on 3000 !!!!!!!!!!!!!!!!!!");
});