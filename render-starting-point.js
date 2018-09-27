function renderStartingPoint () {
  const body = document.querySelector('body');
  body.innerHTML += `
  <div class="formBuildArea">
    
    <div id="stagingArea">
      
      <div id="beginnerItem" class="staged">Drop Stuff Here</div>
      
    </div>

    <div id="options">
      <div id="optionsList"></div>
    </div>
    <div id="controls">
      
        <div class="controls" draggable="true" title="Form Title" data-type="">
            <h1><label>Title</label></h1>
        </div>

        <div class="controls" draggable="true" title="Section Header" data-type="">
            <h2><label>Header</label></h2>
        </div>
  
        <div class="controls" draggable="true" title="Question or instructions to fill the field" data-type="">
            <label>Instructions</label>
        </div>
  
        <div class="controls" draggable="true" title="Checkbox" data-type="checkbox">
            <label>Checkbox</label><span class="requiredDisplay"></span>
        </div>

        <div class="controls" draggable="true" title="Radio Button" data-type="radio">
            <label>Radio Button</label><span class="requiredDisplay"></span>
        </div>
  
        <div class="controls" draggable="true" title="Select" data-type="select">
            <label>Select</label><span class="requiredDisplay"></span>
        </div>

        <div class="controls" draggable="true" title="Select Multiple" data-type="select multiple">
            <label>Select Multiple</label><span class="requiredDisplay"></span>
        </div>
  
        <div class="controls" draggable="true" title="Text" data-type="text">
            <label>Text</label><span class="requiredDisplay"></span>
        </div>

        <div class="controls" draggable="true" title="Text Area" data-type="textarea">
            <label>Text Area</label><span class="requiredDisplay"></span><br>
        </div>

        <div class="controls" draggable="true" title="Date" data-type="date">
            <label>Date</label><span class="requiredDisplay"></span>
        </div>

        <div class="controls" draggable="true" title="Time" data-type="time">
            <label>Time</label><span class="requiredDisplay"></span>
        </div>

        <div class="controls" draggable="true" title="Number" data-type="number">
            <label>Number</label><span class="requiredDisplay"></span>
        </div>

        <div class="controls" draggable="true" title="Email" data-type="email">
            <label>Email</label><span class="requiredDisplay"></span>
        </div>

    </div>
  </div>
  <button id="resetButton">Reset</button>
  <button id="saveButton">Save</button>
  
  `
}

renderStartingPoint();