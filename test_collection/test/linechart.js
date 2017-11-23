class LineChart {
  // The data array is expected to have timestamp in first column
  constructor(labels, units, data, minValues, maxValues, orientation, x, y, colors){
    this._nrOfVariables = labels.length;
    this._labels = labels;
    this._units = units;
    
    this._orientation = orientation;
    this._position = undefined;
    if(x != undefined && y != undefined){
      this._position = createVector(x,y);
    }
    this._width = 400;
    this._height = 300;
    this._nrOfTicksX = 10;
    this._nrOfTicksY = 10;
    // this._maxYAxis = 5;
    // this._maxXAxis = 10;
    
    this._minValues = minValues;
    this._maxValues = maxValues;
    this._activeVariables = [];
    // this._activeLabels = [];
    // for (let i = 0; i < this._nrOfVariables; i++) {
    //   this._activeLabels[i] = false;
    // }
    this._currentIndex = 0;

    // Let's initalize the first timestamp
    this._currentTimestamp = data[0][0];
    this._timeWindow = 1000;

    this._includedValuesBehind = 100;
    this._includedValuesInFront = 20;
    this._data = data;

    this._colors = [];
    if(colors !== undefined){
      this._colors = colors;
    }
  }

  setStampAndIndex(stamp, index){
    this.setCurrentTimestamp(stamp);
    this.setCurrentIndex(index);
  }

  setCurrentIndex(index){
    this._currentIndex = index;
  }

  setCurrentTimestamp(ms){
    this._currentTimestamp = ms;
  }

  draw(x, y){
    push();

    if(x != undefined && y != undefined){this._position.set(x,y);}
    noFill();

    let nrOfDataPoints = this._includedValuesBehind + this._includedValuesInFront;
    // let currentRowXPos = this._position.x +this._includedValuesBehind / nrOfDataPoints * this._width;
    stroke(foregroundColor);
    // line(currentRowXPos, this._position.y, currentRowXPos, this._position.y - this._height);

    push();
    for (let i = 0; i < this._activeVariables.length; i++) {
      let column = this._activeVariables[i];
      stroke(this._colors[column]);
      strokeWeight(2);
      beginShape();


      // really fucked up method to find the oldest timestamp we should use in this draw pass
      // This is because we want to draw the oldest values first. Becuase we can keep values to next vertex if undefined.
      let drawnIndex = this._currentIndex;
      let valueFound = false;
      while(drawnIndex > 0 && (!valueFound || this._data[drawnIndex-1][0] > this._currentTimestamp - this._timeWindow)){
        drawnIndex--;
        valueFound = this._data[drawnIndex][column] !== undefined;
      }

      let value = this._data[drawnIndex][column];
      // print(drawnIndex);
      // while(drawnIndex >= 0 && this._data[drawnIndex][0] > this._currentTimestamp - this._timeWindow){
      for(;drawnIndex <= this._currentIndex; drawnIndex++){
        let ts = this._data[drawnIndex][0];
        let x = map(ts, this._currentTimestamp - this._timeWindow, this._currentTimestamp, 0, this._width);
        x = constrain(x, 0, this._width);

        if(this._data[drawnIndex][column] !== undefined){
          value = this._data[drawnIndex][column];
        }

        let scaledValue = map(value, this._minValues[column], this._maxValues[column], 0, this._height);
        vertex(this._position.x + x, this._position.y - scaledValue);
        // print(drawnIndex);

        // --drawnIndex;
      }
      // print(drawnIndex);
      // let dataIndex = this._currentIndex + row;
      // if(dataIndex >= 0 && dataIndex < this._data.length){
      //   let value = this._data[dataIndex][column];
      //   let isCurrent = (dataIndex == this._currentIndex);

      //   let scaledValue = map(value, this._minValues[column], this._maxValues[column], 0, this._height);
      //   vertex(this._position.x + (row + this._includedValuesBehind) * this._width / nrOfDataPoints, this._position.y - scaledValue);
      // }
      endShape();
    }
    pop();

    // push();
    // for (let i = 0; i < this._activeVariables.length; i++) {
    //   let column = this._activeVariables[i];
    //   stroke(this._colors[column]);
    //   strokeWeight(2);
    //   beginShape();
    //   for (let row = -this._includedValuesBehind; row < this._includedValuesInFront; row++) {
    //     let dataIndex = this._currentIndex + row;
    //     if(dataIndex >= 0 && dataIndex < this._data.length){
    //       let value = this._data[dataIndex][column];
    //       // let isCurrent = (dataIndex == this._currentIndex);

    //       let scaledValue = map(value, this._minValues[column], this._maxValues[column], 0, this._height);
    //       vertex(this._position.x + (row + this._includedValuesBehind) * this._width / nrOfDataPoints, this._position.y - scaledValue);
    //     }
    //   }
    //   endShape();
    // }
    // pop();

    this._drawAxis(this._position.x, this._position.y);

    pop();
  }

  //TODO: Account for variables with negative values
  _drawAxis(x, y){
    stroke(foregroundColor);
    textAlign(RIGHT, CENTER);
    let tickDistanceIncrement = this._height / this._nrOfTicksY;

    line(x, y, x + this._width, y);

    if(this._activeVariables.length > 2){
      return;
    }

    for (let i = 0; i < this._activeVariables.length; i++) {
      let column = this._activeVariables[i];
      let unit = this._units[column];
      let variableValueSpan = (this._maxValues[column] - this._minValues[column]);
      let axisXPosition = x + i * this._width;
      let tickLength = 5;
      if(i === 1){
        textAlign(LEFT, CENTER);
        tickLength = -tickLength;
      }
      for (var j = 0; j < this._nrOfTicksY + 1; j++) {
        let axisValue = this._minValues[column] + ( j / this._nrOfTicksX) * variableValueSpan;
        // let axisValue = j * this._maxYAxis/this._nrOfTicksY;
        let currentYPos = y - j * tickDistanceIncrement;
        fill(this._colors[column]);
        noStroke();
        text(nfc(axisValue,2), axisXPosition - 2 * tickLength, currentYPos);
        stroke(this._colors[column])
        line(axisXPosition - tickLength, currentYPos, axisXPosition, currentYPos);
      }
      line(axisXPosition, y, axisXPosition, y - this._height);
      textAlign(CENTER, BOTTOM);
      text(unit, axisXPosition, y - this._height - 10);
    }
    
    // for(let variable = 0; i < this._activeLabels.length; i++){
    //   if(this._activeLabels[i]){
    //     for (var i = 0; i < this._nrOfTicksY; i++) {
    //       // let axisValue = i * (this.);
    //       let axisValue = i * this._maxYAxis/this._nrOfTicksY;
    //       let currentYPos = y - i * tickDistanceIncrement;
    //       text(axisValue, x-10, currentYPos);
    //       line(x-5, currentYPos, x, currentYPos);
    //     }
    //     line(x, y, x, y - this._height);
    //   }
    // }


  }

  turnOnColumn(column){
    // this._activeLabels[column] = true;
    this._activeVariables.push(column);
  }

  deactivateAllColumns(){
    // for (var i = 0; i < this._activeLabels.length; i++) {
    //   this._activeLabels[i] = false;
    // }
    this._activeVariables = [];
  }
}
