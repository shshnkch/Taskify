const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const ToDo = require('./model/todo.js');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

mongoose.set('strictQuery', true);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

mongoose.connect('mongodb://127.0.0.1:27017/toDoList')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection failed:', err));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const category = ['Work', 'Personal', 'Shopping'];
const status = ['Pending', 'In Progress', 'Completed'];
const priority = ['Low', 'Medium', 'High'];

app.listen(3000, () => console.log('Listening on port 3000'));

app.get('/home', (req, res) => {
    try {
        res.render('home');
    } catch (err) {
        res.status(500).send('Error loading home page');
    }
});

app.get('/todo', async (req, res) => {
    try {
        const tasks = await ToDo.find({});
        res.render('todo', { tasks });
    } catch (err) {
        res.status(500).send('Error fetching tasks');
    }
});

app.get('/todo/new', (req, res) => {
    try {
        res.render('new', { category, status, priority });
    } catch (err) {
        res.status(500).send('Error loading new task form');
    }
});

app.post('/todo', async (req, res) => {
    try {
        const newToDo = new ToDo(req.body);
        await newToDo.save();
        res.redirect('/todo');
    } catch (err) {
        res.status(400).send('Error creating new task: ' + err.message);
    }
});

app.get('/todo/:id/edit', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await ToDo.findById(id);
        if (!task) {
            return res.status(404).send('Task not found');
        }
        res.render('edit', { task, category, status, priority });
    } catch (err) {
        res.status(500).send('Error loading edit form');
    }
});

app.put('/todo/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTask = await ToDo.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
        if (!updatedTask) {
            return res.status(404).send('Task not found');
        }
        res.redirect('/todo');
    } catch (err) {
        res.status(400).send('Error updating task: ' + err.message);
    }
});

app.post('/todo/:id/updateStatus', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedTask = await ToDo.findByIdAndUpdate(id, { status });
        if (!updatedTask) {
            return res.status(404).send('Task not found');
        }
        res.redirect('/todo');
    } catch (err) {
        res.status(400).send('Error updating task status: ' + err.message);
    }
});

app.post('/todo/:id/delete', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await ToDo.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).send('Task not found');
        }
        res.redirect('/todo');
    } catch (err) {
        res.status(500).send('Error deleting task');
    }
});
