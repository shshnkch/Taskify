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
    res.render('home');
});

app.get('/todo', async (req, res) => {
    const tasks = await ToDo.find({});
    res.render('todo', { tasks });
});

app.get('/todo/new', (req, res) => {
    res.render('new', { category, status, priority });
});

app.post('/todo', async (req, res) => {
    const newToDo = new ToDo(req.body);
    await newToDo.save();
    res.redirect('/todo');
});

app.get('/todo/:id/edit', async (req, res) => {
    const { id } = req.params;
    const task = await ToDo.findById(id);
    res.render('edit', { task, category, status, priority });
});

app.put('/todo/:id', async (req, res) => {
    const { id } = req.params;
    await ToDo.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect('/todo');
});

app.post('/todo/:id/updateStatus', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    await ToDo.findByIdAndUpdate(id, { status });
    res.redirect('/todo');
});

app.post('/todo/:id/delete', async (req, res) => {
    const { id } = req.params;
    await ToDo.findByIdAndDelete(id);
    res.redirect('/todo');
});
