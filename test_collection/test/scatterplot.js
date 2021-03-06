/* globals DropZone */
class ScatterPlot{
  constructor(labels, units, data, minValues, maxValues, x, y, width, height){
    //data parameters
    this.legendDropZones = [];
    this._nrOfVariables = labels.length;
    this._labels = labels;
    this._units = units;
    this._inData = data;
    this._currentData = {};
    this._minValues = minValues;
    this._maxValues = maxValues;
    // for (let i = 0; i < this._nrOfVariables; i++) {
    //   this._minValues[i] = -0.2;
    //   this._maxValues[i] = 0.2;
    // }

    if(this._nrOfVariables < 2){
      print('two few columns in data. Need at least two for z and y axis');
      throw 'two few columns in data. Need at least two for z and y axis';
    }
    this._xVariable = undefined;
    this._yVariable = undefined;
    this._sizeVariable = undefined;
    this._colorVariable = undefined;

    this._previousXVariable = -1;
    this._previousYVariable = -1;
    this._previousSizeVariable = -1;
    this._previousColorVariable = -1;

    this._currentData = {scaledXValue: [], scaledYValue: [], scaledSizeValue: [], scaledColorValue: []};
    
    // legned area
    this._legendDropZonesHeight = 50;
    for (var i = 0; i < 4; i++) {
      this.legendDropZones[i] = new DropZone(0,0, 100, this._legendDropZonesHeight, color(255,0));
    }

    //drawing parameters
    this._position = createVector(x, y);
    this._width = width;
    this._height = height;
    this._circleAlpha = 50;
    let radiusFactor = 7;
    this._maxRadius = (this._width + this._height) / 2 / (100/radiusFactor);
    this._minRadius = 5;
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
    this._renderer.textFont(centuryGothicFont);
  }

  update(){
    this._xVariable = this.legendDropZones[0].value;
    this._yVariable = this.legendDropZones[1].value;
    this._sizeVariable = this.legendDropZones[2].value;
    this._colorVariable = this.legendDropZones[3].value;

    // print("updating scatterPlot");
    if(
      this._xVariable === this._previousXVariable
      && this._yVariable === this._previousYVariable
      && this._sizeVariable === this._previousSizeVariable
      && this._colorVariable === this._previousColorVariable
    ){
      return;
    }
    print('updating scatterplot');

    this._previousXVariable = this._xVariable;
    this._previousYVariable = this._yVariable;
    this._previousSizeVariable = this._sizeVariable;
    this._previousColorVariable = this._colorVariable;

    if(this._xVariable === undefined || this._yVariable === undefined){
      print('Invalid variableset');
      this._resetRenderer();
      // this._drawAxis();
      //throw('x or y axis can\'t be undefined');
      return;
    }

    for (var i = 0; i < this._inData.length; i++) {
      let currentRow = this._inData[i];
      
      let scaledXValue = this._getScaledValue(currentRow, this._xVariable, this._width);
      this._currentData.scaledXValue[i] = scaledXValue;
      let scaledYValue = this._getScaledValue(currentRow, this._yVariable, this._height);
      this._currentData.scaledYValue[i] = scaledYValue;

      if(this._sizeVariable !== undefined){
        let scaledSizeValue = this._getScaledValue(currentRow, this._sizeVariable, this._maxRadius - this._minRadius) + this._minRadius;
        this._currentData.scaledSizeValue[i] = scaledSizeValue;
      }else{
        this._currentData.scaledSizeValue = [];
      }

      if(this._colorVariable !== undefined){
        let scaledColorValue = this._getScaledValue(currentRow, this._colorVariable, 180);
        this._currentData.scaledColorValue[i] = scaledColorValue;
      }else{
        this._currentData.scaledColorValue = [];
      }
    }

    this._drawToRenderer();
  }

  draw(x, y){
    //Trying to make position optional parameter
    if(x !== undefined && y !== undefined){this._position.set(x,y);}
    
    // this._drawToRenderer(5, 5);
    image(this._renderer, this._position.x - this._margin, this._position.y - this._height - this._margin);

    // draw unit descriptions
    // push();
    // noStroke();
    textAlign(LEFT, CENTER);
    if(this._xVariable !== undefined){
      text(this._units[this._xVariable], this._position.x + this._width + 15, this._position.y);
    }
    
    textAlign(CENTER, BOTTOM);
    if(this._yVariable !== undefined){
      text(this._units[this._yVariable], this._position.x, this._position.y - this._height - 15);
    }
    // pop();

    this._drawLegend(this._position.x + this._width + this._margin * 2 + 100, this._position.y - this._height + this._margin/2);
  }

