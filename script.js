(function() {
	console.log('requsetAnimationFrame');
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame =
			window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'RequestCancelAnimationFrame'];
	}
 
	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); },
				timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
 
	if (!window.cancelAnimationFrame) {
		console.log('cancelAnimationFrame does not exist');
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
}());

$(function(){

	// Grab the canvas
	var canvas = $('#canvas').first(), // Grab first element in array
	context = null,
	animFrame = null,
	animate = true,
	x = 150,
	y = 150,
	cW = 0,
	cH = 0,
	dx = 4,
	dy = 2,
	r = 10,
	pX = 0,
	pY = 0,
	pW = 0,
	pH = 0,
	rightDown = false,
	leftDown = false,
	cMinX = 0,
	cMaxX = 0,
	bricks=[],
	NROWS = 0,
	NCOLS = 0,
	BRICKWIDTH = 0,
	BRICKHEIGHT = 0,
	PADDING = 0;

	function clear(w,h){
		context.clearRect(0,0,cW,cH);
	}

	// draws a circle
	function circle(x,y,r){
		context.beginPath(); // Start path
		context.arc(x, y, r, 0, Math.PI*2, true); // x, y, radius, startAngle, endAngle, bAnticlockwise
		context.closePath(); // End path
		context.fill();
	}

	function rect(x,y,w,h){
		context.beginPath();
		context.rect(x,y,w,h);
		context.closePath();
		context.fill();
	}

	// Function to call in animation loop
	function render(){
		clear();
		circle(x,y,r); // bouncing ball

		if (rightDown){
			pX += 5;
		} else if (leftDown) {
			pX -= 5;
		}
		
		rect(pX, pY, pW, pH);

		if(x + dx > (cW) || x + dx < 0) {
			dx = -dx;
		}

		if(y + dy < 0) {
			dy = -dy;
		} else if(y + dy > cH) {
			// collision detection
			if(x > pX && x < (pX+pW)) {
				dy = -dy;
			} else {
				alert('end of game');
				// end game
				animate = false;
			}
		}

		renderBricks();
		testCollisions(x, y);


		x += dx;
		y += dy;
	
}

function testCollisions(x, y){
	//have we hit a brick?
	rowheight = BRICKHEIGHT + PADDING;
	colwidth = BRICKWIDTH + PADDING;
	row = Math.floor(y/rowheight);
	col = Math.floor(x/colwidth);
	//if so, reverse the ball and mark the brick as broken
	if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
		dy = -dy;
		bricks[row][col] = 0;
	}
}

function onKeyDown(evt){
	console.log(evt);
	console.log('KeyDown', evt.KeyCode);
	switch(evt.keyCode){
		case 39:
			rightDown = true;
			break;
		case 37:
			leftDown = true;
			break;
		case 13:
			init();
			break;
	}

}

function onKeyUp(evt){
	console.log('KeyUp', evt.KeyCode);
	switch(evt.keyCode){
		case 39:
			rightDown = false;
			break;
		case 37:
			leftDown = false;
			break;
	}
	
}

function onMouseMove(evt) {
  if (evt.pageX > cMinX && evt.pageX < cMaxX) {
	pX = evt.pageX - cMinX;
  }
}

function initBricks() {
  for (i=0; i < NROWS; i++) {
	bricks[i] = new Array(NCOLS);
	for (j=0; j < NCOLS; j++) {
		bricks[i][j] = 1;
	}
  }
}

function renderBricks() {
	//draw bricks
	for (i=0; i < NROWS; i++) {
		for (j=0; j < NCOLS; j++) {
			if (bricks[i][j] == 1) {
				rect((j * (BRICKWIDTH + PADDING)) + PADDING,
				(i * (BRICKHEIGHT + PADDING)) + PADDING,
				BRICKWIDTH, BRICKHEIGHT);
			}
		}
	}
}

function init(){
	context = canvas[0].getContext('2d');
	cW = canvas.outerWidth();
	cH = canvas.outerHeight();

	pH = 10;
	pW = 75;
	pX = (cW/2);
	pY = (cH-pH);

	cMinX = canvas.offset().left;
	cMaxX = cMinX + cW;

	// Bricks defaults
	NROWS = 5;
	NCOLS = 5;
	BRICKWIDTH = (cW/NCOLS) - 1;
	BRICKHEIGHT = 15;
	PADDING = 1;

	bricks = new Array(NROWS);

	initBricks();

	$(document).keydown(onKeyDown)
				.keyup(onKeyUp)
				.mousemove(onMouseMove);

	// trigger loop
	(function animloop(){
		if(animate) {
			animFrame = requestAnimationFrame(animloop); // keep before the render
			render();
		}
	})();
}


init(); // trigger app

});