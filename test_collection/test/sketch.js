let table;
let currentRow;
let dataPlayer;
let timeSlider;
let playButton;
let playSpeed;

let spiderChart;
let barChart;
let lineChart;

function preload(){
	table = loadTable("data/kanot.csv", "csv", "header");
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	let timestampsAsStrings = table.getColumn('t');
	dataPlayer = new DataPlayer(timestampsAsStrings.map(Number));

	//after we've given the timestamps to the dataplayer, we remove them from our table.
	table.removeColumn('t');
	//Alos remove some other fucked up stuff (the other timestamps)
	table.removeColumn('gpsTsp');
	table.removeColumn('phoneTstmp');

	print(table.columns);

	spiderChart = new SpiderChart(table.columns);
	barChart = new BarChart(table.columns, 10, 'UP', 100);
	lineChart = new LineChart(table.columns, table.getArray(), 'UP');
	lineChart.turnOnColumn(1);
	lineChart.turnOnColumn(2);
	lineChart.turnOnColumn(9)

	timeSlider = createSlider(0, table.getRowCount()-1, 0, 1);
	timeSlider.position(600, 600);
	timeSlider.mousePressed(dataPlayer.temporaryPause.bind(dataPlayer));
	timeSlider.mouseReleased(dataPlayer.releaseTemporaryPause.bind(dataPlayer));

	playSpeed = new SlidableVariable('play speed');
	playSpeed.setPosition(50, 50);

	playButton = createButton(">");
	playButton.position(500, 600);
	playButton.mousePressed(dataPlayer.togglePlayback.bind(dataPlayer));
}

function draw() {
	background(20);

	dataPlayer.update();
	if(dataPlayer.playbackIsOn){
		timeSlider.elt.value = dataPlayer.getCurrentIndex();
	}{
		dataPlayer.setCurrentIndex(timeSlider.value());
	}

	if(dataPlayer.isUpdated){
		currentRow = table.getRow(dataPlayer.getCurrentIndex()).arr;

		spiderChart.setValues(currentRow);

		barChart.setValues(currentRow);
		lineChart.setCurrentIndex(dataPlayer.getCurrentIndex());

	}

	playSpeed.update();
	playSpeed.draw();

	lineChart.draw(200,350);

	barChart.draw(200, 600);
	spiderChart.draw(800, 400);
}