  _drawLegend(x, y){
    push();
    textAlign(RIGHT, CENTER);
    let legendPosition = createVector(x, y);
    let verticalIncrement = this._height/4;
    let dropZoneVerticalOffset = 22;
    let dropZoneHorizontalOffset = 15;
    
    fill(255);
    noStroke();
    text('X', legendPosition.x, legendPosition.y + dropZoneVerticalOffset);

    this._drawDropArea(legendPosition.x + dropZoneHorizontalOffset, legendPosition.y, this._legendDropZonesHeight);
    this.legendDropZones[0].draw(legendPosition.x + dropZoneHorizontalOffset, legendPosition.y);
    
    legendPosition.y += verticalIncrement;    
    text('Y', legendPosition.x, legendPosition.y + dropZoneVerticalOffset);
    this._drawDropArea(legendPosition.x + dropZoneHorizontalOffset, legendPosition.y, this._legendDropZonesHeight);
    this.legendDropZones[1].draw(legendPosition.x + dropZoneHorizontalOffset, legendPosition.y);
    

    dropZoneVerticalOffset = 0;
    legendPosition.y += verticalIncrement;
    text('Size', legendPosition.x, legendPosition.y + dropZoneVerticalOffset);
    this._drawDropArea(legendPosition.x + dropZoneHorizontalOffset, legendPosition.y, this._legendDropZonesHeight);
    let vertOffsetEllipse = 40;
    this.legendDropZones[2].draw(legendPosition.x  + dropZoneHorizontalOffset, legendPosition.y);
    ellipse(legendPosition.x - 15, legendPosition.y + vertOffsetEllipse, this._maxRadius, this._maxRadius);
    ellipse(legendPosition.x - 70, legendPosition.y + vertOffsetEllipse, this._minRadius, this._minRadius);
    if(this._sizeVariable){
      textAlign(CENTER, TOP);
      text(nfc(this._maxValues[this._sizeVariable], 2), legendPosition.x - 15, legendPosition.y + vertOffsetEllipse + 25);
      text(nfc(this._minValues[this._sizeVariable], 2), legendPosition.x - 70, legendPosition.y + vertOffsetEllipse + 25);
    }

    textAlign(RIGHT, CENTER);
    dropZoneVerticalOffset = 15;
    legendPosition.y += verticalIncrement;
    text('Color', legendPosition.x, legendPosition.y + dropZoneVerticalOffset);
    this._drawDropArea(legendPosition.x + dropZoneHorizontalOffset, legendPosition.y, this._legendDropZonesHeight);
    this.legendDropZones[3].draw(legendPosition.x + dropZoneHorizontalOffset, legendPosition.y);
    
    legendPosition.y += 31;
    this._drawGradientBox(legendPosition.x - 70, legendPosition.y, 70, 10, 0, 180);
    if(this._colorVariable){
      textAlign(RIGHT, TOP);
      text(nfc(this._maxValues[this._colorVariable], 2), legendPosition.x, legendPosition.y + 15);
      text(nfc(this._minValues[this._colorVariable], 2), legendPosition.x - 65, legendPosition.y + 15);
    }
    pop();
  }

  _drawDropArea(x, y, height){
    push();
    let radiusTop = 15;
    let radiusBottom = 9;
    // let dropHeight = height;
    let dropHeight = max( height - radiusTop - radiusBottom, 1);
    // print(dropHeight);
    // x += radiusTop;
    y += radiusTop;
    stroke(255);
    noFill();
    arc(x + radiusTop + 0.5, y + 0.5, radiusTop*2, radiusTop*2, PI, PI+HALF_PI);
    line(x, y, x, y + dropHeight);
    arc(x + radiusBottom + 0.5, y + dropHeight + 0.5, radiusBottom*2, radiusBottom*2, HALF_PI, PI);
    
    for(let i = 0; i < 80; i++){
      stroke(255, 255 - 255 * i * 0.08);
      line(x + radiusTop + i, y - radiusTop, x + radiusTop + i + 1, y - radiusTop);
      line(x + radiusBottom + i, y + dropHeight + radiusBottom, x + radiusBottom + i + 1, y + dropHeight + radiusBottom);
    }
    pop();
  }

  _drawGradientBox(x, y, width, height, startHue, endHue){
    push();
    for(let i = 0; i < width; i++){
      let lerpValue = map(i, 0, width, 0, 1.0);
      let hue = lerp(startHue, endHue, lerpValue);
      colorMode(HSB);
      stroke(hue, 100, 100);
      // noStroke();
      line(x + i, y, x + i, y + height);
    }
    pop();
  }

