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

var controls = {
	mode: drawMode.CREATE,
	tileHeight: 0,
	tool: drawTools.NONE,
	maxRoomSize: 70,
	lastLoadedRoom: [],
};

const paletteTileColors = [
	{color: '0065FF', key: 0},
	{color: '0091FF', key: 1},
	{color: '00BCFF', key: 2},
	{color: '00E8FF', key: 3},
	{color: '00FFEA', key: 4},
	{color: '00FFBF', key: 5},
	{color: '00FF93', key: 6},
	{color: '00FF68', key: 7},
	{color: '00FF3D', key: 8},
	{color: '00FF11', key: 9},
	{color: '19FF00', key: 'a'},
	{color: '44FF00', key: 'b'},
	{color: '70FF00', key: 'c'},
	{color: '9BFF00', key: 'd'},
	{color: 'C6FF00', key: 'e'},
	{color: 'F2FF00', key: 'f'},
	{color: 'FFE000', key: 'g'},
	{color: 'FFB500', key: 'h'},
	{color: 'FF8900', key: 'i'},
	{color: 'FF5E00', key: 'j'},
	{color: 'FF3200', key: 'k'},
	{color: 'FF0700', key: 'l'},
	{color: 'FF0023', key: 'm'},
	{color: 'FF004F', key: 'n'},
	{color: 'FF007A', key: 'o'},
	{color: 'FF00A5', key: 'p'},
	{color: 'FF00D1', key: 'q'},
	{color: 'FF00FC', key: 'r'},
	{color: 'D600FF', key: 's'},
	{color: 'AA00FF', key: 't'}
];