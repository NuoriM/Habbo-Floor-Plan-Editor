const Utils = {
	getRandomRange(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	},
	resetTools(){
		controls.mode = drawMode.CREATE;
		controls.tileHeight = 0;
		controls.tool = drawTools.NONE;
	}
}

Array.prototype.dim = function(){
	if( this.length==2 ){
		r=this.shift(); c=this.shift();
		while( r-- ) this.push( new Array( c ).fill(true, 0) );
		return this;
	}
}