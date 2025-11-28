// Додавання задачі
document.getElementById('addTaskBtn').addEventListener('click', async () => {
    const input = document.getElementById('taskInput');
    const title = input.value;

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title })
        });
        const data = await response.json();

        if (response.status === 201) {
            iziToast.success({ 
                title: 'Успіх', 
                message: data.message, 
                position: 'topRight' 
            });
            input.value = '';
            setTimeout(() => location.reload(), 1000);
        } else if (response.status === 400) {
            iziToast.error({ 
                title: 'Помилка', 
                message: data.message, 
                position: 'topRight' 
            });
        }
    } catch (err) { console.error(err); }
});

// НОВА ФУНКЦІЯ: Зміна статусу з нотифікацією
async function toggleTask(id) {
    try {
        const response = await fetch(`/api/tasks/${id}`, { method: 'PATCH' });
        const data = await response.json();

        if (response.ok) {
            // Дивимося, стала задача виконаною (true) чи ні (false)
            const isCompleted = data.task.completed;
            
            // Показуємо повідомлення
            iziToast.info({
                title: 'Статус',
                // Якщо виконали - пишемо "Виконано", якщо зняли галочку - "Відновлено"
                message: isCompleted ? 'Задачу виконано!' : 'Задачу відновлено!',
                position: 'topRight',
                color: isCompleted ? 'green' : 'blue' // Можна навіть колір змінювати
            });

            // Чекаємо 1 секунду, щоб користувач побачив повідомлення, потім оновлюємо
            setTimeout(() => location.reload(), 1000); 
        }
    } catch (err) { console.error(err); }
}

// Видалення задачі
async function deleteTask(id) {
    if(!confirm('Видалити цю задачу?')) return;

    try {
        const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        if (response.ok) {
            iziToast.warning({ 
                title: 'Видалено', 
                message: 'Задачу успішно видалено', 
                position: 'topRight' 
            });
            setTimeout(() => location.reload(), 1000);
        }
    } catch (err) { console.error(err); }
}