class LineChart {
  constructor(labels, data, orientation){
    this._nrOfVariables = labels.length;
    this._labels = labels;
    this._orientation = orientation;

    this._width = 400;
    this._height = 300;
    this._nrOfTicksX = 10;
    this._nrOfTicksY = 10;
    this._maxYAxis = 5;
    this._maxXAxis = 10;
    // this._currentValues = [];
    this._minValues = [];
    this._maxValues = [];
    this._activeLabels = [];
    for (let i = 0; i < this._nrOfVariables; i++) {
      this._minValues[i] = 0;
      this._maxValues[i] = 5;
      this._activeLabels[i] = false;
    }
    this._currentIndex = 0;

    this._includedValuesBehind = 100;
    this._includedValuesInFront = 20;
    this._data = data;
  }

  setCurrentIndex(index){
    this._currentIndex = index
  }

  draw(x, y){
    noFill();

    let nrOfDataPoints = this._includedValuesBehind + this._includedValuesInFront
    let currentRowXPos = x +this._includedValuesBehind / nrOfDataPoints * this._width;
    line(currentRowXPos, y, currentRowXPos, y - this._height);

    stroke(255, 0, 255);
    for (let column = 0; column < this._activeLabels.length; column++) {
      if(this._activeLabels[column]){
        beginShape();
        for (let row = -this._includedValuesBehind; row < this._includedValuesInFront; row++) {
          let dataIndex = this._currentIndex + row;
          if(dataIndex >= 0 && dataIndex < this._data.length){
            let value = this._data[dataIndex][column];
            let isCurrent = (dataIndex == this._currentIndex);

            let scaledValue = map(value, this._minValues[column], this._maxValues[column], 0, this._height);
            vertex(x + (row + this._includedValuesBehind) * this._width / nrOfDataPoints, y - scaledValue);
          }
        }
        endShape();
      }
    }

    this._drawAxis(x, y);
  }

  _drawAxis(x, y){
    stroke(230);
    textAlign(RIGHT, CENTER);
    let tickIncrement = this._height / this._nrOfTicksY;
    for (var i = 0; i < this._nrOfTicksY; i++) {
      let axisValue = i * this._maxYAxis/this._nrOfTicksY;
      let currentYPos = y - i * tickIncrement
      text(axisValue, x-10, currentYPos);
      line(x-5, currentYPos, x, currentYPos);
    }
    line(x, y, x + this._width, y);
    line(x, y, x, y - this._height);
  }

  turnOnColumn(column){
    this._activeLabels[column] = true;
  }

  deactivateAllColumns(){
    for (var i = 0; i < this._activeLabels.length; i++) {
      this._activeLabels[i] = false;
    }
  }

  // _drawADataSeries(theDataSeries){
  //
  // }

  // drawGraph(data, startX, startY, graphWidth, graphHeight, minValue, maxValue, indexOffset, zoom, color) {
  //     var prevX = indexOffset;
  //     var prevY = 0;
  //     var axisTextSize = 15;
  //     // --- graph axes ---
  //     stroke(0);
  //     fill(0);
  //     textSize(axisTextSize);
  //     // x axis
  //     line(startX, startY+graphHeight, startX+graphWidth, startY+graphHeight);
  //     // y axis
  //     line(startX, startY, startX, startY+graphHeight);
  //     // y axis values
  //     text(maxValue, startX-textWidth(maxValue)-axisTextSize, startY+axisTextSize/2);
  //     text((maxValue-minValue)/2, startX-textWidth((maxValue-minValue)/2)-axisTextSize, startY+graphHeight/2+axisTextSize/2);
  //     text(minValue, startX-textWidth(minValue)-axisTextSize, startY+graphHeight+axisTextSize/2);
  //     // --- graph data ---
  //     stroke(color);
  //     osc.amp(0.5, 0.05);
  //     for (var i = indexOffset; i < data.length && (i-indexOffset)*zoom < graphWidth; i++) {
  //         if(i < indexOffset+1)
  //             osc.freq(data[i].value*(500.0/maxValue));
  //         var mappedValue = map(data[i].value, minValue, maxValue, 0, graphHeight);
  //         var date = new Date(data[i].date);
  //         line(startX+(prevX-indexOffset)*zoom, startY+graphHeight-prevY, startX+(i-indexOffset)*zoom, startY+graphHeight-mappedValue);
  //         prevX = i;
  //         prevY = mappedValue;
  //     }
  // }
}


