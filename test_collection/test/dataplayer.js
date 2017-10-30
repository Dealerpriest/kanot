
class DataPlayer {
  constructor(timestampsArray){
    this.timestamps = timestampsArray;
    this.currentIndexData = 0;

    this.playbackIsOn = false;
    this.temporaryPaused = false;

    this.playbackSpeed = 3;
    this.playbackStartstamp = 0;
    this.timestampsStartIndex = 0;
    this.playHeadPosition = 0;
  }

  getCurrentIndex(){
    return this.currentIndexData;
  }

  setCurrentIndex(index){
    this.currentIndexData = index;
  }

  updatePlayhead(){
    if(this.playbackIsOn){
      // print("currentIndexData: " + this.currentIndexData);
  		let millisPosition = millis() - this.playbackStartstamp;
  		this.playHeadPosition = (this.playbackSpeed * millisPosition) + this.timestamps[this.timestampsStartIndex];

  		while(this.timestamps[this.currentIndexData] <= this.playHeadPosition){
  			this.currentIndexData++;
  			if(this.currentIndexData >= this.timestamps.length){
  				print("resetting playback");
  				this.resetPlayback();
  				break;
  			}
  		}
  	}
  }

  setPlaybackSpeed(speed){
    this.playbackSpeed = speed;
  }

  resetPlayback(){
  	this.currentIndexData = 0;
  	this.timestampsStartIndex = 0;
  	this.playbackStartstamp = millis();
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
  		this.playbackStartstamp = millis();
  		this.timestampsStartIndex = this.currentIndexData;
  	}
  }

  temporaryPause(){
    if(this.playbackIsOn){
      this.temporaryPaused = true;
      this.stopPlayback();
    }
  }

  releaseTemporaryPause(){
    if(this.temporaryPaused){
      this.continuePlayback();
    }
    this.temporaryPaused = false;
  }
}
