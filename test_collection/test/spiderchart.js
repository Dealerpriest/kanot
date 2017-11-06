
class SpiderChart {
  constructor(labels){
    this._nrOfVariables = labels.length;
    this._values = [];
    this._minValues = [];
    this._maxValues = [];
    this._labels = labels;

    this._radius = 100;

    this._points = [];
    let angleIncrement = 360 / this._nrOfVariables;
    let angle = 0;
    // angleMode(DEGREES);
    for (var i = 0; i < this._nrOfVariables; i++) {
      this._points[i] = p5.Vector.fromAngle(radians(angle));
      angle += angleIncrement;

      this._maxValues[i] = 10;
      this._minValues[i] = -10;
    }
    // this._updateVectorMagnitudes();
  }

  _updateVectorMagnitudes(){
    for (var i = 0; i < this._points.length; i++) {
      let magnitude = this._radius * map(this._values[i], this._minValues[i], this._maxValues[i], 0, 1);

      this._points[i].setMag(magnitude);
    }
  }

  setValues(values){

    this._values = values;
    this._updateVectorMagnitudes();
  }

  setlabels(labels){
    this._labels = labels;
  }

  setRadius(radius){
    this._radius = radius;
    this._updateVectorMagnitudes();
  }

  draw(x, y){
    //let's draaaaw that chart!!!
    push();
    translate(x, y);
    // fill(200,80,0);
    beginShape();
    for (var i = 0; i < this._points.length; i++) {
      let x = this._points[i].x;
      let y = this._points[i].y;
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();

  }




}
