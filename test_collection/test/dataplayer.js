
class DataPlayer {
  constructor(timestampsArray){
    this.playbackIsOn = false;
    this.isUpdated = false;

    this._timestamps = timestampsArray;
    this._currentIndex = 0;
    this._previousIndex = -1;


    this._temporaryPaused = false;

    this._updateStamp = millis();
    // this._initialTimestamp =
    this._playbackSpeed = 1;
    this._playbackStartstamp = 0;
    this._timestampsStartIndex = 0;
    this._playHeadPosition = this._timestamps[0];
  }

  getCurrentTime(){
    return this._playHeadPosition;
  }

  getCurrentIndex(){
    return this._currentIndex;
  }

  setCurrentIndex(index){
    this._previousIndex = this._currentIndex;
    this._currentIndex = index;
    this._playHeadPosition = this._timestamps[index];
  }

  // NOTE: Current implementation drifts a bit. 8ms for one dataset when speed factor was 1.0. This is probably acceptable in the current context.
  // We want the speed factor to be able to be updated during playback, and current implementation allows that.
  // We could implement a behaviour where the reference timestamp is saved only when we update speed factor. But that's for laterzz...
  update(){
    if(this.playbackIsOn){
      let deltaMillis = millis() - this._updateStamp;
      this._updateStamp = millis();
      // print(deltaMillis);

      let deltaPlayhead = deltaMillis * this._playbackSpeed;
      // print(deltaPlayhead);
      this._playHeadPosition += deltaPlayhead;

  		// let millisPosition = millis() - this._playbackStartstamp;
  		// this._playHeadPosition = (this._playbackSpeed * millisPosition) + firstTimestamp;

      // if(this._timestamps[this._currentIndex] > this._playHeadPosition){
      //   this.isUpdated = false;
      //   return;
      //   ///Nothing to do. Bail out before we corrupt the isUpdated variable!
      // }
  		while(this._timestamps[this._currentIndex] <= this._playHeadPosition){
        // this.isUpdated = true;
        this._previousIndex = this._currentIndex;
  			this._currentIndex++;
  			if(this._currentIndex >= this._timestamps.length){
  				print("resetting playback");
  				this.resetPlayback();
  				break;
  			}
  		}
  	}
    if(this._currentIndex != this._previousIndex){
      this.isUpdated = true;
    }else{
      this.isUpdated = false;
    }
  }

  setPlaybackSpeed(speed){
    this._playbackSpeed = speed;
  }

  resetPlayback(){
  	this._currentIndex = 0;
  	// this._timestampsStartIndex = 0;
  	this._playbackStartstamp = millis();

    this._playHeadPosition = this._timestamps[0];
  }

  stopPlayback(){
    if(this.playbackIsOn){
      this.togglePlayback();
    }
  }

  continuePlayback(){
    if(!this.playbackIsOn){
      this.togglePlayback();
    }
  }

  togglePlayback(){
    print("playback toggled");
    // print(this);
    this.playbackIsOn = !(this.playbackIsOn);

    if(this.playbackIsOn){
  		// this._playbackStartstamp = millis();
  		// this._timestampsStartIndex = this._currentIndex;
      this._updateStamp = millis();
  	}
  }

  temporaryPause(){
    if(this.playbackIsOn){
      this._temporaryPaused = true;
      this.stopPlayback();
    }
  }

  releaseTemporaryPause(){
    if(this._temporaryPaused){
      this.continuePlayback();
    }
    this._temporaryPaused = false;
  }
}