//
// var data_json;
// var angle_data;
// var vibration_data;
// var offset = 0;
// var osc;
// function preload() {
//   data_json = loadJSON('firebase_backup_2017-11-02.json');
// }
// function setup() {
//
//   createCanvas(windowWidth, windowHeight);
//   //createCanvas(displayWidth, displayHeight);
//   console.log('setup');
//   osc = new p5.Oscillator();
//   osc.setType('sine');
//   osc.freq(240);
//   osc.amp(0);
//   osc.start();
//
//   angle_data = getAngleData(Object.keys(data_json.phones)[0]);
//   vibration_data = getVibrationData(Object.keys(data_json.phones)[0]);
//
// }
// function draw() {
//     background(255);
//     //drawPhones();
//     drawGraph(vibration_data, 100, 10, 1200, 800, 0, 5, offset, 1, color(200,200,200));
//     drawGraph(angle_data    , 100, 10, 1200, 800, 0, 30, offset, 1, color(0,0,0));
//     offset=(offset+1)%angle_data.length;
// }
// function getAngleData(phone) {
//     console.log('getAngleData(phone='+phone+")");
//     var device = Object.keys(data_json.angles[phone])[0];
//     var angles = data_json.angles[phone][device];
//     var angle_data = [];
//     for (var dateIndex = Object.keys(angles).length - 1; dateIndex >= 0; dateIndex--) {
//         var date = Object.keys(angles)[dateIndex];
//         //console.log("date:"+date);
//         for (var timestampIndex = Object.keys(angles[date]).length - 1; timestampIndex >= 0; timestampIndex--) {
//             var timestamp = Object.keys(angles[date])[timestampIndex];
//             var angle = angles[date][timestamp];
//             angle_data.push({ 'date':date, 'timestamp':timestamp, 'value': angle});
//         }
//     }
//     return angle_data;
// }
// function getVibrationData(phone) {
//     console.log('getVibrationData(phone='+phone+")");
//     var device = Object.keys(data_json.vibrations[phone])[0];
//     var vibrations = data_json.vibrations[phone][device];
//     var vibration_data = [];
//     for (var dateIndex = Object.keys(vibrations).length - 1; dateIndex >= 0; dateIndex--) {
//         var date = Object.keys(vibrations)[dateIndex];
//         //console.log("date:"+date);
//         for (var timestampIndex = Object.keys(vibrations[date]).length - 1; timestampIndex >= 0; timestampIndex--) {
//             var timestamp = Object.keys(vibrations[date])[timestampIndex];
//             var vibration = vibrations[date][timestamp];
//             vibration_data.push({ 'date':date, 'timestamp':timestamp, 'value': vibration});
//         }
//     }
//     return vibration_data;
// }
// function keyPressed() {
//
//
// }
//
// function drawPhones() {
//     //console.log('Drawing phones '+Object.keys(data_json.phones).length)
//     var startX = 0;
//     var startY = 0;
//     var lineHeight = 20;
//     var margin = 2;
//     textSize(lineHeight-margin*2);
//     fill(200);
//     stroke(200);
//     text("Phones ("+Object.keys(data_json.phones).length+")", startX, startY+lineHeight);
//     for (var i = Object.keys(data_json.phones).length - 1; i >= 0; i--) {
//         var phone = Object.keys(data_json.phones)[i];
//         text(i+": "+phone,startX,startY+lineHeight*(i+2));
//     }
// }
