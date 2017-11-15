class ClickableShape{
  constructor(drawFunction){
    this._drawFunction = drawFunction;
  }

  draw(){
    // fill(200);
    rect(510,510,200,200);
    this._drawFunction(200,200,200,200);
  }
}