  _resetRenderer(){
    let x = this._margin;
    let y = -this._margin + this._renderer.height;
    this._renderer.clear();
    this._renderer.push();
    this._renderer.translate(x, y);
    this._renderer.fill(255);
    this._renderer.textAlign(CENTER, CENTER);
    this._renderer.text('Välj åtminstone x och y', this._width/2, -this._height/2);
    this._renderer.stroke(230);
    this._renderer.line(0, 0, this._width, 0);
    this._renderer.line(0, 0, 0, -this._height);
    this._renderer.pop();
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
      // this._renderer.stroke(230);
      // this._renderer.line(0, 0, this._width, 0);
      // this._renderer.line(0, 0, 0, -this._height);
      // this._renderer.pop();
      return;
    }

    for (var i = 0; i < this._currentData.scaledXValue.length; i++) {
      let skipCurrentPoint = false;
      let radius;
      if(this._currentData.scaledSizeValue.length !== 0){
        // this._renderer.ellipse(this._currentData.scaledXValue[i], -this._currentData.scaledYValue[i], this._currentData.scaledSizeValue[i]);
        skipCurrentPoint = skipCurrentPoint || this._currentData.scaledSizeValue[i] === undefined;
        radius = this._currentData.scaledSizeValue[i];
      }else{
        // this._renderer.ellipse(this._currentData.scaledXValue[i], -this._currentData.scaledYValue[i], 5);
        radius = 8;
      }

      // let colorValue;
      this._renderer.fill(255, 100);
      if(this._currentData.scaledColorValue.length !== 0){
        skipCurrentPoint = skipCurrentPoint || this._currentData.scaledColorValue[i] === undefined;
        // colorValue = this._currentData.scaledColorValue;
        this._renderer.colorMode(HSB);
        this._renderer.fill(this._currentData.scaledColorValue[i], 100, 100, 0.3);
        this._renderer.stroke(255);
      }

      skipCurrentPoint = skipCurrentPoint || this._currentData.scaledXValue[i] === undefined || this._currentData.scaledYValue[i] === undefined;

      if(!skipCurrentPoint){
        // this._renderer.colorMode(HSB);
        // this._renderer.fill(130, 100, 100);
        this._renderer.ellipse(this._currentData.scaledXValue[i], -this._currentData.scaledYValue[i], radius);
      }
    }

    this._drawAxis();
    this._renderer.pop();
  }

  _getScaledValue(row, column, scaledMax){
    if(row[column] === undefined){
      return undefined;
    }
    return map(row[column], this._minValues[column], this._maxValues[column], 0, scaledMax);
  }

  _drawAxis(){
    let axisColorValue = 230;
    this._renderer.colorMode(RGB);
    this._renderer.fill(255);
    this._renderer.textAlign(RIGHT, CENTER);
    let yTickIncrement = this._height / this._nrOfTicksY;
    let yValueIncrement = (this._maxValues[this._yVariable] - this._minValues[this._yVariable])/this._nrOfTicksY;
    for (var i = 0; i <= this._nrOfTicksY; i++) {
      let axisValue = this._minValues[this._yVariable] + i * yValueIncrement;
      let currentYPos = - i * yTickIncrement;
      // tick stuff
      this._renderer.noStroke();
      this._renderer.text(nfc(axisValue,2), -10, currentYPos);
      this._renderer.stroke(axisColorValue);
      this._renderer.line(-5, currentYPos, 0, currentYPos);
      // tick lines
      this._renderer.stroke(axisColorValue, 50);
      this._renderer.line(0, currentYPos, this._width, currentYPos);
    }
    if(this._minValues[this._yVariable] < 0){
      let yZeroPos = map(0, this._minValues[this._yVariable], this._maxValues[this._yVariable], 0, -this._height);
      this._renderer.stroke(axisColorValue);
      this._renderer.line(0, yZeroPos, this._width, yZeroPos);
    }

    this._renderer.textAlign(CENTER, TOP);
    let xTickIncrement = this._width / this._nrOfTicksX;
    let xValueIncrement = (this._maxValues[this._xVariable] - this._minValues[this._xVariable])/this._nrOfTicksX;
    for (var j = 0; j <= this._nrOfTicksX; j++) {
      let axisValue = this._minValues[this._xVariable] + j * xValueIncrement;
      let currentXPos = j * xTickIncrement;
      // tick stuff
      this._renderer.noStroke();
      this._renderer.text(nfc(axisValue,2), currentXPos, 10);
      this._renderer.stroke(axisColorValue);
      this._renderer.line(currentXPos, 0, currentXPos, 5);
      // tick lines
      this._renderer.stroke(axisColorValue, 50);
      this._renderer.line(currentXPos, 0, currentXPos, -this._height);
    }

    this._renderer.stroke(axisColorValue);
    this._renderer.line(0, 0, this._width, 0);
    this._renderer.line(0, 0, 0, -this._height);
  }
}
