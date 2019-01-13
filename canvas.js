var Canvas = {
	canvasElt: null,
	canvasDiv: null,
	context: null,
	paint: null,
	clickX: [],
	clickY: [],
	clickDrag: [],

	openCanvas: function() {
		$('#btn-todraw').on("click", function() {
			$("#canvas-container").fadeIn(300);
			$('#btn-todraw').hide();
			Canvas.init();
		});
	},

	init: function() {
		Canvas.canvasElt = document.querySelector('canvas');
		Canvas.canvasDiv = $('#canvas-container');
		Canvas.context = Canvas.canvasElt.getContext("2d");
		if(typeof G_vmlCanvasManager != 'undefined') {
			Canvas.canvasElt = G_vmlCanvasManager.initElement(Canvas.canvasElt);
		}

		$('#canvas').mousedown(function(e){
			var mouseX = e.pageX - this.offsetLeft;
			var mouseY = e.pageY - this.offsetTop;

			Canvas.paint = true;
			Canvas.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
  			Canvas.redraw();
		});

		$('#canvas').mousemove(function(e){
		  	if(Canvas.paint){
			    Canvas.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
				Canvas.redraw();
			}
		});

		$('#canvas').mouseup(function(e){
		  	Canvas.paint = false;
		});

		$('#canvas').mouseleave(function(e){
		  	Canvas.paint = false;
		});

		$('#canvas').on("touchstart", function(e){
			var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft;
			var mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;

			Canvas.paint = true;
			Canvas.addClick(mouseX, mouseY, true);
  			Canvas.redraw();
		});

		$('#canvas').on("touchmove", function(e){
			e.preventDefault();
			var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft;
			var mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;

		  	if(Canvas.paint){
			    Canvas.addClick(mouseX, mouseY, true);
				Canvas.redraw();
			}
		});

		$('#canvas').on("touchend", function(e){
		  	Canvas.paint = false;
		});

		$('#btn-clear').on("click", function() {
			Canvas.clearCanvas();
		});

		$('#btn-cancel').on("click", function() {
			Canvas.clearCanvas();
			Canvas.canvasDiv.fadeOut(300, function() {
				$('#btn-todraw').show();
			});
		});

		$('#btn-confirm').on("click", function() {
			Canvas.clearCanvas();
			Canvas.canvasDiv.fadeOut(300, function() {
				$('#btn-todraw').show();
				$('#confirm-message').show().delay(2000).hide("500");
			});
		});

		Canvas.resizeCanvas();
		window.addEventListener("resize", Canvas.resizeCanvas);
	},

	addClick: function(x, y, dragging) {
		  Canvas.clickX.push(x);
		  Canvas.clickY.push(y);
		  Canvas.clickDrag.push(dragging);
	},

	redraw: function() {
	  	Canvas.context.clearRect(0, 0, Canvas.canvasElt.width, Canvas.canvasElt.height);
	  
		Canvas.context.strokeStyle = "#111";
		Canvas.context.lineJoin = "round";
		Canvas.context.lineWidth = 5;
				
	  	for(var i=0; i < Canvas.clickX.length; i++) {		
		    Canvas.context.beginPath();

		    if(Canvas.clickDrag[i] && i) {
		      	Canvas.context.moveTo(Canvas.clickX[i-1], Canvas.clickY[i-1]);
		    } else {
		       	Canvas.context.moveTo(Canvas.clickX[i]-1, Canvas.clickY[i]);
		    }
		    Canvas.context.lineTo(Canvas.clickX[i], Canvas.clickY[i]);
		    Canvas.context.closePath();
		    Canvas.context.stroke();
		}
	},

	resizeCanvas: function() {
		var ratio =  Math.max(window.devicePixelRatio || 1, 1);
	    Canvas.canvasElt.width = Canvas.canvasElt.offsetWidth * ratio;
	    Canvas.canvasElt.height = Canvas.canvasElt.offsetHeight * ratio;
	    Canvas.canvasElt.getContext("2d").scale(ratio, ratio);
	    Canvas.clearCanvas();
	},
	
	clearCanvas: function() {
		Canvas.context.clearRect(0, 0, Canvas.canvasElt.width, Canvas.canvasElt.height);
		Canvas.clickX = [];
		Canvas.clickY = [];
		Canvas.clickDrag = [];
	}
}

$(function() {
	Canvas.openCanvas();
})