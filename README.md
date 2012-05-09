SVG Input Elements
==================

Currently this project implements text areas, similar in behaviour to HTML 
`<textarea>` tags. 

For a demo of the 0.1 release go to 
[josf.se/svg-input-elements/](http://josf.se/svg-input-elements/). You can 
also try it out the latest version yourself with ./demo.html (just add jQuery 
and jQuery SVG and adjust the href values).

The goal is to implement input elements that feel and behave naturally (i.e. 
as corresponding HTML input elements etc). 

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
###v0.1
__Released 9 May 2012.__ This is a rather limited release which is only properly tested in 
Chrome/Chromium. It should not be seen as something that is ready to be put 
in use.

###v0.2
__Not released.__ This release will provide additional input elements and should work much 
better in Firefox. 

...

###v1.0 
__Not released - expected in early June__ This release will be ready for real use. It will also have better 
documentation and examples. 

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