// TODO: implement return to default on double click
class SlidableVariable{
  constructor(label, minValue, maxValue, startValue){
    this._text = label + ': 0';

    this._position = createVector(0,0);
    this._width = textWidth(this._text);
    this._height = textAscent();
    this._textSize = textSize();
    this._hover = false;
    this._isPressed = false;
    this._clickStamp = 0;
    this._doubleClicked = false;
    this._pressedX = 0;
    this._pressedY = 0;
    this._valueWhenPressed = 0;
    this._maxDistanceWhenDragging = 200;

    if(label != undefined){
      this._label = label;
    }else{
      this._label = '';
    }

    this._minValue = minValue;
    this._maxValue = maxValue;
    this._startValue = startValue;

    this.value = startValue;
  }

  update(){
    this._text = this._label + ': ' + nfc(this.value, 3);
    this._width = textWidth(this._text);
    this._height = textAscent();
    this._updateHover();
    this._updatePressedState();
    if(this._isPressed && !this._doubleClicked){
      let distanceY = this._pressedY - mouseY;
      let val = this._valueWhenPressed + map(distanceY, 0, this._maxDistanceWhenDragging, 0, this._maxValue);
      this.value = constrain(val, this._minValue, this._maxValue);
    }
  }

  _updateHover(){
    // Is mouse over object
    if ( mouseX > this._position.x
      && mouseX < this._position.x + this._width
      && mouseY > this._position.y - this._height
      && mouseY < this._position.y ) {
      this._hover = true;
    }
    else {
      this._hover = false;
    }
  }

  _updatePressedState(){
    if(mouseIsPressed){
      if(this._hover && !this._isPressed){
        //We are in a transition
        this._isPressed = true;
        if(millis() - this._clickStamp < 600){
          this._doubleClicked = true;
          this.value = this._startValue;
          print('doubleClicked');
          this._clickStamp = 0;
        }else{// This might look weird. But it's a convenient way to avoid triple clicking trigger two double clicks (one for first two clicks and one for second two clicks)
          this._clickStamp = millis();
        }
        
        //Let's save reference position
        this._pressedX = mouseX;
        this._pressedY = mouseY;
        this._valueWhenPressed = this.value;
      }
    }else{
      this._isPressed = false;
      this._doubleClicked = false;
    }
  }

  setPosition(x, y){
    this._position.set(x,y);
  }

  draw(x, y){
    if(x != undefined && y != undefined){this._position.set(x,y);}

    let revertSize = textSize();
    if(this._hover || this._isPressed){
      textSize(this._textSize * 1.1);
    }else{
      textSize(this._textSize);
    }

    textAlign(LEFT, BASELINE);
    // rect(this._position.x, this._position.y, this._width, -this._height);
    // let formattedValue = nfc(this.value, 3);
    // text(this._label + ': ' + formattedValue, this._position.x, this._position.y);
    text(this._text, this._position.x, this._position.y);

    textSize(revertSize);
  }
}
