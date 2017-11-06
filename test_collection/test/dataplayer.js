
class DataPlayer {
  constructor(timestampsArray){
    this.playbackIsOn = false;
    this.isUpdated = false;

    this._timestamps = timestampsArray;
    this._currentIndex = 0;
    this._previousIndex = -1;


    this._temporaryPaused = false;

    this._playbackSpeed = 3;
    this._playbackStartstamp = 0;
    this._timestampsStartIndex = 0;
    this._playHeadPosition = 0;
  }

  getCurrentIndex(){
    return this._currentIndex;
  }

  setCurrentIndex(index){
    this._previousIndex = this._currentIndex;
    this._currentIndex = index;
  }

  update(){
    if(this.playbackIsOn){
      // print("_currentIndex: " + this._currentIndex);
  		let millisPosition = millis() - this._playbackStartstamp;
  		this._playHeadPosition = (this._playbackSpeed * millisPosition) + this._timestamps[this._timestampsStartIndex];

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
  	this._timestampsStartIndex = 0;
  	this._playbackStartstamp = millis();
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
  		this._playbackStartstamp = millis();
  		this._timestampsStartIndex = this._currentIndex;
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
