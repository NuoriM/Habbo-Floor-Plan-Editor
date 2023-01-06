var X;
var Y;
var OffsetX;
var OffsetY;

var Mouse = false;
var isMouseDown = false;
var MouseMode;

var Tiles = [];

document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('mousedown', (event) => {
	if (event.button == 0) {
		isMouseDown = true;
	}
});
document.addEventListener('mouseup', () => isMouseDown = false);

function openImportPopup() {
	var popup = document.querySelector("#app-load-popup");
	popup.classList.toggle("d-none");
}

function Tile(x, y, offsetX, offsetY, level) {

	var that = this;

	that.x = x;
	that.y = y;
	that.offsetX = offsetX;
	that.offsetY = offsetY;
	that.draw = true;
	that.level = getLevel(level);

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
				if(controls.tool == drawTools.NONE){
					TileClick(that);
				}
			}
			TileOver(that);
		};
	
		E.onmouseout = function () {
			TileOut(that);
		};
	
		E.onclick = function () {
			if(controls.tool == drawTools.NONE){
				TileClick(that);
			}
		};
	
		E.onmousedown = function () { 
			if(controls.tool == drawTools.NONE){
				TileClick(that);
			}
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
	if (!isInt(xX) || !isInt(yY)) {
		alert("Invalid Size");
		return;
	}else if(isInt(xX) && isInt(yY)){
		if(xX > controls.maxRoomSize ||
			yY > controls.maxRoomSize){
				alert("Room Exceeds the Max Size (32x32)");
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

	console.log(Tiles);

	DrawMap();
}

function DrawMap() {
	var Output = "";

	for (const tile of Tiles) {
		if(tile.draw) {
			Output += '<img id="tile' + tile.x + '-' + tile.y + '" class="square" style="top: ' + tile._y + 'px; left: ' + tile._x + 'px;" src="./images/on.png" alt="Click To Remove" />';
		} else {
			Output += '<img id="tile' + tile.x + '-' + tile.y + '" class="square" style="top: ' + tile._y + 'px; left: ' + tile._x + 'px;" src="./images/off.png" alt="Click To Add" />';
		}
	}
	
	var Preview = document.getElementById('preview');
	Preview.style.width = ((X * 32) + (Y * +32) + 50) + 'px';
	Preview.style.height = ((X * 16) + (Y * +16) + 50 + 8) + 'px';
	Preview.innerHTML = Output;

	var MapImg = document.getElementById('mapimg');
	MapImg.style.width = ((X * 32) + (Y * +32) + 50) + 'px';
	MapImg.style.height = ((X * 16) + (Y * +16) + 50 + 8) + 'px';

	RefreshExport();
}

function TileOver(tile) {
	if (!Mouse) {
		if(controls.mode == drawMode.CREATE){
			document.getElementById('tile' + tile.x + '-' + tile.y).src = './images/add.png';
		}else {
			document.getElementById('tile' + tile.x + '-' + tile.y).src = './images/del.png';
		}
	}
}
function TileOut(tile) {
	if (!Mouse) {
		if (tile.draw) {
			document.getElementById('tile' + tile.x + '-' + tile.y).src = './images/on.png';
		} else {
			document.getElementById('tile' + tile.x + '-' + tile.y).src = './images/off.png';
		}
	}
}
function TileClick(tile) {
	console.log(Tiles);

	if (!Mouse) {
		if(controls.mode == drawMode.CREATE) {
			MouseMode = true;
			tile.draw = true;
		} else if(controls.mode == drawMode.REMOVE) {
			MouseMode = false;
			tile.draw = false;
		}

		if(!tile.draw) {
			document.getElementById('tile'+tile.x+'-'+tile.y).src = './images/off.png';
		}

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
	var Export = "";

	for (const tile of correctToExportTiles()) {
		if(tile.draw) {
			Export += '0';
		} else {
			Export += 'x';
		}
		if(tile.x >= X-1) {
			Export += '\n';
		}
	}

	document.getElementById('export').value = Export;
}

function isInt(x) {
	var y = parseInt(x);
	if (isNaN(y)) return false;
	return x == y && x.toString() == y.toString();
}

function ParseMap() {
	var MapData = document.getElementById('import').value;
	
	var lines = MapData.split('\n');

	Mouse = false;
	OffsetX = ((lines[0].length * 32) - 7);
	OffsetY = 25;
	document.getElementsByTagName("map")[0].innerHTML = "";

	var corrected = correctToParseMap(lines);

	Tiles = [];
	var Output = "";
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
			var tile = new Tile(X, Y, OffsetX, OffsetY, corrected[X][Y]);
			
			if (corrected[X][Y] == 'X' || corrected[X][Y] == 'x') {
				Output += '<img id="tile' + tile.x + '-' + tile.y + '" class="square" style="top: ' + tile._y + 'px; left: ' + tile._x + 'px;" src="./images/off.png" alt="Click To Add" />';
				tile.draw = false;
			}
			else if (corrected[X][Y] == '0') {
				Output += '<img id="tile' + tile.x + '-' + tile.y + '" class="square" style="top: ' + tile._y + 'px; left: ' + tile._x + 'px;" src="./images/on.png" alt="Click To Remove" />';
				tile.draw = true;
			}

			Tiles.push(tile);

			tile.addTile();
		}
	}

	var Preview = document.getElementById('preview');
	//Preview.style.width = ((corrected.length*32)+(corrected[0].length*+32)+50) + 'px';
	//Preview.style.height = ((corrected.length*16)+(corrected[0].length*+16)+50+8) + 'px';
	Preview.innerHTML = Output;

	var MapImg = document.getElementById('mapimg');
	MapImg.style.width = ((corrected.length * 32) + (corrected[0].length * +32) + 50) + 'px';
	MapImg.style.height = ((corrected.length * 16) + (corrected[0].length * +16) + 50 + 8) + 'px';

	RefreshExport();
	document.getElementById('controls').style.width = 180 + 'px';
}