let dragSrcEl = null;
let idCounter = 0;

function handleDragStart(event) {
  this.style.opacity = '0.4';
  dragSrcEl = this;

  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(event) {
  if (event.preventDefault) {
    event.preventDefault(); // Necessary. Allows us to drop.
  }

  event.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

  return false;
}

function handleDragEnter(event) {
  // this / event.target is the current hover target.
  this.classList.add('over');
}

function handleDragLeave(event) {
  this.classList.remove('over');  // this / event.target is previous target element.
}

function handleDrop(event) {
  // this / event.target is current target element.

  if (event.stopPropagation) {
    // this/event.target is current target element.
  
    if (event.stopPropagation) {
      event.stopPropagation(); // Stops some browsers from redirecting.
    }
  
    // Don't do anything if dropping the same column we're dragging.
    if (dragSrcEl != this) {
      
      // use this to check which container the dragged 
      // element is from: ---> dragSrcEl.parentNode.id
      
      // if doesnt exist in the staging area
      if (dragSrcEl.parentNode.id === 'controls') {
        // appends the div to the staging area
        const stagingArea = document.getElementById("stagingArea");
        let newStagedElement = dragSrcEl.cloneNode(true);
        newStagedElement.classList.remove('controls');
        newStagedElement.classList.add('staged');
        newStagedElement.setAttribute('id', idCounter++);
        stagingArea.appendChild(newStagedElement);
      } else {
        this.insertAdjacentElement('afterend', dragSrcEl);
      }
      // if exists then move it

      let stagedRows = document.querySelectorAll('#stagingArea .staged');
      [].forEach.call(stagedRows, function(stagedRow) {
        stagedRow.addEventListener('dragstart', handleDragStart, false);
        stagedRow.addEventListener('dragenter', handleDragEnter, false);
        stagedRow.addEventListener('dragover', handleDragOver, false);
        stagedRow.addEventListener('dragleave', handleDragLeave, false);
        stagedRow.addEventListener('drop', handleDrop, false);
        stagedRow.addEventListener('dragend', handleDragEnd, false);
      });
      // dragSrcEl.innerHTML = this.innerHTML;
      // this.innerHTML = event.dataTransfer.getData('text/html');
    }
  
    return false;
  }
}

function handleDragEnd(event) {
  // this/event.target is the source nodevent.
  this.style.opacity = '1';

  [].forEach.call(stagedRows, function (stagedRow) {
    stagedRow.classList.remove('over');
  });

  [].forEach.call(controlRows, function (controlRow) {
    controlRow.classList.remove('over');
  });
}

let stagedRows = document.querySelectorAll('#stagingArea .staged');
[].forEach.call(stagedRows, function(stagedRow) {
  stagedRow.addEventListener('dragstart', handleDragStart, false);
  stagedRow.addEventListener('dragenter', handleDragEnter, false);
  stagedRow.addEventListener('dragover', handleDragOver, false);
  stagedRow.addEventListener('dragleave', handleDragLeave, false);
  stagedRow.addEventListener('drop', handleDrop, false);
  stagedRow.addEventListener('dragend', handleDragEnd, false);
});

var controlRows = document.querySelectorAll('#controls .controls');
[].forEach.call(controlRows, function(controlRow) {
  controlRow.addEventListener('dragstart', handleDragStart, false);
  controlRow.addEventListener('dragenter', handleDragEnter, false);
  controlRow.addEventListener('dragover', handleDragOver, false);
  controlRow.addEventListener('dragleave', handleDragLeave, false);
  controlRow.addEventListener('drop', handleDrop, false);
  controlRow.addEventListener('dragend', handleDragEnd, false);
});