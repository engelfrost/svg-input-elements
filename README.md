SVG Input Elements
==================

Currently this project implements text areas, similar in behaviour to HTML 
`<textarea>` tags. The goal is to implement input elements that feel and 
behave naturally (i.e. as corresponding HTML input elements etc). 

For a demo of the 0.2 release go to 
[josf.se/svg-input-elements/](http://josf.se/svg-input-elements/). You can 
also download the latest examples and test yourself, just change the path 
"../tools/build.js" to "../jquery.svg.input.js" unless you're on an Apache 
server with PHP. _Note:_ In Chrome the script will fail if you run it from 
your local file system 
[because of a bug](http://code.google.com/p/chromium/issues/detail?id=49001). 

(The generated files in the root might not always be 100% up to date.) 

This project started out as a sub-project to a master thesis project, 
[Personas in Real Life](http://personasinreallife.tumblr.com).

__Go to:__ [Features](#features-), [Requirements](#requirements), 
[Versions](#versions) or [Development](#development)

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

Versions
--------
###v1.0
__Scheduled early June__ This release will provide several text related input
elements and should be stable on all major browsers except perhaps for 
Internet Explorer, which seems to have very poor SVG support even in verion 9. 

###v0.3
__Coming soon:__ Will feature a list variant of the text input element. 

###v0.2.1
__Released 16 May 2012.__ Minor enhancements, bugfixes and support for 
@import. 

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
Next in line to be implemented are variations of the text area (like a list 
box, for example) and an image input element. 

Feel free to join in and develop, if you want to contact us please e-mail 
Tim at [info@sypreme.se](mailto:info@sypreme.se) or Josef at 
[josef.ottosson@josf.se](mailto:josef.ottosson@josf.se). 

In a future version, we would build it both for JQuery SVG and Raphael, or 
rid of both dependencies completely. We would love some help implementing 
this! About choosing which to build for, we refer to this thread (for now):
http://stackoverflow.com/questions/588718/jquery-svg-vs-raphael