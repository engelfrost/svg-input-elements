/** 
 *  SVGEditableList
**/

function SVGEditableImage(wrapper){
  this._wrapper = wrapper; // The attached SVG wrapper object
}

SVGEditableImage.inheritsFrom( SVGSelectableGElement );

// "static" stuff
$.extend(SVGEditableImage, {
	once: false, 
  
  setup: function(){
    
    // do all times
    
    if (!this.once){
    	
    	$(window).bind('keydown.' + this.name, function(e){
    	
    		var selectedGroup = SVGSelectableGElement.selectedGroup();
	    	var self = this;
	    	
	    	if (selectedGroup 
          && selectedGroup.constructor === SVGEditableImage) {
	    		if ((e.keyCode == 46 || e.keyCode == 8)) {
	    			e.preventDefault();
	    			selectedGroup._delete();
	    		}
    		}
    	});
    
    	this.once = true;
    	
    }
  }
});

/* ------- PUBLIC INSTANCE ------- */

//$.extend(SVGEditableImage.prototype, new SVGEditableGElement);
$.extend(SVGEditableImage.prototype, {
  _classType: "image",
  _renderTimer: -1,
  _height: 0,
  _width: 0,

	init: function(parent, value, width, height, settings) {
  
  	var self = this;
  	
    this._parent = parent; 
    this._src = value.toString();
    this._width = width; // value -1 means "no maxwidth"
    this._height = height; // not used at the moment
    SVGEditableImage._textareaCount++; 
    this._id = (settings.id || 'textarea-' + SVGEditableTextBox._textareaCount.toString());
    this._class += " " + this._classType + " " + (settings.class || '');
    
    var _settings = {
    	buttonText: 'edit',
    };
    
    this._settings = $.extend(_settings, settings);
  
    // bind to events
    SVGEditableImage.setup();
    
    this.super.init.apply(this);
    
    
    $(window).bind('resize', function(){self.update()});
    
    // Render Objects
    return this._render();
    
  },
  
  setValue: function(value) {
  	this._src = value;
  	this.update();
  },
  
  update: function() {
    var self = this;
    clearTimeout(this._renderTimer);
    this._renderTimer = setTimeout(function(){self._render()},0);
  },
  
  _render: function() {
    var self = this; 
    var x = this._settings.x; 
    var y = this._settings.y; 
    var gSettings = {class: this._class, transform: 'translate('+x+','+y+')'};
    var g = this.super._render.call(this, this._parent, this._id, gSettings);
    var padding = this._getGPadding(g);
    var maxWidth = this._width - padding['left'] - padding['right'];
    
    var width = num(maxWidth); 
    var ctm = g.getScreenCTM();
    
    // build an image to display
    var img = new Image();
    img.onload = function() {
    
      var imageProportion = this.width / this.height;
      
      var height = width / imageProportion;
      
      var img = self._wrapper.image(g, padding['left'], padding['top'], width, height, self._src);
      
      img.setAttribute('xlink:href', self._src); // needed in Chrome
//       img.removeAttribute('href'); // Don't remove href! needed in Firefox
      
      // add our button
      var f = self._wrapper.other(g, 'foreignObject', {width: width*ctm.a, height: 24, x: 0, y: 10, transform: 'scale(' + (1/ctm.a) + ')'});
      var it = $("<div class='imagetool'><button>" + self._settings.buttonText + "</button></div>");
      $(f).append(it);
      it.bind('click', function(e){
      	self._group.select(e);
      	self.trigger(new $.Event("edit", {target: self._group}));
      });
      
      
      var bgRect = self._wrapper.rect(g, 0, 0, width + padding['right'] + padding['left'], height + padding['top']+ num(padding['bottom']), 
                                    {class: 'background'} 
                                  );
      g.insertBefore( bgRect, g.firstChild );
      // keep group in focus if selected
      g.reload();
      
      var eChangeSize = $.Event("changeSize", {target: self._group});
      self.trigger(eChangeSize, [bgRect.getAttribute("width"), bgRect.getAttribute("height")]); 
    }
    img.src = this._src;
    
    return this; 
  },
  
  _getGPadding: function(g) {
    var padding = {
      'top'    : num(StyleSheet.get( 'rect.background', 'padding-top', g))*1.2,
      'right'  : num(StyleSheet.get( 'rect.background', 'padding-right', g)),
      'bottom' : num(StyleSheet.get( 'rect.background', 'padding-bottom', g)),
      'left'   : num(StyleSheet.get( 'rect.background', 'padding-left', g))
    };
    return padding; 
  },
  
  getHeight: function() {
    return this._height; 
  },
  
  getWidth: function() {
    return this._width; 
  },
  
  disableSelection: function() {},
  
  enableSelection: function(){},
  
  // implementation of extension point (hooks)
  select: function(g,e){}, // a hook to capture the selection
  deselect: function(){},
  mouseup: function(g,e){},
  mousedown: function(g,e){},
  mousemove: function(g,e){},
  click: function(g,e){},
  dblclick: function(g,e){},
  tplclick: function(g,e){},
  contextmenu: function(g,e){}
});