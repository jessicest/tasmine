function dragOver(event) {
    event.preventDefault();
    var slot = event.currentTarget;
    var day = slot.closest('.day');
    slot.classList.add('highlight');
    day.classList.add('highlight');
}

function dragLeave(event) {
    event.preventDefault();
    var slot = event.currentTarget;
    var day = slot.closest('.day');
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
    var slot = event.currentTarget;
    var box = slot.parentNode;
    var day = slot.closest('.day');
    slot.classList.remove('highlight');
    day.classList.remove('highlight');

    var task = document.getElementById(event.dataTransfer.getData('text/plain'));
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
    var slot = document.createElement('div');
    slot.classList.add('drop-target');
    slot.classList.add(className);
    slot.addEventListener('dragover', dragOver);
    slot.addEventListener('dragleave', dragLeave);
    slot.addEventListener('drop', drop);
    return slot;
}

function makeTask(dateString, i, j) {
    var taskBox = document.createElement('div');
    taskBox.classList.add('task-box');
    taskBox.id = 'task ' + dateString + ' ' + j;
    taskBox.setAttribute('draggable', true);
    taskBox.addEventListener('dragstart', dragStart);

    var task = document.createElement('div');
    task.classList.add('task');
    task.innerHTML = '<p>task ' + i + ' ' + j + '<input type="checkbox" /></p>';

    taskBox.appendChild(task);
    taskBox.appendChild(makeSlot('task-top'));
    taskBox.appendChild(makeSlot('task-bottom'));
    return taskBox;
}

function createDay(dayId, titleId, titleText, tasks) {
    var day = document.createElement('div');
    day.id = dayId;
    day.classList.add('day');

    var dayTitle = document.createElement('div');
    dayTitle.id = titleId;
    dayTitle.innerText = titleText;
    dayTitle.classList.add('title');
    day.appendChild(dayTitle);
    day.appendChild(makeSlot('day-top'));
    tasks.forEach(task => day.appendChild(task));
    day.appendChild(makeSlot('day-bottom'));

    return day;
}

function init() {
    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    document.body.addEventListener('dragend', dragEnd);

    var days = document.getElementById('days');

    days.appendChild(createDay('today', 'title today', 'Today', []));

    for (var i = 1; i < 5; ++i) {
        var date = new Date();
        date.setDate(date.getDate() + i);
        var dateString = date.toISOString();

        var day = createDay(
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

function pad(character, targetLength, string) {
    var s = '';
    for(var i = 0; i < targetLength - string.length; ++i) {
        s += character;
    }
    return s + string;
}

init();
