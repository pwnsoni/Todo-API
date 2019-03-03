var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/todoAPI");

mongoose.Promise = global.Promise;

var todoSchema = mongoose.Schema({
    description : {
        type: String,
        required: true
      },
    completed : {
        type: Boolean,
        default : false
      },
    completedAt : {
        type: Date,
        required: false
      },
      _creator : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
      } 
});

module.exports = mongoose.model('Todo', todoSchema);