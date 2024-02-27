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

function init() {
    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    document.body.addEventListener('dragend', dragEnd);

    var days = document.getElementById('days');
    for (var i = 1; i < 5; ++i) {
        var date = new Date();
        date.setDate(date.getDate() + i);
        var dateString = date.toISOString();

        var day = document.createElement('div');
        day.id = 'day ' + dateString;
        day.dataset.date = dateString;
        day.dataset.year = date.getFullYear();
        day.dataset.month = date.getMonth() + 1;
        day.dataset.day = date.getDate();
        day.dataset.weekday = date.getDay();
        day.classList.add('day');

        var title = document.createElement('div');
        title.id = 'title ' + dateString;
        title.innerText = daysOfWeek[date.getDay()] + ' ' + date.getDate();
        title.classList.add('title');
        day.appendChild(title);
        day.appendChild(makeSlot('day-top'));

        for (var j = 0; j < 3; ++j) {
            day.appendChild(makeTask(dateString, i, j));
        }
        day.appendChild(makeSlot('day-bottom'));

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
