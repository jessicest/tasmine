
let taskData = [];

function dragOver(event) {
    event.preventDefault();
    const slot = event.currentTarget;
    const day = slot.closest('.day');
    slot.classList.add('highlight');
    day.classList.add('highlight');
}

function dragLeave(event) {
    event.preventDefault();
    const slot = event.currentTarget;
    const day = slot.closest('.day');
    slot.classList.remove('highlight');
    day.classList.remove('highlight');
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    document.body.classList.add('dragging');
}

function dragEnd(event) {
    document.body.classList.remove('dragging');
}

function drop(event) {
    event.preventDefault();
    const slot = event.currentTarget;
    const box = slot.parentNode;
    const day = slot.closest('.day');
    slot.classList.remove('highlight');
    day.classList.remove('highlight');

    const task = document.getElementById(event.dataTransfer.getData('text/plain'));
    if (slot.classList.contains('day-top')) {
        day.insertBefore(task, slot.nextSibling);
    } else if (slot.classList.contains('day-bottom')) {
        day.insertBefore(task, slot);
    } else if (slot.classList.contains('task-top')) {
        day.insertBefore(task, box);
    } else if (slot.classList.contains('task-bottom')) {
        day.insertBefore(task, box.nextSibling);
    }
}

function makeSlot(className) {
    const slot = document.createElement('div');
    slot.classList.add('drop-target');
    slot.classList.add(className);
    slot.addEventListener('dragover', dragOver);
    slot.addEventListener('dragleave', dragLeave);
    slot.addEventListener('drop', drop);
    return slot;
}

function makeTask(dateString, i, j) {
    const taskBox = document.createElement('div');
    taskBox.classList.add('task-box');
    taskBox.id = 'task ' + dateString + ' ' + j;
    taskBox.setAttribute('draggable', true);
    taskBox.addEventListener('dragstart', dragStart);

    const task = document.createElement('div');
    task.classList.add('task');
    task.innerHTML = '<p>task ' + i + ' ' + j + '<input type="checkbox" /></p>';

    taskBox.appendChild(task);
    taskBox.appendChild(makeSlot('task-top'));
    taskBox.appendChild(makeSlot('task-bottom'));
    return taskBox;
}

function createDay(dayId, titleId, titleText, tasks) {
    const day = document.createElement('div');
    day.id = dayId;
    day.classList.add('day');

    const dayTitle = document.createElement('div');
    dayTitle.id = titleId;
    dayTitle.innerText = titleText;
    dayTitle.classList.add('title');
    day.appendChild(dayTitle);
    day.appendChild(makeSlot('day-top'));
    tasks.forEach(task => day.appendChild(task));
    day.appendChild(makeSlot('day-bottom'));

    return day;
}

async function init() {
    try {
        document.body.addEventListener('dragend', dragEnd);
        const urlParams = new URLSearchParams(window.location.search);

        if (window.location.hostname === 'localhost' || urlParams.get('sample') != null) {
            initSampleData();
        } else {
            const rows = await initDatabase();
            await rebuild(rows);
        }
    }
    catch (error) {
        document.getElementById('debug').innerText = error;
        throw error;
    }
}

function rebuild(rows) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const dateStrings = rows.map(row => row[0]).filter(s => s !== 'Today').sort();

    const days = document.getElementById('days');
    days.innerHTML = '';
    days.appendChild(createDay(
        'today',
        'title today',
        'Today',
        rows.filter(row => row[0] === 'Today').map(row => (row[1], row[2]))));

    dateStrings.forEach(dateString => {
        const date = new Date(dateString);
        const day = createDay(
            'day ' + dateString,
            'title ' + dateString,
            daysOfWeek[date.getDay()] + ' ' + date.getDate(),
            rows.filter(row => row[0] === dateString).map(row => (row[1], row[2])));

        day.dataset.date = dateString;
        day.dataset.year = date.getFullYear();
        day.dataset.month = date.getMonth() + 1;
        day.dataset.day = date.getDate();
        day.dataset.weekday = date.getDay();
        days.appendChild(day);
    });
}

function initSampleData() {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const days = document.getElementById('days');
    days.appendChild(createDay('today', 'title today', 'Today', []));

    for (let i = 1; i < 5; ++i) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString();

        const day = createDay(
            'day ' + dateString,
            'title ' + dateString,
            daysOfWeek[date.getDay()] + ' ' + date.getDate(),
            [0, 1, 2].map(j => makeTask(dateString, i, j)));

        day.dataset.date = dateString;
        day.dataset.year = date.getFullYear();
        day.dataset.month = date.getMonth() + 1;
        day.dataset.day = date.getDate();
        day.dataset.weekday = date.getDay();

        days.appendChild(day);
    }
}

Promise.all([init()]);
