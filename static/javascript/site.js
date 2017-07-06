

$(document).ready(function(){

	function animationClick(element, animation){
	    element = $(element);
	    element.click(
	        function() {
	            element.addClass('animated ' + animation);        
	            //wait for animation to finish before removing classes
	            window.setTimeout( function(){
	                element.removeClass('animated ' + animation);
	            }, 2000);         
	  
	        });
	}

	function animationHover(element, animation){
	    element = $(element);
	    element.hover(
	        function() {
	            element.addClass('animated ' + animation);        
	        },
	        function(){
	            //wait for animation to finish before removing classes
	            window.setTimeout( function(){
	                element.removeClass('animated ' + animation);
	            }, 1000);         
	        });
	}

	$("i").each(function() {
		animationHover(this, 'pulse')
	});

});
