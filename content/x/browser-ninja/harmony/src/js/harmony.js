
(function(window,document,undefined){






    function ribbon( context )
    {
    	this.init( context );
    }

    ribbon.prototype =
    {
    	context: null,

    	mouseX: null, mouseY: null,

    	painters: null,

    	interval: null,

    	init: function( context )
    	{
    		this.context = context;
    		this.context.lineWidth = 1;
    		this.context.globalCompositeOperation = 'source-over';

    		this.mouseX = SCREEN_WIDTH / 2;
    		this.mouseY = SCREEN_HEIGHT / 2;

    		this.painters = new Array();

    		for (var i = 0; i < 50; i++)
    		{
    			this.painters.push({ dx: SCREEN_WIDTH / 2, dy: SCREEN_HEIGHT / 2, ax: 0, ay: 0, div: 0.1, ease: Math.random() * 0.2 + 0.6 });
    		}

    		this.isDrawing = false;

    		this.interval = setInterval( bargs( function( _this ) { _this.update(); return false; }, this ), 1000/60 );
    	},

    	destroy: function()
    	{
    		clearInterval(this.interval);
    	},

    	strokeStart: function( mouseX, mouseY )
    	{
    		this.mouseX = mouseX;
    		this.mouseY = mouseY

    		this.context.strokeStyle = "rgba(" + COLOR[0] + ", " + COLOR[1] + ", " + COLOR[2] + ", 0.05 )";		

    		for (var i = 0; i < this.painters.length; i++)
    		{
    			this.painters[i].dx = mouseX;
    			this.painters[i].dy = mouseY;
    		}

    		this.shouldDraw = true;
    	},

    	stroke: function( mouseX, mouseY )
    	{
    		this.mouseX = mouseX;
    		this.mouseY = mouseY;
    	},

    	strokeEnd: function()
    	{

    	},

    	update: function()
    	{
    		var i;

    		for (i = 0; i < this.painters.length; i++)
    		{
    			this.context.beginPath();
    			this.context.moveTo(this.painters[i].dx, this.painters[i].dy);		

    			this.painters[i].dx -= this.painters[i].ax = (this.painters[i].ax + (this.painters[i].dx - this.mouseX) * this.painters[i].div) * this.painters[i].ease;
    			this.painters[i].dy -= this.painters[i].ay = (this.painters[i].ay + (this.painters[i].dy - this.mouseY) * this.painters[i].div) * this.painters[i].ease;
    			this.context.lineTo(this.painters[i].dx, this.painters[i].dy);
    			this.context.stroke();
    		}
    	}
    }

    function bargs( _fn )
    {
    	var n, args = [];
    	for( n = 1; n < arguments.length; n++ )
    		args.push( arguments[ n ] );
    	return function () { return _fn.apply( this, args ); };
    }













    var i, brush, BRUSHES = ["ribbon"],
    brushes = {},
    COLOR = [0, 0, 0], BACKGROUND_COLOR = [250, 250, 250],
    SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight,
    container, foregroundColorSelector, backgroundColorSelector, menu, about,
    canvas, flattenCanvas, context,
    isForegroundColorSelectorVisible = false, isBackgroundColorSelectorVisible = false, isAboutVisible = false,
    isMenuMouseOver = false, shiftKeyIsDown = false, altKeyIsDown = false;

    


window.harmony = function init()
{
	var hash, palette;
	
	//document.body.style.backgroundColor = 'rgb(' + BACKGROUND_COLOR[0] + ', ' + BACKGROUND_COLOR[1] + ', ' + BACKGROUND_COLOR[2] + ')';

	container = document.createElement('div');
	document.body.appendChild(container);
	
	canvas = document.createElement("canvas");
	canvas.width = SCREEN_WIDTH;
	canvas.height = SCREEN_HEIGHT;
	canvas.style.cursor = 'crosshair';
	container.appendChild(canvas);
	
	if (!canvas.getContext) return;
	
	context = canvas.getContext("2d");
  window.harmony.context = context;
	
	flattenCanvas = document.createElement("canvas");
	flattenCanvas.width = SCREEN_WIDTH;
	flattenCanvas.height = SCREEN_HEIGHT;

	


	

	if (!brush)
	{
		brush = new ribbon(context);
	}
	

	window.addEventListener('mousemove', onWindowMouseMove, false);
	window.addEventListener('resize', onWindowResize, false);
	
	document.addEventListener('mouseout', onCanvasMouseUp, false);
	
	//canvas.addEventListener('mousemove', onCanvasMouseMove, false);
	canvas.addEventListener('touchstart', onCanvasTouchStart, false);
	
	onWindowResize(null);
}


// WINDOW

function onWindowMouseMove( event )
{
	mouseX = event.clientX;
	mouseY = event.clientY;
}

function onWindowResize() {
           SCREEN_WIDTH = window.innerWidth;
           SCREEN_HEIGHT = window.innerHeight;

           /* make a copy */
           savecanvas = document.createElement("canvas");
           savecanvas.width = canvas.width;
           savecanvas.height = canvas.height;
           savecanvas.getContext("2d").drawImage(canvas, 0, 0);

           /* change the size */
           canvas.width = SCREEN_WIDTH;
           canvas.height = SCREEN_HEIGHT;

           /* draw the copy */
           context.drawImage(savecanvas, 0, 0);

           /* reset the brush (sad we lose the old random setup) */
           brush = new ribbon(context);
       }


// CANVAS



function onCanvasMouseMove( event )
{
	if (!brush.isStroking) {
	    brush.strokeStart( event.clientX, event.clientY );
	    brush.isStroking = true;
	    
	    if (window.DollarRecognizer){
	      window.Rcgnzr = new DollarRecognizer();
      }
      
	    return;
	}
    
    var pts = onCanvasMouseMove.pts, results,
          x = event.clientX, y = event.clientY;
   
    // has it been 300ms since the last movement? if so lets consider it a new thing and capture
    if (onCanvasMouseMove.lastMove && (event.timeStamp - onCanvasMouseMove.lastMove) > 300){

        
        if (pts && pts.length){
          
            if (window.DollarRecognizer){
              
              results = Rcgnzr.Recognize(pts);

              if (results.Name == 'star' && results.Score >= .6) window.starryEgg && starryEgg();
            }

            onCanvasMouseMove.pts = [];
        } else {

            onCanvasMouseMove.pts = [];
        }
    }
 
  onCanvasMouseMove.lastMove = +event.timeStamp;

  if (window.Point){
    pts && (pts[pts.length] = new Point(x, y));
  }
    
	brush.stroke( x, y );
}

function onCanvasMouseUp()
{
	brush.strokeEnd();
	
	window.removeEventListener('mousemove', onCanvasMouseMove, false);	
	window.removeEventListener('mouseup', onCanvasMouseUp, false);
}


function onCanvasTouchStart( event )
{
	cleanPopUps();		

  for (var tid in event.touches) {
    var touch = event.touches[tid];
    var brush = new ribbon(context);
		brush.strokeStart(touch.pageX, touch.pageY );
    brushes[touch.identifier] = brush;
    //console.log(touch);
  }
  window.addEventListener('touchmove', onCanvasTouchMove, false);
  window.addEventListener('touchend', onCanvasTouchEnd, false);
}

function onCanvasTouchMove( event )
{
  for (var tid in event.touches) {
    var touch = event.touches[tid];
    var brush = brushes[touch.identifier];
    brush.stroke(touch.pageX, touch.pageY);
  }
  event.preventDefault();
}

function onCanvasTouchEnd( event )
{
	var touch = event.changedTouches[0]
  brushes[touch.identifier].strokeEnd();
  event.preventDefault();

	if (event.touches.length == 0)
	{
		window.removeEventListener('touchmove', onCanvasTouchMove, false);
		window.removeEventListener('touchend', onCanvasTouchEnd, false);
	}
}



function cleanPopUps()
{
	if (isForegroundColorSelectorVisible)
	{
		foregroundColorSelector.hide();
		isForegroundColorSelectorVisible = false;
	}
		
	if (isBackgroundColorSelectorVisible)
	{
		backgroundColorSelector.hide();
		isBackgroundColorSelectorVisible = false;
	}
	
	if (isAboutVisible)
	{
		about.hide();
		isAboutVisible = false;
	}
}








})(this,this.document);




// this part is just the easter egg for erasure. you dont need it.
function starryEgg(){
    
    if (document.getElementById('erasure')) return;
    
   // console.log('sing a songggggg')
    var div = document.createElement('div');
    div.innerHTML = '<object width="384" height="313" id="erasure"><param name="movie" value="http://www.youtube.com/v/eSMeUPFjQHc&hl=en_US&fs=1&autoplay=1"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed  id="alwayss" src="http://www.youtube.com/v/eSMeUPFjQHc&hl=en_US&fs=1&autoplay=1" type="application/x-shockwave-flash" width="384" height="313" allowscriptaccess="always" allowfullscreen="true"></embed></object>';
    document.body.appendChild(div);
    div.style.position = 'fixed';
    div.style.bottom = '250px';
    div.style.left = '50%';
    div.style.marginLeft = '-190px';
    
}
