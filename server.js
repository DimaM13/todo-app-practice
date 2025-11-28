const express = require('express');
const path = require('path');
const Joi = require('joi');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Тимчасова база даних
let tasks = [];

const taskSchema = Joi.object({
    title: Joi.string().min(3).max(100).required()
});

app.get('/', (req, res) => {
    res.render('tasks', { tasks }); 
});

app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// 1. Додавання задачі
app.post('/api/tasks', (req, res) => {
    const { error, value } = taskSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newTask = {
        id: Date.now(),
        title: value.title,
        completed: false
    };
    tasks.push(newTask);
    res.status(201).json({ message: 'Задачу успішно створено!', task: newTask });
});

// 2. Зміна статусу (Виконано / Не виконано)
app.patch('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);

    if (!task) return res.status(404).json({ message: 'Задачу не знайдено' });

    task.completed = !task.completed; // Перемикаємо true/false
    res.json({ message: 'Статус оновлено', task });
});

// 3. Видалення задачі
app.delete('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = tasks.length;
    tasks = tasks.filter(t => t.id !== id);

    if (tasks.length === initialLength) {
        return res.status(404).json({ message: 'Задачу не знайдено' });
    }

    res.json({ message: 'Задачу видалено' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});