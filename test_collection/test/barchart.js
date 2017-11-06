class BarChart {
  constructor(labels, thickness, orientation, maxLength){
    this._nrOfVariables = labels.length;
    this._labels = labels;
    this._thickness = thickness;
    this._orientation = orientation;
    this._maxLength = maxLength;

    this._width = 200;
    this._values = [];
    this._minValues = [];
    this._maxValues = [];
    this._bars = [];


    for (let i = 0; i < this._nrOfVariables; i++) {
      this._minValues[i] = 0;
      this._maxValues[i] = 10;
      this._bars[i] = new Bar(this._minValues[i], this._maxValues[i], this._orientation, this._maxLength);
    }
  }

  setWidth(width){
    this._width = width;
  }

  setValues(values){
    this._values = values;
    for (var i = 0; i < this._bars.length; i++) {
      this._bars[i].setValue(this._values[i]);
    }
  }

  setlabels(labels){
    this._labels = labels;
  }

  setBarThickness(thickness){
    this._thickness = thickness;
  }

  draw(x, y){
    let xIncrement = this._width/ this._nrOfVariables;
    for (var i = 0; i < this._bars.length; i++) {
      this._bars[i].draw(x, y);
      x += xIncrement;
    }
  }
}
