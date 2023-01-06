const drawMode = {
	CREATE: 0,
	REMOVE: 1,
	UP: 2,
	DOWN: 3
}

const drawTools = {
	NONE: 0,
	RECTANGLE: 1
}

const TILEOFFSET = [
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t"
]

var controls = {
	mode: drawMode.CREATE,
	tileHeight: 0,
	tool: drawTools.NONE,
	maxRoomSize: 70,
};