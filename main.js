let dragSrcEl = null;
let targetMiddle = 0;
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
  removeDragOverClasses(this);
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
        addAllEventListeners(stagedRow);
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
  addAllEventListeners(stagedRow);
});

var controlRows = document.querySelectorAll('#controls .controls');
[].forEach.call(controlRows, function(controlRow) {
  addAllEventListeners(controlRow);
});

// Save Button

function addSaveButtonListener() {
  const saveButton = document.getElementById('saveButton');
  const savedFormTemplate = [];
  saveButton.addEventListener('click', function() {
 
    const controls = stagingArea.getElementsByClassName('staged');
    Array.prototype.forEach.call(controls, function(control) {
      const templateField = {}
      templateField.type = control.dataset.type;
      templateField.label = control.querySelectorAll('label')[0].textContent;
      savedFormTemplate.push(templateField);
    })
  
    console.log(JSON.stringify(savedFormTemplate));
    return JSON.stringify(savedFormTemplate);
  })
}

addResetButtonListener();
addSaveButtonListener();
addDeleteButtonListener();
addDuplicateButtonListener();
