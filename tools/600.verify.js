// init readyState variables
var svgReady;
var domReady = false;
var loaded = false;

// init svg when DOM is ready
$(document).ready(function(){
  var settings = {
    viewBox: '0 0 400 200', 
//     clear: true, // What is this? 
    version: '1.1'
  };
  var svg = $('#svg').svg({onLoad: init, settings: settings});
	
	domReady = true;
	
	goReady();
	
});

// wait until all page content is loaded (css, images, etc.)
$(window).load(function () {
	
	loaded = true;
	
	goReady();
	
});

// when svg is ready
function init(svg){
	svgReady = svg;
	
	goReady();
}

// syncronize all readyState event, all must have already happened
function goReady(){ // wait for everything to load first
	if (domReady && svgReady!=null && loaded)
		readyStart(svgReady);
}


// init program, add data now and position element
function readyStart(svg){
	

  svg.input.textArea(18, 10, "It Takes Carbon Fiber and Kevlar to Make the Best Basketball Shoes in the World", {width: '200', class: 'heading'});
  
  svg.input.textArea(18, 97, "When you look at basketball shoes, what do you see? A big swoosh. Three stripes. Michael Jordan. A billboard molded to your feet. But do you see the technology? Though maybe not as blatant as an Intel sticker on your laptop, every shoe showcases its own advanced technology. Don't worry, you can't miss it on these, the best basketball shoes on the planet. Because they roll with carbon fiber and Kevlar.", {width: '200'});

  svg.input.list(228, 10, 'Nullam eget purus enim, quis faucibus sapien. \nVivamus semper nulla vel sapien fringilla ullamcorper. \nIn hac habitasse platea dictumst. ',{width: '150'});
  svg.input.list(228, 100, 'Nullam eget purus enim, quis faucibus sapien. \nVivamus semper nulla vel sapien fringilla ullamcorper. \nIn hac habitasse platea dictumst. ',{width: '150'});
	
	
	$('.svg-container').transition({ x: '0', y: '20px', height: '400px'}, 1000, 'snap');
	
	$('.view .message').removeClass('loading');

	
}
