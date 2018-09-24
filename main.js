function handleDragStart(event) {
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
      // Set the source column's HTML to the HTML of the column we dropped on.
      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = event.dataTransfer.getData('text/html');
      // if the element is in the top half of the staged element
        // append it to the staging area above the staged element
      // if in bottom half
        // append to staging area below staged element
    }
  
    return false;
  }
}

function handleDragEnd(event) {
  // this/event.target is the source nodevent.

  [].forEach.call(cols, function (col) {
    col.classList.remove('over');
  });
}


var cols = document.querySelectorAll('#stagingArea .staged');
[].forEach.call(cols, function(col) {
  col.addEventListener('dragstart', handleDragStart, false);
  col.addEventListener('dragenter', handleDragEnter, false);
  col.addEventListener('dragover', handleDragOver, false);
  col.addEventListener('dragleave', handleDragLeave, false);
  col.addEventListener('drop', handleDrop, false);
  col.addEventListener('dragend', handleDragEnd, false);
});

var cols = document.querySelectorAll('#controls .controls');
[].forEach.call(cols, function(col) {
  col.addEventListener('dragstart', handleDragStart, false);
  col.addEventListener('dragenter', handleDragEnter, false);
  col.addEventListener('dragover', handleDragOver, false);
  col.addEventListener('dragleave', handleDragLeave, false);
  col.addEventListener('drop', handleDrop, false);
  col.addEventListener('dragend', handleDragEnd, false);
});

// Reset Button

const resetButton = document.getElementById('resetButton');
const stagingArea = document.getElementById('stagingArea');

resetButton.addEventListener('click', function(){
  stagingArea.innerHTML = ''
})