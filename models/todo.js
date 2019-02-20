var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/todoAPI");

mongoose.Promise = global.Promise;

var todoSchema = mongoose.Schema({
    description : String,
    completed : Boolean 
});

module.exports = mongoose.model('Todo', todoSchema);