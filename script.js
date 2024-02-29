
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

function makeTask(row) {
    const id = row[0];
    const name = row[2];
    const checked = (row[3] === true || row[3] === 'TRUE') ? 'CHECKED ' : '';

    const taskBox = document.createElement('div');
    taskBox.classList.add('task-box');
    taskBox.id = `task ${id}`;
    taskBox.setAttribute('draggable', true);
    taskBox.addEventListener('dragstart', dragStart);

    const task = document.createElement('div');
    task.classList.add('task');
    task.innerHTML = `${name}<input type="checkbox" ${checked}/>`;

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
    tasks.forEach(task => day.appendChild(makeTask(task)));
    day.appendChild(makeSlot('day-bottom'));

    return day;
}

async function init() {
    try {
        document.body.addEventListener('dragend', dragEnd);
        const urlParams = new URLSearchParams(window.location.search);

        if (window.location.hostname === 'localhost' || urlParams.get('sample') != null) {
            rebuildSample();
        } else {
            await initDatabase();
            await login();
            const rows = await loadFromDatabase();
            rebuild(rows);
        }
    }
    catch (error) {
        document.getElementById('debug').innerText = error;
        throw error;
    }
}

function rebuild(rows) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const dateStrings = rows.map(row => row[1]).filter(s => s !== 'Today').sort();

    const days = document.getElementById('days');
    days.innerHTML = '';
    days.appendChild(createDay(
        'today',
        'title today',
        'Today',
        rows.filter(row => row[1] === 'Today')));

    dateStrings.forEach(dateString => {
        const date = new Date(dateString);
        const day = createDay(
            `day ${dateString}`,
            `title ${dateString}`,
            `${daysOfWeek[date.getDay()]} ${date.getDate()}`,
            rows.filter(row => row[1] === dateString));

        day.dataset.date = dateString;
        day.dataset.year = date.getFullYear();
        day.dataset.month = date.getMonth() + 1;
        day.dataset.day = date.getDate();
        day.dataset.weekday = date.getDay();
        days.appendChild(day);
    });
}

function rebuildSample() {
    const rows = [1, 2, 3, 4, 5].map(i => {
        return [0, 1, 2].map(j => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const dateString = date.toLocaleDateString('en-AU', { year: 'numeric', month: '2-digit', day: '2-digit' });
            const name = `task ${i} ${j}`;

            return [name, dateString, name, false];
        });
    }).flat();

    console.log(rows);

    rebuild(rows);
}

Promise.all([init()]);
