var Map;
var OffsetX;
var OffsetY;

var Mouse = false;
var isMouseDown = false;
var MouseMode;
var MousedMap;
var controls = {
	mode: drawMode.CREATE,
}

//Disable Right Click
document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('mousedown', (event) => {
	if (event.button == 0) {
		isMouseDown = true;
	}
});
document.addEventListener('mouseup', () => isMouseDown = false);

//TileClick(X, Y);
// this.documentElement.addEventListener('mousemove', function(event){
// 	console.log(event);
// });
//window.addEventListener('mousemove', function(e){
//console.log(e.offsetX,e.offsetY, e);
//})

// document.addEventListener('mousemove', function(event) {
// 	if(isMouseDown) {
// 		console.log(event.target.className);
// 	}
// });

function openImportPopup() {
	var popup = document.querySelector("#app-load-popup");
	popup.classList.toggle("d-none");
}

function AddTileArea(C, X, Y) {
	var E = document.createElement("area");
	E.shape = "poly";
	E.coords = C;
	document.getElementsByTagName("map")[0].appendChild(E);
	E.onmouseover = function () {
		if (isMouseDown) {
			TileClick(X, Y);
		}
		TileOver(X, Y);
	};
	E.onmouseout = function () { TileOut(X, Y); };
	E.onclick = function () { TileClick(X, Y); };
	E.onmousedown = function () { TileClick(X, Y); };
	// E.addEventListener('mousedown', function(event){
	// 	TileClick(X, Y);
	// 	console.log(X, Y, event.target);
	// 	//window.addEventListener('mousemove', function(e){
	// 		//console.log(e.offsetX,e.offsetY, e);
	// 	//})
	// })
}

function PrepareBlankMap(X, Y) {
	if (!isInt(X) || !isInt(Y)) {
		alert("Invalid Size");
		return;
	}
	Map = new Array();
	MousedMap = new Array();
	Mouse = false;
	OffsetX = ((Y * 32) - 7);
	OffsetY = 100;

	document.getElementsByTagName("map")[0].innerHTML = "";

	for (var x = 0; x < X; x++) {
		Map[x] = new Array();
		MousedMap[x] = new Array();
		for (var y = 0; y < Y; y++) {
			Map[x][y] = true;
			// var tileOffset = getRandomRange(0, TILEOFFSET.length);
			// console.log(tileOffset);
			var _x = ((x * 32) + (y * -32) + OffsetX);
			var _y = ((x * 16) + (y * 16) + OffsetY);

			var Coords = "";
			Coords += (_x + 31); // TopX
			Coords += ",";
			Coords += (_y); // TopY
			Coords += ",";

			Coords += (_x + 63); // RightX
			Coords += ",";
			Coords += (_y + 16); // RightY
			Coords += ",";

			Coords += (_x + 32); // BottomX
			Coords += ",";
			Coords += (_y + 31); // BottomY
			Coords += ",";
			Coords += (_x + 31); // BottomX
			Coords += ",";
			Coords += (_y + 31); // BottomY
			Coords += ",";

			Coords += (_x + 0); // LeftX
			Coords += ",";
			Coords += (_y + 16); // LeftY

			AddTileArea(Coords, x, y); //Altura deve ficar aqui
		}
	}
	DrawMap();
	ResetMousedMap();
}

