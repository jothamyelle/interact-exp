let dragSrcEl = null;
let targetMiddle = 0;
let idCounter = 0;

// takes the current element and returns it's middle Y value
function getTargetMiddle(currentElement) {
  let divHeight = currentElement.offsetHeight;
  let targetPositionYTop = offset(currentElement).top;
  let targetPositionYBottom = targetPositionYTop + divHeight;
  targetMiddle = ((targetPositionYBottom - targetPositionYTop) / 2) + targetPositionYTop;
}

// copies the node being dragged, removes the controls class,
// adds the staged class, sets the id to a new number, and
// ensures the opacity goes back to normal
function duplicateDraggedControl() {
  let newStagedElement = dragSrcEl.cloneNode(true);
  newStagedElement.classList.remove('controls');
  newStagedElement.classList.add('staged');
  newStagedElement.setAttribute('id', idCounter++);
  newStagedElement.style.opacity = '1';
  return newStagedElement;
}

function handleElementInserts(currentElement, elementToDrop) {
  if(event.clientY < targetMiddle) {
    currentElement.insertAdjacentElement('beforebegin', elementToDrop);
  } else {
    currentElement.insertAdjacentElement('afterend', elementToDrop);
  }
}

// takes the current element and decides where to place to object in
// staging area, depending on where the border is displaying
function handleDropPlacement(currentElement) {
  // check if the drag is happening from controls area, or within the staging area
  if (dragSrcEl.parentNode.id === 'controls') {
    let newStagedElement = duplicateDraggedControl();
    handleElementInserts(currentElement, newStagedElement);
    
  } else {
    handleElementInserts(currentElement, dragSrcEl);
  }
}

// removes the irrelevant classes
function removeDragOverClasses(currentElement) {
  currentElement.classList && currentElement.classList.contains('over-top') ? currentElement.classList.remove('over-top') : false;
  currentElement.classList && currentElement.classList.contains('over-bottom') ? currentElement.classList.remove('over-bottom') : false;
}

function handleDragStart(event) {
  this.style.opacity = '0.4';
  dragSrcEl = this;

  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/html', this.innerHTML);
}

// gets the current object's location in the window
function offset(currentElement) {
  let rect = currentElement.getBoundingClientRect(),
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

function handleDragOver(event) {
  if (event.preventDefault) {
    event.preventDefault(); // Necessary. Allows us to drop.
  }
  getTargetMiddle(this);

  if(event.clientY < targetMiddle) {
    this.classList.add('over-top');
    this.classList && this.classList.contains('over-bottom') ? this.classList.remove('over-bottom') : false;
  } else {
    this.classList.add('over-bottom');
    this.classList && this.classList.contains('over-top') ? this.classList.remove('over-top') : false;
  }
  event.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

  return false;
}

function handleDragEnter(event) {
  // this / event.target is the current hover target.
}

function handleDragLeave(event) {
  this.classList && this.classList.contains('over-top') ? this.classList.remove('over-top') : false;
  this.classList && this.classList.contains('over-bottom') ? this.classList.remove('over-bottom') : false;
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
      // deal with the drop placement
      getTargetMiddle(this);
      handleDropPlacement(this);
      removeDragOverClasses(this);

      // get rid of the placeholder item
      if(document.getElementById("beginnerItem")) {
        document.getElementById("beginnerItem").remove();
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
    }
  
    return false;
  }
}

function handleDragEnd(event) {
  // this/event.target is the source nodevent.
  this.style.opacity = '1';

  [].forEach.call(stagedRows, function (stagedRow) {
      removeDragOverClasses(this);
  });

  [].forEach.call(controlRows, function (controlRow) {
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
