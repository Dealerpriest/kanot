let currentRow;
let dataPlayer;

let timeSlider;
let playButton;

function preload(){
	table = loadTable("data with cool values.csv", "csv", "header");
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	let timestampsAsStrings = table.getColumn('name of the column with timestamps in milliseconds');
  //The timestamps are (maybe) stored as strings. Let's convert them to numbers inside the function call
	dataPlayer = new DataPlayer(timestampsAsStrings.map(Number));

	//after we've given the timestamps to the dataplayer, we remove them from our table. If we want to. I want to...
	table.removeColumn('t');

  //Let's create a slider for setting the playhead
	timeSlider = createSlider(0, table.getRowCount(), 0, 1);
	timeSlider.position(600, 600);
	timeSlider.mousePressed(dataPlayer.temporaryPause.bind(dataPlayer));
	timeSlider.mouseReleased(dataPlayer.releaseTemporaryPause.bind(dataPlayer));

  //Let's create a button for toggling playback
	playButton = createButton(">");
	playButton.position(500, 600);
	playButton.mousePressed(dataPlayer.togglePlayback.bind(dataPlayer));
}

function draw() {
	background(255);
	dataPlayer.update();
	if(dataPlayer.playbackIsOn){
    //If we are playing the data, we want to set the slider.
		timeSlider.elt.value = dataPlayer.getCurrentIndex();
	}{
    //if not we want to read it instead.
		dataPlayer.setCurrentIndex(timeSlider.value());
	}

  //Is the playhead position updated?
	if(dataPlayer.isUpdated){
    //Update our current data by retrieving at the right index
		currentRow = table.getRow(dataPlayer.getCurrentIndex()).arr;

    //Now we can put our updated values into our visualizations here
    thingThatVisualizesData.UpdateWithNewValues(currentRow);
	}

  thingThatVisualizesData.draw();

}
