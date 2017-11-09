class DropZone {
  constructor(x, y, width, height){
    this.position = createVector(x, y);
    this._width = width;
    this._height = height;
    this.dropMargin = 17;
  }

  draw(x, y){
    //Trying to make position optional parameter
    if(x != undefined && y != undefined){this.position.set(x,y);}

    rect(this.position.x-5, this.position.y-5, this._width, this._height);
  }
}
