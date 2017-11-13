class DraggableTextBox{
  constructor(x, y, value, text){
    //data stuff
    if(text !== undefined){
      this._text = text;
    }else{
      this._text = 'no name';
    }

    this._value = value;


    //position stuff
    this._width = textWidth(' ' + this._text + ' ');
    this._height = textAscent() + textDescent();
    this._textPositionOffset = createVector(textWidth(' '), textAscent());
    this._draggedPosition = createVector(x, y);
    this._homePosition = createVector(x, y);
    this._currentPosition = createVector(x, y);
    this._pressedPosition = createVector(x, y);
    this._pressedMousePosition = createVector(x, y);

    //mouse stuff
    this._hover = false;
    this._isPressed = false;
    this._snappedToDropZone = false;

    //drawing stuff
    this._textSize = textSize();
  }

  //TODO: Fix (and find) the weird bug that rarely makes a dropZone stop working
  //remember to keep acceptable drop margins to less then half the size of the object dropped.
  //So we don't get weird behaviour of the object being within several drop zone simultaneously
  checkIfInDropZone(dropZone){
    let distance = this._draggedPosition.dist(dropZone.dropPosition);
    // if(dropZone.occupied){
    //   return;
    // }
    if(distance < dropZone.dropMargin){
      if(!dropZone.occupied){
        if(!this._isPressed){
          dropZone.occupied = true;
          dropZone.value = this._value;
          print('dropped');
          return true;
        }
        this._snappedToDropZone = dropZone;
        this._currentPosition = dropZone.dropPosition;
        print('attached');
      }
    }
    else if(this._snappedToDropZone === dropZone){
      print('detached');
      this._snappedToDropZone = undefined;
      dropZone.occupied = false;
      dropZone.value = undefined;
    }
  }

  update(){
    this._updateHover();
    // this._updatePressedState();
    if(this._isPressed){
      let deltaMouseVector = p5.Vector.sub(createVector(mouseX, mouseY), this._pressedMousePosition);
      let calculatedPosition = p5.Vector.add(this._pressedPosition, deltaMouseVector);
      this._draggedPosition = calculatedPosition;
      if(!this._snappedToDropZone){
        this._currentPosition = this._draggedPosition;
      }
    }else if(!this._snappedToDropZone){
      //Only if we're not snapped and not dragged should we return to home position;
      let increment = 80;
      let dist = this._homePosition.dist(this._currentPosition);
      if(dist < increment){
        this._currentPosition = this._homePosition;
      }else{
        let goalVector = p5.Vector.sub(this._homePosition, this._currentPosition);
        goalVector.setMag(increment);
        this._currentPosition.add(goalVector);
      }
    }
  }

  draw(){
    rect(this._currentPosition.x, this._currentPosition.y, this._width, this._height);
    text(this._text, this._currentPosition.x + this._textPositionOffset.x, this._currentPosition.y + this._textPositionOffset.y);
  }

  setHomePosition(x, y){
    this._homePosition.set(x,y);
  }

  _updateHover(){
    // Is mouse over object
    if ( mouseX > this._currentPosition.x
      && mouseX < this._currentPosition.x + this._width
      && mouseY > this._currentPosition.y
      && mouseY < this._currentPosition.y + this._height) {
      this._hover = true;
    }
    else {
      this._hover = false;
    }
  }

  updatePressedState(){
    if(mouseIsPressed){
      if(this._hover && !this._isPressed){
        //We are in a transition
        this._isPressed = true;
        //Let's save reference position
        this._pressedMousePosition.set(mouseX, mouseY);
        this._pressedPosition = this._currentPosition;//.copy();
        DraggableTextBox.mostRecentlyDragged = this;
        print('pressed');
      }
    }else{
      if(this._isPressed){
        //transition from pressed state
        this._isPressed = false;
        // DraggableTextBox.currentlyDragged = undefined;
      }
    }
  }
}

DraggableTextBox.mostRecentlyDragged = undefined;
