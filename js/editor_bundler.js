var X;
var Y;
var OffsetX;
var OffsetY;
var Mouse = false;
var isMouseDown = false;
var MouseMode;
var Tiles = [];

document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener("DOMContentLoaded", function() {
	drawPalette();
	updatePalette();
});

document.addEventListener('keydown', (event) => {
	if(event.shiftKey && controls.mode == drawMode.CREATE){
		controls.mode = drawMode.REMOVE;
	}
});

document.addEventListener('keyup', (event) => {
	if(!event.shiftKey && controls.mode == drawMode.REMOVE){
		controls.mode = drawMode.CREATE;
	}
});

document.addEventListener('mousedown', (event) => {
	if (event.button == 0) {
		isMouseDown = true;
	}
});
document.addEventListener('mouseup', () => isMouseDown = false);

function toggleImportPopup() {
	var popup = document.querySelector("#app-import-popup");
	popup.classList.toggle("d-none");
}

function Tile(x, y, offsetX, offsetY, level, height=0, color = '0065FF') {
	var that = this;

	that.x = x;
	that.y = y;
	that.offsetX = offsetX;
	that.offsetY = offsetY;
	that.draw = true;
	that.level = 0;//getLevel(level);
	that.height = height;
	that.color = color;

	that._x = ((x * 32) + (y * -32) + offsetX);
	that._y = ((x * 16) + (y * 16) + offsetY) + that.level;

	that.coords = "";

	that.coords += (that._x + 31); // TopX
	that.coords += ",";
	that.coords += (that._y); // TopY
	that.coords += ",";

	that.coords += (that._x + 63); // RightX
	that.coords += ",";
	that.coords += (that._y + 16); // RightY
	that.coords += ",";

	that.coords += (that._x + 32); // BottomX
	that.coords += ",";
	that.coords += (that._y + 31); // BottomY
	that.coords += ",";
	that.coords += (that._x + 31); // BottomX
	that.coords += ",";
	that.coords += (that._y + 31); // BottomY
	that.coords += ",";

	that.coords += (that._x + 0); // LeftX
	that.coords += ",";
	that.coords += (that._y + 16); // LeftY		

	that.addTile = function() {
		var E = document.createElement("area");
		E.shape = "poly";
		E.coords = that.coords;
	
		document.getElementsByTagName("map")[0].appendChild(E);
		
		E.onmouseover = function () {
			if (isMouseDown) {
				TileClick(that);
			}
			TileOver(that);
		};
	
		E.onmouseout = function () {
			TileOut(that);
		};
	
		E.onclick = function () {
			TileClick(that);
		};
	
		E.onmousedown = function () { 
			TileClick(that);
		};
	}

	function getLevel(level) {

		const levels = {
			"x": 0,
			"a": 10,
			"b": 11,
			"c": 12,
			"d": 13,
			"e": 14,
			"f": 15,
			"g": 16,
			"h": 17,
			"i": 18,
			"j": 19,
			"k": 20,
			"l": 21,
			"m": 22,
			"n": 23,
			"o": 24,
			"p": 25,
			"q": 26,
			"r": 27,
			"s": 28,
			"t": 29
		}

		if(!isNaN(parseInt(level))) {
			return ( (level * 40) *-1);
		} else {
			return ((levels[level] * 40) * -1);
		}
	}
}

function PrepareBlankMap(xX, yY) {
	Tiles = [];
	if (!isInt(xX) || !isInt(yY)) {
		alert("Invalid Size");
		return;
	}else if(isInt(xX) && isInt(yY)){
		if(xX > controls.maxRoomSize ||
			yY > controls.maxRoomSize){
				alert("Room Exceeds the Max Size (70x70)");
				return;
		}
	}
	
	Mouse = false;
	X = xX;
	Y = yY;
	OffsetX = ((yY * 32) - 7);
	OffsetY = 25;

	document.getElementsByTagName("map")[0].innerHTML = "";

	var x = 0, y = 0;
	while(x < xX) {
		while(y < yY){
			
			var tile = new Tile(x, y, OffsetX, OffsetY, "0");
			
			Tiles.push(tile);
			tile.addTile();
			y++;
		}
		y = 0;
		x++;
	}

	controls.lastLoadedRoom = Tiles;
	DrawMap();
}

