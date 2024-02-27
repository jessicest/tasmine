function dragOver(event) {
    event.preventDefault();
    event.target.classList.add("highlight");
}

function dragLeave(event) {
    event.preventDefault();
    event.target.classList.remove("highlight");
}

function dragStart(event) {
    console.log(event.target.id);
    event.dataTransfer.setData("text/plain", event.target.id);
}

function drop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove("highlight");
    console.log(event.dataTransfer.getData("text/plain"));
    var task = document.getElementById(event.dataTransfer.getData("text/plain"));
    var source = task.parentNode;
    var target = event.currentTarget.closest('.day');
    console.log(JSON.stringify(source));
    console.log(task);
    console.log(target);
    //source.removeChild(task);
    target.appendChild(task);
}
