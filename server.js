const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // ✅ для CSS и JS

let tasks = [
  { id: 1, title: 'Вивчити Express.js', completed: false },
  { id: 2, title: 'Створити шаблон Pug', completed: true }
];
let nextId = 3;

// Pug налаштування
app.set('view engine', 'pug');
app.set('views', './views');

// --- API ---
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const newTask = { id: nextId++, title, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  task.completed = !task.completed;
  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  tasks.splice(index, 1);
  res.sendStatus(204);
});

// --- UI ---
app.get('/', (req, res) => res.redirect('/tasks'));
app.get('/tasks', (req, res) => res.render('tasks'));

app.listen(port, () => console.log(`✅ Сервер працює: http://localhost:${port}`));
