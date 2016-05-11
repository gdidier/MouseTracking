/**
* @author: guillaume didier <guillaume.didier@live.fr>
**/
var MouseTracking = function(arraySize){
	function _MouseTracking(arraySize)
	{
		this.posX 			= 0;				// current mouse X position
		this.posY 			= 0;				// current mouse Y position

		this.sizeX 			= 0; 				// viewport width
		this.sizeY 			= 0; 				// viewport height

		this.cell_w 		= 0;				// 1 cell width in px
		this.cell_h 		= 0;				// 1 cell height in px
		this.arraySize 		= arraySize;		// cells array size : arraySize x arraySize

		this.resized 		= false;			// viewport has been resized

		this.previous_time 	= 0; 				// previous tick
		this.move_timeout 	= 30; 				// update time for when no mouse move 
		this.out 			= false; 			// mouse outside viewport, stop computing

		this.stop 			= 0; 				// stop compute position

		this.lastcell 		= {row:0, col:0};	// last mouse position on grid

		this.interval 		= null;
		this.initialized 	= false;

		this.init();
	}

	_MouseTracking.prototype.addEvent = function(obj, evt, fn)
	{
		if (obj.addEventListener) {
			obj.addEventListener(evt, fn.bind(this), false);
		}
		else if (obj.attachEvent) {
			obj.attachEvent("on" + evt, fn.bind(this));
		}
	}

	_MouseTracking.prototype.removeEvent = function(obj, evt, fn)
	{
		if (obj.removeEventListener)
		{
			obj.removeEventListener(evt, fn);
		}
		else if(obj.detachEvent)
		{
			obj.detachEvent("on"+evt, fn);
		}
	}

	_MouseTracking.prototype.onResize = function(evt)
	{
		this.resized = true;
		this.computeAreas();
	}

	_MouseTracking.prototype.onMouseMove = function(evt)
	{
		if(this.initialized && !this.stop)
		{
			
			if (evt.clientX >= 0 && evt.clientX <= this.sizeX && evt.clientY >= 0 && evt.clientY <= this.sizeY)
			{
				console.log("in");
				this.out = false;
				this.posX = evt.clientX;
				this.posY = evt.clientY;
				this.computeMouseMove();
			}
			else
			{
				console.log("out");
				this.out 			= true;
				this.previous_time 	= 0;
			}
		}
	}
	_MouseTracking.prototype.onMouseOut = function(evt)
	{
		if(this.initialized && !this.stop)
		{
			
			if (evt.clientX < 0 || evt.clientX > this.sizeX || evt.clientY < 0 || this.clientY > this.clientY)
			{
				console.log("out");
				this.out 			= true;
				this.previous_time 	= 0;
			}
		}
	}


	_MouseTracking.prototype.init = function()
	{
		this.addEvent(window, "load", (function(evt){
			this.computeAreas();
			this.previous_time = new Date().getTime();
			this.interval = setInterval(this.computeMouseMove.bind(this), this.move_timeout);
		}).bind(this));

		this.addEvent(window, "resize", 	this.onResize.bind(this));
		this.addEvent(window, "mousemove", 	this.onMouseMove.bind(this));

		this.addEvent(window, "mouseout", 	this.onMouseOut.bind(this));
	}


	_MouseTracking.prototype.computeMouseMove = function()
	{
		if(this.initialized && !this.stop && !this.out)
		{
			var t = new Date().getTime();
			var p = this.previous_time || new Date().getTime();
			var x = parseInt(this.posX / this.cell_w);
			var y = parseInt(this.posY / this.cell_h);

			if(x >= 0 && x < this.arraySize && y >= 0 && y < this.arraySize)
			{
				this.cells[y][x] 	+= parseFloat(parseFloat((t - p)/1000).toFixed(3));
				this.lastcell.row 		= y;
				this.lastcell.col		= x;
				this.previous_time 			= new Date().getTime();
			}
		}
	}

	_MouseTracking.prototype.getSize = function()
	{
		var width = window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;

		var height = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;

		return {w:width, h:height};
	}

	_MouseTracking.prototype.computeAreas = function()
	{
		var s = this.getSize();
		var w = s.w;
		var h = s.h;

		this.sizeX = w;
		this.sizeY = h;
		this.cell_w = parseInt(w / this.arraySize);
		this.cell_h = parseInt(h / this.arraySize);


		this.cells = Array(this.arraySize).join(",").split(",").map((function(){
			var a = Array(this.arraySize).join(",").split(",").map(function(){
				return 0;
			});
			return a;
		}).bind(this));
		this.initialized = true;
	}

	_MouseTracking.prototype.getCells = function()
	{
		return this.cells;
	}

	_MouseTracking.prototype.getLastCell = function()
	{
		return this.getLastCell;
	}

	_MouseTracking.prototype.stop = function()
	{
		clearInterval(this.interval);
		this.removeEvent(window, "resize", 		this.onResize);
		this.removeEvent(window, "mousemove", 	this.onMouseMove);
	}

	_MouseTracking.prototype.pause = function()
	{
		this.stop = true;
	}

	_MouseTracking.prototype.play = function()
	{
		this.stop = false;
	}
	return new _MouseTracking(arraySize);
}