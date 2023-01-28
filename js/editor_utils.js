const Utils = {
	getRandomRange(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	},
	resetTools(){
		controls.mode = drawMode.CREATE;
		controls.tileHeight = 0;
		controls.tool = drawTools.NONE;
	},
	convertInt(v){
		return /^\d+$/.test(v) ? parseInt(v) : v;
	},
	hexToHueRotation(hex){
		const rgb = hexToRgb(hex);
		const color = new Color(rgb[0], rgb[1], rgb[2]);
		const solver = new Solver(color);
		const result = solver.solve();

		return result.filter;
	}
}

Array.prototype.dim = function(){
	if( this.length==2 ){
		r=this.shift(); c=this.shift();
		while( r-- ) this.push( new Array( c ).fill(true, 0) );
		return this;
	}
}