let table;
let minValues = [];
let maxValues = [];
let currentRow;
let dataPlayer;
let timeSlider;
let playButton;
let playSpeed;

let spiderChart;
let barChart;
let lineChart;
let scatterPlot;

let textBox;
let textBox2;

let dropZone;
let dropZone2;

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
  table.removeColumn('gpsTsp');
  table.removeColumn('phoneTstmp');

  print(table.columns);
  calculateMinMax(table);

  spiderChart = new SpiderChart(table.columns, minValues, maxValues);
  barChart = new BarChart(table.columns, 10, 'UP', 100);
  lineChart = new LineChart(table.columns, table.getArray(), 'UP', minValues, maxValues);
  lineChart.turnOnColumn(1);
  lineChart.turnOnColumn(2);
  lineChart.turnOnColumn(9);

  scatterPlot = new ScatterPlot(table.columns, table.getArray(), minValues, maxValues);

  timeSlider = createSlider(0, table.getRowCount()-1, 0, 1);
  timeSlider.position(600, 600);
  // timeSlider.size(400, AUTO);
  timeSlider.mousePressed(dataPlayer.temporaryPause.bind(dataPlayer));
  timeSlider.mouseReleased(dataPlayer.releaseTemporaryPause.bind(dataPlayer));

  textBox = new DraggableTextBox(60, 250, 0, 'AccX');
  textBox2 = new DraggableTextBox(60, 280, 1, 'AccY');
  textBox3 = new DraggableTextBox(60, 310, 2, 'AccZ');
  textBox4 = new DraggableTextBox(60, 340, 3, 'GyroX');

  dropZone = new DropZone(80,500, 60, 25);
  dropZone2 = new DropZone(80,540, 60, 25);

  playSpeed = new SlidableVariable('play speed', 0, 5, 1);
  playSpeed.setPosition(800, 615);

  playButton = createButton('>');
  playButton.position(500, 600);
  playButton.mousePressed(dataPlayer.togglePlayback.bind(dataPlayer));
  print('setup finished');
}

function draw() {
  background(20);
  textAlign(LEFT, BASELINE);
  text('fps: ' + nfc(getFrameRate(),2), 20, 20);

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

  rect(60-textWidth(' '), 120 - textAscent(), textWidth(' xqytest '), textAscent() + textDescent());
  text('xqytest', 60, 120);

  rect(140, 120 - textAscent(), textWidth('xqytest'), textSize());
  text('xqytest', 140, 120);
  // ellipse(120,120,10,10);

  textBox.update();
  textBox.draw();

  textBox2.update();
  textBox2.draw();

  textBox3.update();
  textBox3.draw();

  textBox4.update();
  textBox4.draw();

  if(DraggableTextBox.mostRecentlyDragged !== undefined){
    DraggableTextBox.mostRecentlyDragged.checkIfInDropZone(dropZone);
    DraggableTextBox.mostRecentlyDragged.checkIfInDropZone(dropZone2);
    for (var i = 0; i < scatterPlot.legendDropZones.length; i++) {
      DraggableTextBox.mostRecentlyDragged.checkIfInDropZone(scatterPlot.legendDropZones[i]);
    }
  }

  dropZone.draw();
  dropZone2.draw();

  playSpeed.update();
  playSpeed.draw();

  scatterPlot.update();
  scatterPlot.draw(800, 350);

  lineChart.draw(200,350);

  barChart.draw(200, 600);
  spiderChart.draw(800, 400);
}

function mousePressed(){
  textBox.updatePressedState();
  textBox2.updatePressedState();
  textBox3.updatePressedState();
  textBox4.updatePressedState();
}

function mouseReleased(){
  textBox.updatePressedState();
  textBox2.updatePressedState();
  textBox3.updatePressedState();
  textBox4.updatePressedState();
}

function calculateMinMax(table){
  for (let i = 0; i < table.columns.length; i++) {
    let values = table.getColumn(i);
    
    minValues[i] = Math.min( ...values );
    maxValues[i] = Math.max( ...values );
  }
}