let table;
let yAccData;

let dataPlayer;

let timeSlider;
let playButton;

function preload(){
	table = loadTable("data/kanot.csv", "csv", "header");
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	yAccData = table.getColumn("yAcc");
	let tempArray = table.getColumn('t');
	// timestampsData = tempArray.map(Number);

	dataPlayer = new DataPlayer(tempArray.map(Number));

	timeSlider = createSlider(0, table.getRowCount(), 0, 1);
	timeSlider.position(600, 600);
	timeSlider.mousePressed(dataPlayer.temporaryPause.bind(dataPlayer));
	timeSlider.mouseReleased(dataPlayer.releaseTemporaryPause.bind(dataPlayer));

	playButton = createButton(">");
	playButton.position(500, 600);
	playButton.mousePressed(dataPlayer.togglePlayback.bind(dataPlayer));
}

function draw() {
	background(255);
	dataPlayer.updatePlayhead();

	if(dataPlayer.playbackIsOn){
		timeSlider.elt.value = dataPlayer.getCurrentIndex();
	}{
		dataPlayer.setCurrentIndex(timeSlider.value());
	}
	drawBar(300, 400, yAccData[dataPlayer.getCurrentIndex()], 1, "y-Acc");
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
