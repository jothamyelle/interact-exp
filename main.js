let dragSrcEl = null;
let targetMiddle = 0;
let idCounter = 0;

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
      if(document.getElementById('beginnerItem')) {
        document.getElementById('beginnerItem').remove();
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

//  Beginner item

// {/* <div id="beginnerItem" class="staged">Drop Stuff Here</div> */}

function createbeginnerItem() {
  beginnerItem = document.createElement('div');
  beginnerItem.setAttribute('id', 'beginnerItem');
  beginnerItem.classList.add('staged');
  beginnerItem.textContent = 'Drop Stuff Here';
  beginnerItem.addEventListener('dragstart', handleDragStart, false);
  beginnerItem.addEventListener('dragenter', handleDragEnter, false);
  beginnerItem.addEventListener('dragover', handleDragOver, false);
  beginnerItem.addEventListener('dragleave', handleDragLeave, false);
  beginnerItem.addEventListener('drop', handleDrop, false);
  beginnerItem.addEventListener('dragend', handleDragEnd, false);

  
  return beginnerItem;
}


// Reset Button

const resetButton = document.getElementById('resetButton');
const stagingArea = document.getElementById('stagingArea');

resetButton.addEventListener('click', function() {
  const confirmation = confirm('Are you sure?');
  if (confirmation) {
    stagingArea.innerHTML = '';
    stagingArea.append(createbeginnerItem());
  }
})

// Control Handlers

// Helpers

function addDeleteListener(button) {
  button.addEventListener('click', function() {
    button.parentElement.remove();
    console.log('The staging area is', stagingArea.innerHTML);
    if(!stagingArea.innerHTML.trim()) {
      stagingArea.append(createbeginnerItem());
    }
  })
}

function addDuplicateListener(button) {
  button.addEventListener('click', function() {
    const control = button.parentElement;
    const clone = control.cloneNode(true);
    
    const cloneDelete = clone.getElementsByClassName('deleteControl')[0];
    addDeleteListener(cloneDelete);
    
    const cloneDuplicate = clone.getElementsByClassName('duplicateControl')[0];
    addDuplicateListener(cloneDuplicate);
    control.parentElement.insertBefore(clone, control);

    clone.addEventListener('dragstart', handleDragStart, false);
    clone.addEventListener('dragenter', handleDragEnter, false);
    clone.addEventListener('dragover', handleDragOver, false);
    clone.addEventListener('dragleave', handleDragLeave, false);
    clone.addEventListener('drop', handleDrop, false);
    clone.addEventListener('dragend', handleDragEnd, false);

  })
}


// Delete Buttons

const deleteButtons = document.getElementsByClassName('deleteControl');

Array.prototype.forEach.call(deleteButtons, function(button) {
  addDeleteListener(button);
})

// Duplicate Buttons

const duplicateButtons = document.getElementsByClassName('duplicateControl');

Array.prototype.forEach.call(duplicateButtons, function(button) {
  addDuplicateListener(button);
})
