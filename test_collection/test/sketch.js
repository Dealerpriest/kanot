let table;
let yAccData;
let timestampsData;
let currentIndexData = 0;

let timeSlider;
let playButton;
let playbackIsOn = false;
let playbackTempInactive = false;

let playbackSpeed = 1;
let playbackStartstamp = 0;
let playbackStartIndex = 0;
let playHeadPosition = 0;

function preload(){
	table = loadTable("data/kanot.csv", "csv", "header");
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	yAccData = table.getColumn("yAcc");
	let tempArray = table.getColumn('t');
	timestampsData = tempArray.map(Number);

	timeSlider = createSlider(0, table.getRowCount(), 0, 1);
	timeSlider.position(600, 600);
	timeSlider.mousePressed(() => {if(playbackIsOn){playbackTempInactive = true; togglePlayback();}});
	timeSlider.mouseReleased(() => {if(playbackTempInactive){playbackTempInactive = false; togglePlayback();}});

	playButton = createButton(">");
	playButton.position(500, 600);
	playButton.mousePressed(togglePlayback);
}

function draw() {
	if(playbackIsOn){
		let indexJumps = 0;
		let millisPosition = millis() - playbackStartstamp;
		playHeadPosition = (playbackSpeed * millisPosition) + timestampsData[playbackStartIndex];

		while(timestampsData[currentIndexData] <= playHeadPosition){
			currentIndexData++;
			indexJumps++;
			if(currentIndexData >= table.getRowCount()){
				print("resetting playback");
				resetPlayback();
				break;
			}
		}
		// print("nr of increments: " + indexJumps);
		timeSlider.elt.value = currentIndexData;
	}else{
		currentIndexData = timeSlider.value();
	}


	background(255);
	drawBar(300, 400, yAccData[currentIndexData], 1, "y-Acc");
}

let barHeight = 400;
function drawBar(leftx, lowery, value, max, name){
	let height = map(value, -max, max, 0, barHeight);
	fill(120, 0, 80);
	noStroke();
	rect(leftx, lowery, 25, -height);
	textSize(32);
	text(name, leftx-10, lowery+32);
}
function resetPlayback(){
	currentIndexData = 0;
	playbackStartIndex = 0;
	playbackStartstamp = millis();
}

function togglePlayback(){
	// resetPlayback();
	if(!playbackIsOn){
		playbackStartstamp = millis();
		playbackStartIndex = currentIndexData;
	}
	playbackIsOn = !playbackIsOn;
}
