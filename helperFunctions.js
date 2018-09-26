// gets the current object's location in the window
function offset(currentElement) {
  let rect = currentElement.getBoundingClientRect(),
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

// takes the current element and returns it's middle Y value
function getTargetMiddle(currentElement) {
  let divHeight = currentElement.offsetHeight;
  let targetPositionYTop = offset(currentElement).top;
  let targetPositionYBottom = targetPositionYTop + divHeight;
  targetMiddle = ((targetPositionYBottom - targetPositionYTop) / 2) + targetPositionYTop;
}

function addAllEventListeners(currentElement) {
  currentElement.addEventListener('dragstart', handleDragStart, false);
  currentElement.addEventListener('dragenter', handleDragEnter, false);
  currentElement.addEventListener('dragover', handleDragOver, false);
  currentElement.addEventListener('dragleave', handleDragLeave, false);
  if (currentElement.parentNode.id === 'stagingArea') {
    currentElement.addEventListener('drop', handleDrop, false);
  }
  currentElement.addEventListener('dragend', handleDragEnd, false);
}

// Change Option to form control

function createDeleteButton() {
  const button = document.createElement('button');
  button.classList.add('deleteControl');
  button.innerHTML = 'Delete';
  return button;
}

function createDuplicateButton() {
  const button = document.createElement('button');
  button.classList.add('duplicateControl');
  button.innerHTML = 'Duplicate';
  return button;
}

function createFormInput(inputType) {
  if (inputType === 'textarea') {
    return document.createElement('textarea');
  }
  if (inputType === 'select') {
    return document.createElement('select');
  }  
  if (inputType === 'select multiple') {
    const input = document.createElement('select');
    input.setAttribute('multiple', '');
    return input;
  }
  const input = document.createElement('input');
  input.setAttribute('type', inputType);
  return input;
}

function turnToFormControl(node) {

  const inputType = node.dataset.type;
  node.append(createFormInput(inputType));

  const deleteButton = createDeleteButton();
  node.append(deleteButton);
  addDeleteListener(deleteButton);
  
  const duplicateButton = createDuplicateButton();
  node.prepend(duplicateButton);
  addDuplicateListener(duplicateButton);

  controlClickDisplayOptions(node);
  
  return node;
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
  turnToFormControl(newStagedElement);
  return newStagedElement;
}

function handleElementInserts(currentElement, elementToDrop) {
  if(event.clientY < targetMiddle) {
    currentElement.insertAdjacentElement('beforebegin', elementToDrop);
  } else {
    currentElement.insertAdjacentElement('afterend', elementToDrop);
  }
}

function createAppropriateOptionsList(currentElement) {
  let options = {};

  // check the current element's title to see what type of input it is
  // and change the options accordingly
  switch(currentElement.title)  {
    case 'Form Title':
      options = {
        id: currentElement.id,
        type: 'title',
        value: ''
      }
    break;
    case 'Section Header':
      options = {
        id: currentElement.id,
        type: 'header',
        value: ''
      }
    break;
    case 'Question or instructions to fill the field':
      options = {
        id: currentElement.id,
        type: 'paragraph',
        value: ''
      }
    break;
    case 'Checkbox':
      options = {
        id: currentElement.id,
        type: 'checkbox',
        label: '',
        checkOptions: [],
        required: false
      }
    break;
    case 'Radio Button':
      options = {
        id: currentElement.id,
        type: 'radio',
        label: '',
        radioOptions: [],
        required: false
      }
    break;
    case 'Select':
      options = {
        id: currentElement.id,
        type: 'select',
        label: '',
        selectOptions: [],
        required: false
      }
    break;
    case 'Select Multiple':
      options = {
        id: currentElement.id,
        type: 'selectMultiple',
        label: '',
        selectMultipleOptions: [],
        required: false,
        multiple: true
      }
    break;
    case 'Text':
      options = {
        id: currentElement.id,
        type: 'text',
        label: '',
        maxlength: 255,
        required: false,
        placeholder: ''
      }
    break;
    case 'Text Area':
      options = {
        id: currentElement.id,
        type: 'textarea',
        label: '',
        maxlength: 255,
        required: false,
        placeholder: ''
      }
    break;
    case 'Date':
      options = {
        id: currentElement.id,
        type: 'date',
        label: '',
        required: false
      }
    break;
    case 'Time':
      options = {
        id: currentElement.id,
        type: 'time',
        label: '',
        required: false
      }
    break;
    case 'Number':
      options = {
        id: currentElement.id,
        type: 'number',
        label: '',
        maxlength: 255,
        required: false,
        placeholder: ''
      }
    break;
    case 'Email':
      options = {
        id: currentElement.id,
        type: 'email',
        label: '',
        maxlength: 255,
        required: false,
        placeholder: ''
      }
    break;
  }

  listOfDisplayOptions[currentElement.id] = options;
}

function updateCheckboxOption(currentElement, option, index) {
  listOfDisplayOptions[currentElement.id].checkOptions[index] = option.value;
}

function addCheckboxOption(elementId) {
  let checkboxInputs = document.getElementsByClassName('checkboxOption');
  let checkboxInput = checkboxInputs[checkboxInputs.length - 1]
  let newRow = checkboxInput.cloneNode();
  checkboxInput.insertAdjacentElement('afterend', newRow);
  newRow.value = '';
  listOfDisplayOptions[elementId].checkOptions[checkboxInputs.length - 1] = newRow.value;
  let elementObject = document.getElementById(elementId);
  let index = checkboxInputs.length - 1;
  newRow.addEventListener('keyup', event => {
    updateCheckboxOption(elementObject, newRow, index);
  });
}

function updateRadioOption(currentElement, option, index) {
  listOfDisplayOptions[currentElement.id].radioOptions[index] = option.value;
}

function addRadioOption(elementId) {
  let radioInputs = document.getElementsByClassName('radioOption');
  let radioInput = radioInputs[radioInputs.length - 1]
  let newRow = radioInput.cloneNode();
  radioInput.insertAdjacentElement('afterend', newRow);
  newRow.value = '';
  listOfDisplayOptions[elementId].radioOptions[radioInputs.length - 1] = newRow.value;
  let elementObject = document.getElementById(elementId);
  let index = radioInputs.length - 1;
  newRow.addEventListener('keyup', event => {
    updateRadioOption(elementObject, newRow, index);
  });
}

function displayAppropriateOptions(elementObject) {
  let htmlToDisplay = "";
  // console.log(elementObject)
  switch(elementObject.type) {
    case 'title':
    htmlToDisplay += `
      <label>Form Title</label>
      <input type="text" class="formTitleValue" value="${elementObject.value}"/>
    `;
    break;
    case 'header':
    htmlToDisplay += `
      <label>Section Header</label>
      <input type="text" class="headerValue" value="${elementObject.value}"/>
    `;
    break;
    case 'paragraph':
    htmlToDisplay += `
      <label>Instructions or Question</label>
      <textarea class="instructionsValue"/>${elementObject.value}</textarea>
    `;
    break;
    case 'checkbox':
      let checkOptionsArray = listOfDisplayOptions[elementObject.id].checkOptions;
      htmlToDisplay += `
      <label>Label</label>
      <input type="text" class="checkLabel" value="${elementObject.label}"/>
      <label>Checkbox Options</label>`;
      if(checkOptionsArray.length > 0) {
        checkOptionsArray.forEach((option, index) => {
          htmlToDisplay += `
          <input type="text" class="checkboxOption" value="${checkOptionsArray[index]}"/>`;
        });
      } else {
        htmlToDisplay += `
        <input type="text" class="checkboxOption"/>`;
      }
      htmlToDisplay += `
      <button onclick="addCheckboxOption(${elementObject.id})">+ Add Row</button>
      <br/>
      <label>Required</label>
      <input type="checkbox" class="checkRequired"/>
      `;
    break;
    case 'radio':
    let radioOptionsArray = listOfDisplayOptions[elementObject.id].radioOptions;
    console.log("radioOptionsArray:", radioOptionsArray);
    htmlToDisplay += `
      <label>Label</label>
      <input type="text" class="radioLabel" value="${elementObject.label}"/>
      <label>radio Multiple Options</label>`;
      if(radioOptionsArray.length > 0) {
        radioOptionsArray.forEach((option, index) => {
          htmlToDisplay += `
          <input type="text" class="radioOption" value="${radioOptionsArray[index]}"/>`;
        });
      } else {
        htmlToDisplay += `
        <input type="text" class="radioOption"/>`;
      }
      htmlToDisplay += `
      <button onclick="addRadioOption(${elementObject.id})">+ Add Row</button>
      <label>Required</label>
      <input type="checkbox" class="radioRequired"/>
      `;
    break;
    case 'select':
    htmlToDisplay += `
      <label>Label</label>
      <input type="text" class="selectLabel" value="${elementObject.label}"/>
      <label>Select Multiple Options</label>
      <input type="text" class="selectOption"/>
      <input type="text" class="selectOption"/>
      <input type="text" class="selectOption"/>
      <label>Required</label>
      <input type="checkbox" class="selectRequired"/>
      `;
    break;
    case 'selectMultiple':
    htmlToDisplay += `
      <label>Label</label>
      <input type="text" class="selectMultipleLabel" value="${elementObject.label}"/>
      <label>Select Multiple Options</label>
      <input type="text" class="selectMultipleOption"/>
      <input type="text" class="selectMultipleOption"/>
      <input type="text" class="selectMultipleOption"/>
      <label>Required</label>
      <input type="checkbox" class="selectMultipleRequired"/>
      `;
    break;
    case 'text':
    htmlToDisplay += `
      <label>Label</label>
      <input type="text" class="textLabel" value="${elementObject.label}"/>
      <label>Placeholder</label>
      <input type="text" class="textPlaceholder" value="${elementObject.placeholder}"/>
      <label>Required</label>
      <input type="checkbox" class="textRequired"/>
      <label>Maximum Length</label>
      <input type="number" class="textMaxlength" value="${elementObject.maxlength}"/>
      `;
    break;
    case 'textarea':
    htmlToDisplay += `
      <label>Label</label>
      <input type="text" class="textareaLabel" value="${elementObject.label}"/>
      <label>Placeholder</label>
      <input type="text" class="textareaPlaceholder" value="${elementObject.placeholder}"/>
      <label>Required</label>
      <input type="checkbox" class="textareaRequired"/>
      <label>Maximum Length</label>
      <input type="number" class="textareaMaxlength" value="${elementObject.maxlength}"/>
      `;
    break;
    case 'date':
    htmlToDisplay += `
      <label>Label</label>
      <input type="text" class="dateLabel" value="${elementObject.label}"/>
      <label>Required</label>
      <input type="checkbox" class="dateRequired"/>
      `;
    break;
    case 'time':
    htmlToDisplay += `
      <label>Label</label>
      <input type="text" class="timeLabel" value="${elementObject.label}"/>
      <label>Required</label>
      <input type="checkbox" class="timeRequired"/>
      `;
    break;
    case 'number':
    htmlToDisplay += `
      <label>Label</label>
      <input type="text" class="numberLabel" value="${elementObject.label}"/>
      <label>Placeholder</label>
      <input type="number" class="numberPlaceholder" value="${elementObject.placeholder}"/>
      <label>Required</label>
      <input type="checkbox" class="numberRequired"/>
      <label>Maximum Length</label>
      <input type="number" class="numberMaxlength" value="${elementObject.maxlength}"/>
      `;
    break;
    case 'email':
      htmlToDisplay += `
      <label>Label</label>
      <input type="text" class="emailLabel" value="${elementObject.label}"/>
      <label>Placeholder</label>
      <input type="text" class="emailPlaceholder" value="${elementObject.placeholder}"/>
      <label>Required</label>
      <input type="checkbox" class="emailRequired"/>
      <label>Maximum Length</label>
      <input type="number" class="emailMaxlength" value="${elementObject.maxlength}"/>
      `;
    break;
  }

  let optionsList = document.getElementById('optionsList');
  optionsList.innerHTML = '';
  optionsList.insertAdjacentHTML('afterbegin', htmlToDisplay);
  Array.from(document.getElementsByClassName('checkboxOption')).forEach(function(option, index) {
    option.addEventListener('keyup', event => {
      updateCheckboxOption(elementObject, option, index);
    });
  });
  Array.from(document.getElementsByClassName('radioOption')).forEach(function(option, index) {
    option.addEventListener('keyup', event => {
      updateRadioOption(elementObject, option, index);
    });
  });

  addOptionListeners('formTitleValue', elementObject, 'value');
  addOptionListeners('headerValue', elementObject, 'value');
  addOptionListeners('instructionsValue', elementObject, 'value');
  addOptionListeners('checkLabel', elementObject, 'label');
  addOptionListeners('radioLabel', elementObject, 'label');
  addOptionListeners('selectLabel', elementObject, 'label');
  addOptionListeners('selectMultipleLabel', elementObject, 'label');
  addOptionListeners('textLabel', elementObject, 'label');
  addOptionListeners('textareaLabel', elementObject, 'label');
  addOptionListeners('dateLabel', elementObject, 'label');
  addOptionListeners('timeLabel', elementObject, 'label');
  addOptionListeners('numberLabel', elementObject, 'label');
  addOptionListeners('emailLabel', elementObject, 'label');

  addOptionListeners('textPlaceholder', elementObject, 'placeholder');
  addOptionListeners('textareaPlaceholder', elementObject, 'placeholder');
  addOptionListeners('numberPlaceholder', elementObject, 'placeholder');
  addOptionListeners('emailPlaceholder', elementObject, 'placeholder');

  addOptionListeners('textMaxlength', elementObject, 'maxlength');
  addOptionListeners('textareaMaxlength', elementObject, 'maxlength');
  addOptionListeners('numberMaxlength', elementObject, 'maxlength');
  addOptionListeners('emailMaxlength', elementObject, 'maxlength');




  
}

function addOptionListeners(className, elementObject, prop) {
  Array.from(document.getElementsByClassName(className)).forEach(function (element) {
    element.addEventListener('keyup', function() {
      listOfDisplayOptions[elementObject.id][prop] = element['value'];
      console.log(listOfDisplayOptions[elementObject.id])
    })
  })
}

// takes the current element and decides where to place to object in
// staging area, depending on where the border is displaying
function handleDropPlacement(currentElement) {
  // check if the drag is happening from controls area, or within the staging area
  if (dragSrcEl.parentNode.id === 'controls') {
    let newStagedElement = duplicateDraggedControl();
    handleElementInserts(currentElement, newStagedElement);
    createAppropriateOptionsList(newStagedElement);
    displayAppropriateOptions(listOfDisplayOptions[newStagedElement.id]);
  } else {
    handleElementInserts(currentElement, dragSrcEl);
  }
}

function controlClickDisplayOptions(node) {
  node.addEventListener('click', function() {
    displayAppropriateOptions(listOfDisplayOptions[node.id]);
  })
}

// removes the irrelevant classes
function removeDragOverClasses(currentElement) {
  currentElement.classList && currentElement.classList.contains('over-top') ? currentElement.classList.remove('over-top') : false;
  currentElement.classList && currentElement.classList.contains('over-bottom') ? currentElement.classList.remove('over-bottom') : false;
}

function createbeginnerItem() {
  beginnerItem = document.createElement('div');
  beginnerItem.setAttribute('id', 'beginnerItem');
  beginnerItem.classList.add('staged');
  beginnerItem.textContent = 'Drop Stuff Here';

  return beginnerItem;
}

function addDeleteListener(button) {
  button.addEventListener('click', function() {
    button.parentElement.remove();
    if(!stagingArea.innerHTML.trim()) {
      const beginnerItem = createbeginnerItem(); 
      stagingArea.append(beginnerItem);
      addAllEventListeners(beginnerItem);
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
    clone.setAttribute('id', idCounter++)
    control.insertAdjacentElement('afterend', clone);
    addAllEventListeners(clone);
    createAppropriateOptionsList(clone);
  })
}

// Reset Button
function addResetButtonListener(){
  const resetButton = document.getElementById('resetButton');
  const stagingArea = document.getElementById('stagingArea');
  
  resetButton.addEventListener('click', function() {
    const confirmation = confirm('Are you sure?');
    if (confirmation) {
      stagingArea.innerHTML = '';
      const beginnerItem = createbeginnerItem(); 
      stagingArea.append(beginnerItem);
      addAllEventListeners(beginnerItem);
    }
  })
}

// Delete Buttons
function addDeleteButtonListener(){
  const deleteButtons = document.getElementsByClassName('deleteControl');
  
  Array.prototype.forEach.call(deleteButtons, function(button) {
    addDeleteListener(button);
  })
}

// Duplicate Buttons
function addDuplicateButtonListener(){
  const duplicateButtons = document.getElementsByClassName('duplicateControl');
  
  Array.prototype.forEach.call(duplicateButtons, function(button) {
    addDuplicateListener(button);
  })
}