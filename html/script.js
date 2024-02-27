function dragOver(event) {
    event.preventDefault();
    event.target.parentNode.classList.add("highlight");
}

function dragLeave(event) {
    event.preventDefault();
    event.target.parentNode.classList.remove("highlight");
}

function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

function drop(event) {
    event.preventDefault();
    var slot = event.currentTarget;
    var box = slot.parentNode;
    var day;
    if (box.classList.contains('day')) {
        day = box;
    } else {
        day = box.parentNode;
    }
    day.classList.remove("highlight");

    var task = document.getElementById(event.dataTransfer.getData("text/plain"));
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
    task.innerText = 'task ' + i + ' ' + j;

    taskBox.appendChild(task);
    taskBox.appendChild(makeSlot('task-top'));
    taskBox.appendChild(makeSlot('task-bottom'));
    return taskBox;
}

function init() {
    var days = document.getElementById('days');
    for (var i = 1; i < 5; ++i) {
        var date = new Date();
        date.setDate(date.getDate() + i);
        var dateString = date.toISOString();

        var day = document.createElement('div');
        day.id = 'day ' + dateString;
        day.dataset.date = dateString;
        day.classList.add('day');

        var title = document.createElement('div');
        title.id = 'title ' + dateString;
        title.innerText = dateString;
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

init();