function DrawMap() {
	var Output = "";
	var preview = document.getElementById('preview');
	var mapImg = document.getElementById('mapimg');

	for (const tile of Tiles) {
		if(tile.draw) {
			Output += `<img id="tile` + tile.x + `-` + tile.y + `" class="square"
			style="top: ` + tile._y + `px; left: ` + tile._x + `px; `+Utils.hexToHueRotation("#"+tile.color)+`"
			src="./images/on.png" />
			
			<img id="tile` + tile.x + `-` + tile.y + `-outline" class="square"
			style="top: ` + tile._y + `px; left: ` + tile._x + `px;"
			src="./images/tile-outline.png" />

			`;
		} else {
			Output += '<img id="tile' + tile.x + '-' + tile.y + '" class="square" style="top: ' + tile._y + 'px; left: ' + tile._x + 'px;" src="./images/off.png" />';
		}
	}
	
	preview.style.width = ((X * 32) + (Y * +32) + 50) + 'px';
	preview.style.height = ((X * 16) + (Y * +16) + 50 + 8) + 'px';
	preview.innerHTML = Output;

	mapImg.style.width = ((X * 32) + (Y * +32) + 50) + 'px';
	mapImg.style.height = ((X * 16) + (Y * +16) + 50 + 8) + 'px';

	RefreshExport();
}

function TileOver(tile) {
	// if (!Mouse) {
	// 	if(controls.mode == drawMode.CREATE){
	// 		document.getElementById('tile' + tile.x + '-' + tile.y).src = './images/add.png';
	// 	}else {
	// 		document.getElementById('tile' + tile.x + '-' + tile.y).src = './images/del.png';
	// 	}
	// }
	if(!Mouse) {
		var cursorOverlay = document.querySelector("#cursorMode");
		if(controls.mode == drawMode.CREATE){
			cursorOverlay.src = "./images/add.png";
			cursorOverlay.style = "top:"+tile._y+"px;"+"left:"+tile._x+"px;";
		}else {
			cursorOverlay.src = "./images/del.png";
			cursorOverlay.style = "top:"+tile._y+"px;"+"left:"+tile._x+"px;";
		}
	}
}
function TileOut(tile) {
	if (!Mouse) {
		var cursorOverlay = document.querySelector("#cursorMode");
		if (tile.draw) {
			var selTile = document.getElementById('tile' + tile.x + '-' + tile.y)
			selTile.src = './images/on.png';
			selTile.style.filter = Utils.hexToHueRotation("#"+tile.color);
			document.getElementById('tile'+tile.x+'-'+tile.y+"-outline").src = './images/tile-outline.png';
		} else {
			document.getElementById('tile' + tile.x + '-' + tile.y).src = './images/off.png';
		}
		cursorOverlay.src = "./images/cursor-none.png";
	}
}
function TileClick(tile) {

	if (!Mouse) {
		if(controls.mode == drawMode.CREATE) {
			MouseMode = true;
			tile.draw = true;
			tile.height = Utils.convertInt(controls.tileHeight);
			tile.color = paletteTileColors.find(item => item.key == controls.tileHeight).color;
			var theTile = document.getElementById('tile'+tile.x+'-'+tile.y);
			theTile.style.filter = Utils.hexToHueRotation("#"+tile.color).replace('filter: ','').replace(";", "");
		} else if(controls.mode == drawMode.REMOVE) {
			MouseMode = false;
			tile.draw = false;
			tile.height = 'x';
		}
		if(!tile.draw) {
			document.getElementById('tile'+tile.x+'-'+tile.y).src = './images/off.png';
			document.getElementById('tile'+tile.x+'-'+tile.y+"-outline").src = './images/off.png';
		}

		TileOver(tile);
		RefreshExport();
	} else {
		Mouse = false;
	}
}

function correctToExportTiles() {
	return Tiles.sort((a, b) => (a.y == b.y) ? a.x - b.x : a.y - b.y );
}

