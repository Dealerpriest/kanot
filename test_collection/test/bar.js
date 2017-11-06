
class Bar{
  constructor(minValue, maxValue, orientation, maxLength){
    this._value = 0;
    this._position = createVector(0,0);

    this._minValue = minValue;
    this._maxValue = maxValue;
    this._orientation = orientation;
    this._maxLength = maxLength;

    this._length;
  }

  setValue(value){
    this._value = value;
    this._length = map(this._value, this._minValue, this._maxValue, 0, this._maxLength);
  }

  setPosition(x, y){
    this._position.set(x,y);
  }

  draw(x, y){
    //Trying to make position optional parameter
    if(x != undefined && y != undefined){this._position.set(x,y);}

    let thickness = 10;
    if(this._orientation == 'UP'){
      rect(this._position.x, this._position.y, thickness, this._length);
    }else if(this._orientation == 'DOWN'){
      rect(this._position.x, this._position.y, thickness, -this._length);
    }else if(this._orientation == 'LEFT'){
      rect(this._position.x, this._position.y, -this._length, thickness);
    }else if(this._orientation == 'RIGHT'){
      rect(this._position.x, this._position.y, this._length, thickness);
    }else{
      throw 'Invalid orientation provided for constructor in bar.js';
    }
  }

}
