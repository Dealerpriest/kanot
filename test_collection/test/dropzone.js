class DropZone {
  constructor(x, y, width, height, colorObject){
    this.value = undefined;
    this.position = createVector(x, y);
    this.dropPosition = createVector(x+5, y+5);
    this._width = width;
    this._height = height;
    this.dropMargin = 17;
    this.occupied = false;
    this._color = color(255);
    if(colorObject !== undefined){
      this._color = colorObject;
    }
  }

  setColor(color){
    this._color = color;
  }

  setPosition(x, y){
    if(x != undefined && y != undefined){
      this.position.set(x,y);
      this.dropPosition.set(x+5,y+5);
    }
  }

  draw(x, y){
    //Trying to make position optional parameter
    if(x != undefined && y != undefined){
      this.position.set(x,y);
      this.dropPosition.set(x+5,y+5);
    }

    rect(this.position.x, this.position.y, this._width, this._height);
  }
}
