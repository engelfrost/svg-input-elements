SVG Input Elements
==================

_We are soon ready for a 1.0 version. Help coding a better and more general 
2.0 version would be greatly appreciated!_

The current state can be considered an alpha or beta version of 1.0. It is 
feature complete but buggy. 

Better documentation will be included in the 1.0 release. For now, use the 
instructions in [Getting Started](#getting-started). A demo (updated 5 June 
2012) can be found at 
[josf.se/svg-input-elements/](http://josf.se/svg-input-elements/). 

This project started out as a sub-project to a master thesis project, 
[Personas in Real Life](http://personasinreallife.tumblr.com).

__Go to:__ [Features](#features-), [Requirements](#requirements), 
[Getting Started](#getting-started), [Events](#events), [Versions](#versions) 
or [Development](#development)

Features 
--------
* Line wrapping
* Word wrapping of long words
* Copy/cut/paste
* Text selection with mouse and keyboard
* Change cursor position with left/right/up/down/home/end etc
* Handles both paragraphs (_enter_) and manual line breaks (_shift+enter_)
* Undo/redo
* ...

Requirements
------------
This project requires [jQuery](http://docs.jquery.com/Downloading_jQuery) 
(we're using 1.7.2) and the 
[jQuery SVG plugin](http://keith-wood.name/svg.html)

Getting Started
---------------
You can download the latest examples and test yourself, just change the path 
"../tools/build.js" to "../jquery.svg.input.js" unless you're on an Apache 
server with PHP. 

_Note:_ In Chrome (and Safari?) the script will fail if you 
run it from your local file system 
[because of a bug](http://code.google.com/p/chromium/issues/detail?id=49001). 

_Note:_ The generated files in the root might not always be 100% up to date.

[Download jQuery](http://jquery.com/) (we've tested on version 1.7.2) and 
[jQuery SVG](http://keith-wood.name/svg.html) (tested on version 1.4.5) and 
include these libraries, and SVG Input Elements: 
```
<script type="text/javascript" src="jquery.js" />
<script type="text/javascript" src="jquery.svg.js" />
<script type="text/javascript" src="jquery.svg.input.js" />
```
Also include some styles (apologies for bad documentation and coding on this 
part, SVG Input Elements doesn't behave as expected if certain styles aren't 
defined. Also, in a futur version all SVG Input Elements classes and IDs will 
have a special prefix.):
```
<link rel="stylesheet" href="svg.css" />
```
Create an inline SVG element with the following attributes (the ID is optional
but useful, especially if you have more than one SVG element): 
```
<svg id="svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" unselectable="on" style="-webkit-user-select: none;"></svg>
```
Make sure that the document is loaded before we start manipulating it, see the
[jQuery SVG documentation](http://keith-wood.name/svgRef.html) for more 
information on this: 
```
$(document).ready(function(){
  $('#svg').svg({onLoad: init, settings: {}});  
});
```

You can now create a textarea, text, list and image using the following code: 
```
function init(svg) {
    var parent = $('#svg')[0]; 
    var x = 10; 
    var y = 10; 
    var settings = {width: '200'}; 

    var textArea = svg.input.textArea(parent, x, y, "text with \nparagraphs", settings);
    var text = svg.input.text(parent, x, y, "text with \nno line \nbreaks", settings);
    var list = svg.input.list(parent, x, y, "list\nof\nitems", settings);
    var image = svg.input.image(parent, x, y, "path/to/image.jpg", settings);
}
```
the `parent` parameter is optional. The properties of the `settings` object 
corresponds to the attributes of an SVG `<g>` tag, plus an additional `width` 
parameter. 
 
You should now have a working text area!

###Binding Events
SVG Input Elements trigger events that you can bind: 
```
textArea.bind("change", function(e, text) {
  console.log("text changed: " + text);
});

textArea.bind("changeSize", function(e, width, height) {
  console.log("dimensions changed: " + width + " x " + height);
});
```

The changeSize event is useful because the textArea is contained within a 
group element, and thus it is not possible to stack them in the same way you 
would stack div elements in HTML. 

Events
------
__change__: Triggered when the SVG Input Element has changed in some way, i.e. for
a textbox it is triggered every time a character is removed or added. Returns 
one parameter: 
  * _param1_: The new text
  
__changeSize__: Triggered when the size of the SVG Input Element changes. Returns 
two parameters: 
  * _param1_: The new width
  * _param2_: The new height

Versions
--------
###v1.0
__Scheduled early June.__ This release will provide several text related input
elements and should be stable on all major browsers except perhaps for 
Internet Explorer, which seems to have very poor SVG support even in verion 9. 

###v0.3
__Released 30 May 2012.__ Features a list item. It places bullets in front of 
each new paragraph, styling the textbox like a list. Nothing fancy, but 
convenient. 

###v0.2.2
__Released 30 May 2012.__ Minor enhancements, bugfixes and useable events. 

###v0.2.1
__Released 16 May 2012.__ Minor enhancements, bugfixes and support for 
@import. No longer requires support for the xml:space attribute. 

###v0.2
__Released 15 May 2012.__ This release provides bugfixes and several 
improvements and should also work on Firefox. Additional input elements are 
postponed to the next release. The documentation is still lacking, contact us 
if you want help. 

###v0.1
__Released 9 May 2012.__ This is a rather limited release which is only 
properly tested in Chrome/Chromium. It should not be seen as something that is
ready to be put in use.

Development
-----------
Feel free to join in and develop, if you want to contact us please e-mail 
Tim at [info@sypreme.se](mailto:info@sypreme.se) or Josef at 
[josef.ottosson@josf.se](mailto:josef.ottosson@josf.se). 
