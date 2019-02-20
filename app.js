var mongoose = require("mongoose"),
    express = require("express"),
    bodyParser = require("body-parser");

var Todo = require("./models/todo");


var app = express();

app.use(bodyParser.json());

app.get("/api/todos", (req, res) => {
    Todo.find().then((todo) => {
        res.send({todo});
    });
    // res.send("k");
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




app.listen(3000, () => {
    console.log("listening on 3000 !!!!!!!!!!!!!!!!!!");
});