class LineChart {
  constructor(labels, data, orientation, minValues, maxValues){
    this._nrOfVariables = labels.length;
    this._labels = labels;
    this._orientation = orientation;

    this._width = 400;
    this._height = 300;
    this._nrOfTicksX = 10;
    this._nrOfTicksY = 10;
    this._maxYAxis = 5;
    // this._maxXAxis = 10;
    
    this._minValues = minValues;
    this._maxValues = maxValues;
    this._activeLabels = [];
    for (let i = 0; i < this._nrOfVariables; i++) {
      this._activeLabels[i] = false;
    }
    this._currentIndex = 0;

    this._includedValuesBehind = 100;
    this._includedValuesInFront = 20;
    this._data = data;
  }

  setCurrentIndex(index){
    this._currentIndex = index;
  }

  draw(x, y){
    noFill();

    let nrOfDataPoints = this._includedValuesBehind + this._includedValuesInFront;
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
            // let isCurrent = (dataIndex == this._currentIndex);

            let scaledValue = map(value, this._minValues[column], this._maxValues[column], 0, this._height);
            vertex(x + (row + this._includedValuesBehind) * this._width / nrOfDataPoints, y - scaledValue);
          }
        }
        endShape();
      }
    }

    this._drawAxis(x, y);
  }

  //TODO: Account for variables with negative values
  _drawAxis(x, y){
    stroke(230);
    textAlign(RIGHT, CENTER);
    let tickIncrement = this._height / this._nrOfTicksY;
    for (var i = 0; i < this._nrOfTicksY; i++) {
      let axisValue = i * this._maxYAxis/this._nrOfTicksY;
      let currentYPos = y - i * tickIncrement;
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
}
