class ScatterPlot{
  constructor(labels, data){
    //data parameters
    this._nrOfVariables = labels.length;
    this._labels = labels;
    this._inData = data;
    this._currentData = {};

    if(this._nrOfVariables < 2){
      print("two few columns in data. Need at least two for z and y axis");
      throw 'two few columns in data. Need at least two for z and y axis';
      return;
    }
    this._xVariable = 0;
    this._yVariable = 1;
    this._sizeVariable = undefined
    this._colorVariable = undefined;
    this._currentData = {scaledXValue: [], scaledYValue: [], scaledSizeValue: [], scaledColorValue: []};

    this._minValues = [];
    this._maxValues = [];
    for (let i = 0; i < this._nrOfVariables; i++) {
      this._minValues[i] = -0.2;
      this._maxValues[i] = 0.2;
    }

    //drawing parameters
    this._maxRadius = 10;
    this._width = 400;
    this._height = 300;
    this._margin = 50;
    this._nrOfTicksX = 10;
    this._nrOfTicksY = 10;

    this._renderer;
    this.setDimensions(this._width, this._height);

    this.update();
  }

  setDimensions(width, height){
    this._width = width;
    this._height = height;
    this._renderer = createGraphics(this._width + 2 * this._margin, this._height + 2 * this._margin);
  }

  update(){
    // print("updating scatterPlot");
    for (var i = 0; i < this._inData.length; i++) {
      let currentRow = this._inData[i];

      if(this._xVariable === undefined || this._yVariable === undefined){
        print('x or y axis can\'t be undefined');
        throw('x or y axis can\'t be undefined');
        return;
      }
      let scaledXValue = this._getScaledValue(currentRow, this._xVariable, this._width);
      this._currentData.scaledXValue[i] = scaledXValue;
      let scaledYValue = this._getScaledValue(currentRow, this._yVariable, this._height);
      this._currentData.scaledYValue[i] = scaledYValue;

      if(this._sizeVariable !== undefined){
        let scaledSizeValue = this._getScaledValue(currentRow, this._sizeVariable, this._maxRadius);
        this._currentData.scaledSizeValue[i] = scaledSizeValue;
      }else{
        this._currentData.scaledSizeValue = undefined;
      }

      if(this._colorVariable !== undefined){
        let scaledColorValue = this._getScaledValue(currentRow, this._colorVariable, 255);
        this._currentData.scaledColorValue[i] = scaledColorValue;
      }else{
        this._currentData.scaledColorValue = undefined;
      }
    }

    this._drawToRenderer();
  }

  draw(x, y){
    // this._drawToRenderer(5, 5);
    image(this._renderer, x - this._margin, y - this._height - this._margin);
  }

  _drawToRenderer(){
    let x = this._margin;
    let y = -this._margin + this._renderer.height;
    this._renderer.clear();
    this._renderer.fill(255);
    this._renderer.push();
    this._renderer.translate(x, y);
    if(this._currentData.scaledXValue === undefined || this._currentData.scaledYValue == undefined){
      print('x or y axis can\'t be undefined');
      return;
    }
    for (var i = 0; i < this._currentData.scaledXValue.length; i++) {
      if(this._currentData.scaledSizeValue !== undefined){
        this._renderer.ellipse(this._currentData.scaledXValue[i], -this._currentData.scaledYValue[i], this._currentData.scaledSizeValue[i]);
      }else{
        this._renderer.ellipse(this._currentData.scaledXValue[i], -this._currentData.scaledYValue[i], 5);
      }
    }

    this._drawAxis();
    this._renderer.pop();
  }

  _getScaledValue(row, column, scaledMax){
    if(column === undefined){
      return undefined;
    }
    return map(row[column], this._minValues[column], this._maxValues[column], 0, scaledMax);
  }

  _drawAxis(){
    this._renderer.stroke(230);
    this._renderer.textAlign(RIGHT, CENTER);
    let yTickIncrement = this._height / this._nrOfTicksY;
    let yValueIncrement = (this._maxValues[this._yVariable] - this._minValues[this._yVariable])/this._nrOfTicksY;
    for (var i = 0; i <= this._nrOfTicksY; i++) {
      let axisValue = this._minValues[this._yVariable] + i * yValueIncrement;
      let currentYPos = - i * yTickIncrement
      this._renderer.text(nfc(axisValue,2), -10, currentYPos);
      this._renderer.line(-5, currentYPos, 0, currentYPos);
    }

    this._renderer.textAlign(CENTER, TOP);
    let xTickIncrement = this._width / this._nrOfTicksX;
    let xValueIncrement = (this._maxValues[this._xVariable] - this._minValues[this._xVariable])/this._nrOfTicksX;
    for (var i = 0; i <= this._nrOfTicksX; i++) {
      let axisValue = this._minValues[this._xVariable] + i * xValueIncrement;
      let currentXPos = i * xTickIncrement
      this._renderer.text(nfc(axisValue,2), currentXPos, 10);
      this._renderer.line(currentXPos, 0, currentXPos, 5);
    }

    this._renderer.line(0, 0, this._width, 0);
    this._renderer.line(0, 0, 0, -this._height);
  }
}