function correctToParseMap(lines) {
	var corrected = new Array();
	for (var Y = 0; Y < lines[0].length; Y++) {
		corrected[Y] = new Array();
	}
	for (var X = 0; X < lines.length; X++) {
		for (var Y = 0; Y < lines[X].length; Y++) {
			corrected[Y] += lines[X][Y];
		}
	}
	return corrected;
}

function RefreshExport() {
	var xport = "";

	for (const tile of correctToExportTiles()) {
		if(tile.draw) {
			if(paletteTileColors.filter(item => item.key == tile.height)){
				xport += tile.height;
			}
		} else {
			xport += 'x';
		}
		if(tile.x >= X-1) {
			xport += '\n';
		}
	}

	document.getElementById('export').value = xport;
}

function isInt(x) {
	var y = parseInt(x);
	if (isNaN(y)) return false;
	return x == y && x.toString() == y.toString();
}

function ParseMap() {
	var mapData = document.getElementById('import').value;
	var preview = document.getElementById('preview');
	var mapImg = document.getElementById('mapimg');
	document.getElementsByTagName("map")[0].innerHTML = "";
	var lines = mapData.split('\n');
	var corrected = correctToParseMap(lines);
	
	Tiles = [];
	var output = "";

	Mouse = false;
	OffsetX = ((lines[0].length * 32) - 7);
	OffsetY = 25;	
	for (var X = 0; X < corrected.length; X++) {
		if (corrected[X].length == 0)
			break;
		if (corrected[X][0] == '\r')
			break;
		if (corrected[X].length != corrected[0].length) {
			alert("Invalid Map! ALL LINES MUST BE THE SAME LENGTH!");
			return;
		}

		for (var Y = 0; Y < corrected[X].length; Y++) {
			var tile = new Tile(X, Y, 
				OffsetX, OffsetY,
				corrected[X][Y]);
			console.log(paletteTileColors.find(item => item.key == corrected[X][Y]).key);
			if (corrected[X][Y] == 'X' || corrected[X][Y] == 'x') {
				output += `<img id="tile${tile.x}-${tile.y}" class="square"
					style="top: ${tile._y}px; left: ${tile._x}px;"src="./images/off.png" />
				
					<img id="tile${tile.x}-${tile.y}-outline" class="square"
						style="top: ${tile._y}px; left: ${tile._x}px;"
						src="./images/off.png" />
				`;
				tile.draw = false;
			}
			else if (corrected[X][Y] == paletteTileColors.find(item => item.key == corrected[X][Y]).key) { //corrected[X][Y] == '0'
				output += `<img id="tile${tile.x}-${tile.y}" class="square"
					style="top: ${tile._y}px; left: ${tile._x}px; ${Utils.hexToHueRotation("#"+paletteTileColors.find(item => item.key == corrected[X][Y]).color)}"
					src="./images/on.png" />
					
					<img id="tile${tile.x}-${tile.y}-outline" class="square"
						style="top: ${tile._y}px; left: ${tile._x}px;"
						src="./images/tile-outline.png" />
					`;
				tile.draw = true;
			}
			Tiles.push(tile);
			controls.lastLoadedRoom = Tiles;
			tile.addTile();
		}
	}

	preview.innerHTML = output;
	mapImg.style.width = ((corrected.length * 32) + (corrected[0].length * +32) + 50) + 'px';
	mapImg.style.height = ((corrected.length * 16) + (corrected[0].length * +16) + 50 + 8) + 'px';

	RefreshExport();
	document.getElementById('controls').style.width = 180 + 'px';
}

function drawPalette(){
	const paletteField = document.querySelector("#palette");
	let paletteHTML = "";
	for (let i = 0; i < paletteTileColors.length; i++) {
		const item = paletteTileColors[i];
		paletteHTML+=`
		<input id="radio-${item.key}" class="app-tile-palette-item" type="radio" name="palette-color"
			style="background:#${item.color};" onclick="controls.tileHeight='${item.key}'"/>`;
	}
	paletteField.innerHTML = paletteHTML;
}

function updatePalette(){
	document.getElementById(`radio-${controls.tileHeight}`).checked = true;
}