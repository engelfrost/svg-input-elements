// init readyState variables
var svgReady;
var domReady = false;
var loaded = false;

// init svg when DOM is ready
$(document).ready(function(){

	var svg = $('body').svg({onLoad: init, clear: true, settings: {viewBox: '0 0 400 400'}});
	
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
	
  /* svg.input.textArea(0, 20, '   Hej  din galna gubbebeb sd fs df sd fs df sd fs df sd f sdf sd f sdf sd f sdf s df sdfsdfsdfsd fs df sd fs df sd f sdf sd f sdf sd fssdf sd fs dfebebebebebebebebeb\nhej\rhej  hej\nhej\nhejheje\rsdfjhkd', {width: '100'}); */

  svg.input.textArea(0, 0, 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam erat volutpat. Sed nibh tortor, venenatis non scelerisque ut, consequat vitae lacus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.\nMaecenas velit ipsum, congue rutrum congue nec, tristique eu nunc. Pellentesque luctus egestas velit, elementum posuere magna viverra et. Fusce rhoncus purus vitae ante dictum convallis.\nVestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam tempor tempus blandit. Curabitur nisi sapien, viverra non imperdiet vitae, tristique et diam.\nCurabitur tincidunt quam ut neque dictum porttitor. In ornare, nibh id molestie elementum, purus dui interdum odio, quis vehicula turpis ipsum eget quam. Morbi luctus porta dolor, nec condimentum est rutrum a. Integer vel eros nunc, nec gravida elit. In posuere dictum ligula volutpat commodo.', {width: '300'});

	/* svg.input.textArea(0,0,'Nullam eget purus enim, quis faucibus sapien. Vivamus semper nulla vel sapien fringilla ullamcorper. In hac habitasse platea dictumst. Morbi nulla nisl, interdum nec volutpat ut, porta a elit. Aliquam in orci vitae mauris euismod fermentum ac vitae metus. Mauris nunc ipsum, feugiat vitae sollicitudin a, lacinia a diam. Mauris tincidunt, turpis non egestas fermentum, lacus dolor feugiat erat, ac interdum nulla dui quis massa. Nunc cursus eros eget velit porta a lacinia ipsum ornare.Nullam eget purus enim, quis faucibus sapien. Vivamus semper nulla vel sapien fringilla ullamcorper. In hac habitasse platea dictumst. Morbi nulla nisl, interdum nec volutpat ut, porta a elit. Aliquam in orci vitae mauris euismod fermentum ac vitae metus. Mauris nunc ipsum, feugiat vitae sollicitudin a, lacinia a diam. Mauris tincidunt, turpis non egestas fermentum, lacus dolor feugiat erat, ac interdum nulla dui quis massa. Nunc cursus eros eget velit porta a lacinia ipsum ornare.Nullam eget purus enim, quis faucibus sapien. Vivamus semper nulla vel sapien fringilla ullamcorper. In hac habitasse platea dictumst. Morbi nulla nisl, interdum nec volutpat ut, porta a elit. Aliquam in orci vitae mauris euismod fermentum ac vitae metus. Mauris nunc ipsum, feugiat vitae sollicitudin a, lacinia a diam. Mauris tincidunt, turpis non egestas fermentum, lacus dolor feugiat erat, ac interdum nulla dui quis massa. Nunc cursus eros eget velit porta a lacinia ipsum ornare.Nullam eget purus enim, quis faucibus sapien. Vivamus semper nulla vel sapien fringilla ullamcorper. In hac habitasse platea dictumst. Morbi nulla nisl, interdum nec volutpat ut, porta a elit. Aliquam in orci vitae mauris euismod fermentum ac vitae metus. Mauris nunc ipsum, feugiat vitae sollicitudin a, lacinia a diam. Mauris tincidunt, turpis non egestas fermentum, lacus dolor feugiat erat, ac interdum nulla dui quis massa. Nunc cursus eros eget velit porta a lacinia ipsum ornare.Nullam eget purus enim, quis faucibus sapien. Vivamus semper nulla vel sapien fringilla ullamcorper. In hac habitasse platea dictumst. Morbi nulla nisl, interdum nec volutpat ut, porta a elit. Aliquam in orci vitae mauris euismod fermentum ac vitae metus. Mauris nunc ipsum, feugiat vitae sollicitudin a, lacinia a diam. Mauris tincidunt, turpis non egestas fermentum, lacus dolor feugiat erat, ac interdum nulla dui quis massa. Nunc cursus eros eget velit porta a lacinia ipsum ornare.Nullam eget purus enim, quis faucibus sapien. Vivamus semper nulla vel sapien fringilla ullamcorper. In hac habitasse platea dictumst. Morbi nulla nisl, interdum nec volutpat ut, porta a elit. Aliquam in orci vitae mauris euismod fermentum ac vitae metus. Mauris nunc ipsum, feugiat vitae sollicitudin a, lacinia a diam. Mauris tincidunt, turpis non egestas fermentum, lacus dolor feugiat erat, ac interdum nulla dui quis massa. Nunc cursus eros eget velit porta a lacinia ipsum ornare.Nullam eget purus enim, quis faucibus sapien. Vivamus semper nulla vel sapien fringilla ullamcorper. In hac habitasse platea dictumst. Morbi nulla nisl, interdum nec volutpat ut, porta a elit. Aliquam in orci vitae mauris euismod fermentum ac vitae metus. Mauris nunc ipsum, feugiat vitae sollicitudin a, lacinia a diam. Mauris tincidunt, turpis non egestas fermentum, lacus dolor feugiat erat, ac interdum nulla dui quis massa. Nunc cursus eros eget velit porta a lacinia ipsum ornare.Nullam eget purus enim, quis faucibus sapien. Vivamus semper nulla vel sapien fringilla ullamcorper. In hac habitasse platea dictumst. Morbi nulla nisl, interdum nec volutpat ut, porta a elit. Aliquam in orci vitae mauris euismod fermentum ac vitae metus. Mauris nunc ipsum, feugiat vitae sollicitudin a, lacinia a diam. Mauris tincidunt, turpis non egestas fermentum, lacus dolor feugiat erat, ac interdum nulla dui quis massa. Nunc cursus eros eget velit porta a lacinia ipsum ornare.Nullam eget purus enim, quis faucibus sapien. Vivamus semper nulla vel sapien fringilla ullamcorper. In hac habitasse platea dictumst. Morbi nulla nisl, interdum nec volutpat ut, porta a elit. Aliquam in orci vitae mauris euismod fermentum ac vitae metus. Mauris nunc ipsum, feugiat vitae sollicitudin a, lacinia a diam. Mauris tincidunt, turpis non egestas fermentum, lacus dolor feugiat erat, ac interdum nulla dui quis massa. Nunc cursus eros eget velit porta a lacinia ipsum ornare.Nullam eget purus enim, quis faucibus sapien. Vivamus semper nulla vel sapien fringilla ullamcorper. In hac habitasse platea dictumst. Morbi nulla nisl, interdum nec volutpat ut, porta a elit. Aliquam in orci vitae mauris euismod fermentum ac vitae metus. Mauris nunc ipsum, feugiat vitae sollicitudin a, lacinia a diam. Mauris tincidunt, turpis non egestas fermentum, lacus dolor feugiat erat, ac interdum nulla dui quis massa. Nunc cursus eros eget velit porta a lacinia ipsum ornare.Nullam eget purus enim, quis faucibus sapien. Vivamus semper nulla vel sapien fringilla ullamcorper. In hac habitasse platea dictumst. Morbi nulla nisl, interdum nec volutpat ut, porta a elit. Aliquam in orci vitae mauris euismod fermentum ac vitae metus. Mauris nunc ipsum, feugiat vitae sollicitudin a, lacinia a diam. Mauris tincidunt, turpis non egestas fermentum, lacus dolor feugiat erat, ac interdum nulla dui quis massa. Nunc cursus eros eget velit porta a lacinia ipsum ornare.Nullam eget purus enim, quis faucibus sapien. Vivamus semper nulla vel sapien fringilla ullamcorper. In hac habitasse platea dictumst. Morbi nulla nisl, interdum nec volutpat ut, porta a elit. Aliquam in orci vitae mauris euismod fermentum ac vitae metus. Mauris nunc ipsum, feugiat vitae sollicitudin a, lacinia a diam. Mauris tincidunt, turpis non egestas fermentum, lacus dolor feugiat erat, ac interdum nulla dui quis massa. Nunc cursus eros eget velit porta a lacinia ipsum ornare.Nullam eget purus enim, quis faucibus sapien. Vivamus semper nulla vel sapien fringilla ullamcorper. In hac habitasse platea dictumst. Morbi nulla nisl, interdum nec volutpat ut, porta a elit. Aliquam in orci vitae mauris euismod fermentum ac vitae metus. Mauris nunc ipsum, feugiat vitae sollicitudin a, lacinia a diam. Mauris tincidunt, turpis non egestas fermentum, lacus dolor feugiat erat, ac interdum nulla dui quis massa. Nunc cursus eros eget velit porta a lacinia ipsum ornare.Nullam eget purus enim, quis faucibus sapien. Vivamus semper nulla vel sapien fringilla ullamcorper. In hac habitasse platea dictumst. Morbi nulla nisl, interdum nec volutpat ut, porta a elit. Aliquam in orci vitae mauris euismod fermentum ac vitae metus. Mauris nunc ipsum, feugiat vitae sollicitudin a, lacinia a diam. Mauris tincidunt, turpis non egestas fermentum, lacus dolor feugiat erat, ac interdum nulla dui quis massa. Nunc cursus eros eget velit porta a lacinia ipsum ornare.Nullam eget purus enim, quis faucibus sapien. Vivamus semper nulla vel sapien fringilla ullamcorper. In hac habitasse platea dictumst. Morbi nulla nisl, interdum nec volutpat ut, porta a elit. Aliquam in orci vitae mauris euismod fermentum ac vitae metus. Mauris nunc ipsum, feugiat vitae sollicitudin a, lacinia a diam. Mauris tincidunt, turpis non egestas fermentum, lacus dolor feugiat erat, ac interdum nulla dui quis massa. Nunc cursus eros eget velit porta a lacinia ipsum ornare.Nullam eget purus enim, quis faucibus sapien. Vivamus semper nulla vel sapien fringilla ullamcorper. In hac habitasse platea dictumst. Morbi nulla nisl, interdum nec volutpat ut, porta a elit. Aliquam in orci vitae mauris euismod fermentum ac vitae metus. Mauris nunc ipsum, feugiat vitae sollicitudin a, lacinia a diam. Mauris tincidunt, turpis non egestas fermentum, lacus dolor feugiat erat, ac interdum nulla dui quis massa. Nunc cursus eros eget velit porta a lacinia ipsum ornare.Nullam eget purus enim, quis faucibus sapien. Vivamus semper nulla vel sapien fringilla ullamcorper. In hac habitasse platea dictumst. Morbi nulla nisl, interdum nec volutpat ut, porta a elit. Aliquam in orci vitae mauris euismod fermentum ac vitae metus. Mauris nunc ipsum, feugiat vitae sollicitudin a, lacinia a diam. Mauris tincidunt, turpis non egestas fermentum, lacus dolor feugiat erat, ac interdum nulla dui quis massa. Nunc cursus eros eget velit porta a lacinia ipsum ornare.Nullam eget purus enim, quis faucibus sapien. Vivamus semper nulla vel sapien fringilla ullamcorper. In hac habitasse platea dictumst. Morbi nulla nisl, interdum nec volutpat ut, porta a elit. Aliquam in orci vitae mauris euismod fermentum ac vitae metus. Mauris nunc ipsum, feugiat vitae sollicitudin a, lacinia a diam. Mauris tincidunt, turpis non egestas fermentum, lacus dolor feugiat erat, ac interdum nulla dui quis massa. Nunc cursus eros eget velit porta a lacinia ipsum ornare.Nullam eget purus enim, quis faucibus sapien. Vivamus semper nulla vel sapien fringilla ullamcorper. In hac habitasse platea dictumst. Morbi nulla nisl, interdum nec volutpat ut, porta a elit. Aliquam in orci vitae mauris euismod fermentum ac vitae metus. Mauris nunc ipsum, feugiat vitae sollicitudin a, lacinia a diam. Mauris tincidunt, turpis non egestas fermentum, lacus dolor feugiat erat, ac interdum nulla dui quis massa. Nunc cursus eros eget velit porta a lacinia ipsum ornare.',{width: '300'}); */


  /*
// read custom CSS for the TextBox widget
	var fontFamily = document.styleSheets[1].rules[1].style['font-family'];
	var fontSize = document.styleSheets[1].rules[1].style['font-size'];
	var lineHeight = parseInt(document.styleSheets[1].rules[1].style['line-height']);
	var marginBottom = parseInt(document.styleSheets[1].rules[1].style['margin-bottom']);
	
	// create stuff here
	
	// create text container 
	var texts = svg.createText();
	
	// fill container with rows of text (span element)
	texts.span('Garnet i nystanet', {dy: lineHeight, dx: 0, x:0});
	texts.span(unescape('v%E4xer med l%E4ngden'), {dy: lineHeight, dx: 0, x:0});
	texts.span('som om dagen inte var slut.', {dy: lineHeight, dx: 0, x:0});
	
	// create a group element
	var g1 = svg.group({transform: 'translate(0,100)', class: 'textbox'});

	// create a text element with texts, place it all in the group element and add to svg
	var text = svg.text(g1, 0, 0, texts, {fontSize: fontSize, fontFamily: fontFamily});

	// create text container 
	var texts = svg.createText();

	// fill container with rows of text (span element)
	texts.span(unescape('H%E4rligt med mysiga'), {dy: lineHeight, dx: 0, x:0});
	texts.span('mumsiga texter att', {dy: lineHeight, dx: 0, x:0});
	texts.span(unescape('l%E4sa in p%E5 sena kv%E4llar.'), {dy: lineHeight, dx: 0, x:0});
	
	// create a text element with texts, place it all in the group element and add to svg
	var text = svg.text(g1, 0, text.height() + text.offset().top + marginBottom, texts, {fontSize: fontSize, fontFamily: fontFamily});

	// add the background layer which is clickable
	var textbox = svg.rect(g1, 0, 0, g1.width(), g1.height(), {class: 'textbox'});
	textbox.parentNode.insertBefore(textbox, textbox.parentNode.firstChild);
*/
	
}