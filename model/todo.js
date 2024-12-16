const mongoose = require('mongoose');

const toDoListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true
    },
    status: {
        type: String,
        enum: ['Completed','Pending', 'In Progress'],
    },
    category: {
        type: String,
        enum: ['Work', 'Personal', 'Shopping']
    }
});

const ToDo = mongoose.model('Todo', toDoListSchema);

module.exports = ToDo;