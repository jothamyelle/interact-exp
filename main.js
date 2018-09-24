let dragSrcEl = null;
let idCounter = 0;

function handleDragStart(event) {
  this.style.opacity = '0.4';
  dragSrcEl = this;

  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/html', this.innerHTML);
}

function offset(el) {
  let rect = el.getBoundingClientRect(),
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

function handleDragOver(event) {
  if (event.preventDefault) {
    event.preventDefault(); // Necessary. Allows us to drop.
  }
  let targetPositionYTop = offset(this).top;
  let targetPositionYBottom = targetPositionYTop + 50;
  let targetMiddle = ((targetPositionYBottom - targetPositionYTop) / 2) + targetPositionYTop;

  if(event.clientY < targetMiddle) {
    this.classList.add('over-top');
    this.classList && this.classList.contains('over') ? this.classList.remove('over') : false;
    this.classList && this.classList.contains('over-bottom') ? this.classList.remove('over-bottom') : false;
  } else {
    this.classList.add('over-bottom');
    this.classList && this.classList.contains('over') ? this.classList.remove('over') : false;
    this.classList && this.classList.contains('over-top') ? this.classList.remove('over-top') : false;
  }
  event.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

  return false;
}

function handleDragEnter(event) {
  // this / event.target is the current hover target.
  this.classList.add('over');
}

function handleDragLeave(event) {
  this.classList && this.classList.contains('over') ? this.classList.remove('over') : false;  // this / event.target is previous target element.
  this.classList && this.classList.contains('over-top') ? this.classList.remove('over-top') : false;
  this.classList && this.classList.contains('over-bottom') ? this.classList.remove('over-bottom') : false;
}

function handleDrop(event) {
  // this / event.target is current target element.
  console.log("'this' y location:", event.clientY);

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
        newStagedElement.style.opacity = '1';

        //get some positions for the element you're hovering over
        let targetPositionYTop = offset(this).top;
        let targetPositionYBottom = targetPositionYTop + 50;
        let targetMiddle = ((targetPositionYBottom - targetPositionYTop) / 2) + targetPositionYTop;

        if(event.clientY < targetMiddle) {
          this.insertAdjacentElement('beforebegin', newStagedElement);
        } else {
          this.insertAdjacentElement('afterend', newStagedElement);
        }
        this.classList && this.classList.contains('over') ? this.classList.remove('over') : false;
        this.classList && this.classList.contains('over-top') ? this.classList.remove('over-top') : false;
        this.classList && this.classList.contains('over-bottom') ? this.classList.remove('over-bottom') : false;
        // get rid of the placeholder item
        if(document.getElementById("beginnerItem")) {
          document.getElementById("beginnerItem").remove();
        }
      } else {
        //get some positions for the element you're hovering over
        let targetPositionYTop = offset(this).top;
        let targetPositionYBottom = targetPositionYTop + 50;
        let targetMiddle = ((targetPositionYBottom - targetPositionYTop) / 2) + targetPositionYTop;
        if(event.clientY < targetMiddle) {
          this.insertAdjacentElement('beforebegin', dragSrcEl);
        } else {
          this.insertAdjacentElement('afterend', dragSrcEl);
        }
        this.classList && this.classList.contains('over') ? this.classList.remove('over') : false;
        this.classList && this.classList.contains('over-top') ? this.classList.remove('over-top') : false;
        this.classList && this.classList.contains('over-bottom') ? this.classList.remove('over-bottom') : false;
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
    stagedRow.classList.remove('over');
    this.classList && this.classList.contains('over-top') ? this.classList.remove('over-top') : false;
    this.classList && this.classList.contains('over-bottom') ? this.classList.remove('over-bottom') : false;
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