function DrawMap() {
	var X = Map.length;
	var Y = Map[0].length;

	var Output = "";
	for (var x = 0; x < X; x++) {
		for (var y = 0; y < Y; y++) {
			var _x = ((x * 32) + (y * -32) + OffsetX);
			var _y = ((x * 16) + (y * 16) + OffsetY);
			//_y+getRandomRange(0, TILEOFFSET.length) * 5; //Altura deve ficar aqui
			//console.log(_y);
			//A altura é de 5 por 5
			if (Map[x][y])
				Output += '<img id="tile' + x + '-' + y + '" class="square" style="top: ' + _y + 'px; left: ' + _x + 'px;" src="./images/on.png" alt="Click To Remove" />';
			else
				Output += '<img id="tile' + x + '-' + y + '" class="square" style="top: ' + _y + 'px; left: ' + _x + 'px;" src="./images/off.png" alt="Click To Add" />';
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

function RedrawMap() {
	var X = Map.length;
	var Y = Map[0].length;

	for (var x = 0; x < X; x++) {
		for (var y = 0; y < Y; y++) {
			if (Map[x][y])
				document.getElementById('tile' + x + '-' + y).src = './images/on.png';
			else
				document.getElementById('tile' + x + '-' + y).src = './images/off.png';
		}
	}

	RefreshExport();
}

function TileOver(X, Y) {
	if (!Mouse) {
		if(controls.mode == drawMode.CREATE){
			document.getElementById('tile' + X + '-' + Y).src = './images/add.png';
		}else {
			document.getElementById('tile' + X + '-' + Y).src = './images/del.png';
		}
		// if (Map[X][Y]) {
		// 	document.getElementById('tile' + X + '-' + Y).src = './images/del.png';
		// }
		// else {
		// 	document.getElementById('tile' + X + '-' + Y).src = './images/add.png';
		// }
	}
	else {
		if (!MousedMap[X][Y] && Map[X][Y] == MouseMode) {
			MousedMap[X][Y] = true;
			Map[X][Y] = !MouseMode;
			RedrawMap();
		}
	}
}
function TileOut(X, Y) {
	if (!Mouse) {
		if (Map[X][Y]) {
			document.getElementById('tile' + X + '-' + Y).src = './images/on.png';
		}
		else {
			document.getElementById('tile' + X + '-' + Y).src = './images/off.png';
		}
	}
}
function TileClick(X, Y) {
	// Mouse = true;
	if (!Mouse) {
		if(controls.mode == drawMode.CREATE) {
			MouseMode = true;
			Map[X][Y] = true;
		} else if(controls.mode == drawMode.REMOVE) {
			MouseMode = false;
			Map[X][Y] = false;
		}
		// MouseMode = Map[X][Y];
		// Map[X][Y] = !Map[X][Y];
		RedrawMap();
	} else {
		Mouse = false;
		ResetMousedMap();
	}

	// if(document.getElementById('toggle').checked)
	// {
	// 	if(!Mouse)
	// 	{
	// 		Mouse = true;
	// 		MouseMode = Map[X][Y];
	// 		Map[X][Y] = !Map[X][Y];
	// 		RedrawMap();
	// 	}
	// 	else
	// 	{
	// 		Mouse = false;
	// 		ResetMousedMap();
	// 	}
	// }
	// else
	// {
	// 	Map[X][Y] = !Map[X][Y];
	// 	RedrawMap();
	// }
}

function RefreshExport() {
	var X = Map.length;
	var Y = Map[0].length;

	var Export = "";

	for (var y = 0; y < Y; y++) {
		for (var x = 0; x < X; x++) {
			if (Map[x][y])
				Export += '0';
			else
				Export += 'X';
		}
		Export += '\n';
	}

	document.getElementById('export').value = Export;
}

function ResetMousedMap() {
	var X = Map.length;
	var Y = Map[0].length;
	for (var x = 0; x < X; x++) {
		for (var y = 0; y < Y; y++) {
			MousedMap[x][y] = false;
		}
	}
}

function isInt(x) {
	var y = parseInt(x);
	if (isNaN(y)) return false;
	return x == y && x.toString() == y.toString();
}

function ParseMap() {
	var MapData = document.getElementById('import').value;
	var NewMap = new Array();

	var Lines = MapData.split('\n');

	Mouse = false;
	OffsetX = ((Lines[0].length * 32) - 7);
	OffsetY = 25;
	document.getElementsByTagName("map")[0].innerHTML = "";

	var Rotation = new Array();
	for (var Y = 0; Y < Lines[0].length; Y++) {
		Rotation[Y] = new Array();
	}
	for (var X = 0; X < Lines.length; X++) {
		for (var Y = 0; Y < Lines[X].length; Y++) {
			Rotation[Y] += Lines[X][Y];
		}
	}


	var Output = "";
	MousedMap = new Array();
	for (var X = 0; X < Rotation.length; X++) {
		if (Rotation[X].length == 0)
			break;
		if (Rotation[X][0] == '\r')
			break;
		if (Rotation[X].length != Rotation[0].length) {
			alert("Invalid Map! ALL LINES MUST BE THE SAME LENGTH!");
			return;
		}

		NewMap[X] = new Array();
		MousedMap[X] = new Array();
		for (var Y = 0; Y < Rotation[X].length; Y++) {
			var _x = ((X * 32) + (Y * -32) + OffsetX);
			var _y = ((X * 16) + (Y * 16) + OffsetY);

			if (Rotation[X][Y] == 'X' || Rotation[X][Y] == 'x') {
				NewMap[X][Y] = false;
				Output += '<img id="tile' + X + '-' + Y + '" class="square" style="top: ' + _y + 'px; left: ' + _x + 'px;" src="./images/off.png" alt="Click To Add" />';
			}
			else if (Rotation[X][Y] == '0') {
				NewMap[X][Y] = true;
				Output += '<img id="tile' + X + '-' + Y + '" class="square" style="top: ' + _y + 'px; left: ' + _x + 'px;" src="./images/on.png" alt="Click To Remove" />';
			}
			else if (Rotation[X][Y] == '\r') { }
			else {
				alert("Invalid Map! (" + X + "," + Y + " : " + Rotation[X][Y] + ")\n\nNote: Currently this tool doesn't allow stairs.");
				return;
			}

			var Coords = "";
			Coords += (_x + 31); // TopX
			Coords += ",";
			Coords += (_y); // TopY
			Coords += ",";

			Coords += (_x + 63); // RightX
			Coords += ",";
			Coords += (_y + 16); // RightY
			Coords += ",";

			Coords += (_x + 32); // BottomX
			Coords += ",";
			Coords += (_y + 31); // BottomY
			Coords += ",";
			Coords += (_x + 31); // BottomX
			Coords += ",";
			Coords += (_y + 31); // BottomY
			Coords += ",";

			Coords += (_x + 0); // LeftX
			Coords += ",";
			Coords += (_y + 16); // LeftY

			AddTileArea(Coords, X, Y);
		}
	}

	var Preview = document.getElementById('preview');
	// Preview.style.width = ((Rotation.length*32)+(Rotation[0].length*+32)+50) + 'px';
	// Preview.style.height = ((Rotation.length*16)+(Rotation[0].length*+16)+50+8) + 'px';
	Preview.innerHTML = Output;

	var MapImg = document.getElementById('mapimg');
	MapImg.style.width = ((Rotation.length * 32) + (Rotation[0].length * +32) + 50) + 'px';
	MapImg.style.height = ((Rotation.length * 16) + (Rotation[0].length * +16) + 50 + 8) + 'px';

	Map = NewMap;
	ResetMousedMap();
	RefreshExport();
	document.getElementById('controls').style.width = 180 + 'px';
}