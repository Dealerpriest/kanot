let table;
let minValues = [];
let maxValues = [];
let currentRow;
let variableColors = [];

let dataPlayer;
let timeSlider;
let playButton;
let playSpeed;

let spiderChart;
let barChart;
let lineChart;
let scatterPlot;

let foregroundColor;// = color(255);
// let detailColor = color(220);

// let textBox;
// let textBox2;

// let dropZone;
// let dropZone2;

// let clickableRectangle;


let variableBank = [];

function preload(){
  table = loadTable('data/kanot.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  let timestampsAsStrings = table.getColumn('t');
  dataPlayer = new DataPlayer(timestampsAsStrings.map(Number));

  //after we've given the timestamps to the dataplayer, we remove them from our table.
  table.removeColumn('t');
  //Alos remove some other fucked up stuff (the other timestamps)
  table.removeColumn('phoneAccX');
  table.removeColumn('phoneAccY');
  table.removeColumn('phoneAccZ');

  table.removeColumn('long');
  table.removeColumn('lat');
  table.removeColumn('alt');

  table.removeColumn('gpsTsp');
  table.removeColumn('phoneTstmp');

  print(table.columns);
  calculateMinMax(table);

  colorMode(HSB);
  let hueIncrement = 360 / table.columns.length;
  for (let i = 0; i < table.columns.length; i++) {
    variableColors[i] = color(i*hueIncrement, 100, 100);
  }
  colorMode(RGB);

  let yPositionRibbon = 20;

  playButton = createButton('>');
  playButton.position(100, yPositionRibbon + 2);
  playButton.mousePressed(() => { dataPlayer.togglePlayback(); });

  timeSlider = createSlider(0, table.getRowCount()-1, 0, 1);
  timeSlider.position(140, yPositionRibbon);
  timeSlider.mousePressed(() => { dataPlayer.temporaryPause(); });
  timeSlider.mouseReleased(() => { dataPlayer.releaseTemporaryPause(); });

  playSpeed = new SlidableVariable('play speed', 0, 5, 1);
  playSpeed.setPosition(300, yPositionRibbon + 1.5 * playSpeed._height);

  let variableBankStartX = 500;
  let xSpacing = 15;
  let variableBankPosition = createVector(variableBankStartX, yPositionRibbon + 5);
  for (let i = 0; i < table.columns.length; i++) {
    let name = table.columns[i];
    variableBank[i] = new DraggableTextBox(variableBankPosition.x, variableBankPosition.y, i, name, variableColors[i]);
    variableBankPosition.x += (variableBank[i]._width + xSpacing);
  }

  lineChart = new LineChart(table.columns, table.getArray(), minValues, maxValues, 'UP', 100, 450, variableColors);
  lineChart.turnOnColumn(1);
  // lineChart.turnOnColumn(2);
  lineChart.turnOnColumn(6);


  spiderChart = new SpiderChart(table.columns, minValues, maxValues);
  barChart = new BarChart(table.columns, 10, 'UP', 100, minValues, maxValues, variableColors);
  

  scatterPlot = new ScatterPlot(table.columns, table.getArray(), minValues, maxValues);


  

  // clickableRectangle = new ClickableShape(rect);

  // dropZone = new DropZone(80,500, 60, 25);
  // dropZone2 = new DropZone(80,540, 60, 25);
  
  foregroundColor = color(255);

  print('setup finished');
}

function draw() {
  background(20);
  noFill();
  stroke(foregroundColor);

  textAlign(LEFT, TOP);
  text('fps: ' + nfc(getFrameRate(),2), 20, 23);

  dataPlayer.setPlaybackSpeed(playSpeed.value);

  dataPlayer.update();
  if(dataPlayer.playbackIsOn){
    timeSlider.elt.value = dataPlayer.getCurrentIndex();
  }else{
    dataPlayer.setCurrentIndex(timeSlider.value());
  }

  if(dataPlayer.isUpdated){
    currentRow = table.getRow(dataPlayer.getCurrentIndex()).arr;

    spiderChart.setValues(currentRow);

    barChart.setValues(currentRow);
    lineChart.setCurrentIndex(dataPlayer.getCurrentIndex());

    // scatterPlot.update();

  }

  // clickableRectangle.draw();

  // rect(60-textWidth(' '), 120 - textAscent(), textWidth(' xqytest '), textAscent() + textDescent());
  // text('xqytest', 60, 120);

  // rect(140, 120 - textAscent(), textWidth('xqytest'), textSize());
  // text('xqytest', 140, 120);
  // ellipse(120,120,10,10);

  variableBank.forEach( (element) => {element.update();});
  variableBank.forEach((element) => {element.draw();});

  if(DraggableTextBox.mostRecentlyDragged !== undefined){
    for (var i = 0; i < scatterPlot.legendDropZones.length; i++) {
      DraggableTextBox.mostRecentlyDragged.checkIfInDropZone(scatterPlot.legendDropZones[i]);
    }
  }

  playSpeed.update();
  playSpeed.draw();

  scatterPlot.update();
  scatterPlot.draw(800, 450);

  lineChart.draw();

  barChart.draw(200, 600);
  spiderChart.draw(600, 600);
}

function doubleClicked(){
  if(document.selection && document.selection.empty) {
    document.selection.empty();
  } else if(window.getSelection) {
    var sel = window.getSelection();
    sel.removeAllRanges();
  }
}

function mousePressed(){
  //Ugly hack trying to avoid selection when doubleclicking
  if(document.selection && document.selection.empty) {
    document.selection.empty();
  } else if(window.getSelection) {
    var sel = window.getSelection();
    sel.removeAllRanges();
  }
  // textBox.updatePressedState();
  // textBox2.updatePressedState();
  // textBox3.updatePressedState();
  // textBox4.updatePressedState();
  // variableBank.forEach(textBox => {
  //   textBox.updatePressedState();
  // });
  variableBank.forEach((element) => {element.updatePressedState();});
  // return false;
}

function mouseReleased(){
  //Ugly hack trying to avoid selection when doubleclicking
  if(document.selection && document.selection.empty) {
    document.selection.empty();
  } else if(window.getSelection) {
    var sel = window.getSelection();
    sel.removeAllRanges();
  }
  // textBox.updatePressedState();
  // textBox2.updatePressedState();
  // textBox3.updatePressedState();
  // textBox4.updatePressedState();
  variableBank.forEach((element) => {element.updatePressedState();});
}

function calculateMinMax(table){
  for (let i = 0; i < table.columns.length; i++) {
    let values = table.getColumn(i);
    
    minValues[i] = Math.min( ...values );
    maxValues[i] = Math.max( ...values );
  }
}