/** 
 *  SVGTextMarker
**/

SVGTextMarker = {};

// "public static"
$.extend(SVGTextMarker, {
  _wrapper    : null,
  _marker     : null,
  _visible    : false,
  _blinkId    : -1,
  _blinkState : true,
  _settings: {
    parent      : null,
    x           : 10,
    y           : 10,
    width       : 2,
    height      : 12,
    paragraph   : 0,
    row         : 0, 
    char        : 0,
    desx        : 0
  },
  
  show: function( wrapper, options ){
    this._visible = true;
    this._wrapper = wrapper;
    this._blinkState = false;
    
    this._settings = $.extend(this._settings, options);
    
/*     console.log(this._settings.desx); */
    
    this._render();
  }, 
  
  hide: function() {
    this._visible = false;
    
    if (this._marker != null) {
      this._wrapper.remove(this._marker);
      delete this._marker;
    }
    
    clearTimeout(this._blinkId);
    this._blinkId = -1;
    this._blinkState = false;
    
  },
  
  getChar: function() {
    return this._settings.char; 
  },
  
  getRow: function() {
    return this._settings.row; 
  },
  
  getParagraph: function() {
    return this._settings.paragraph; 
  },
  
  getDesiredX: function() {
    return this._settings.desx;
  },
  
  isVisible: function() {
    return this._visible;
  }, 
  
  _render: function(){
    
    if (this._marker) {
      $(this._marker).remove();
      delete this._marker;
    }
  
    if (this._visible && this._wrapper && !this._blinkState) {
      // render marker
      this._marker = this._wrapper.rect(
        this._settings.parent,
        this._settings.x, 
        this._settings.y, 
        this._settings.width, 
        this._settings.height,
        {class: 'marker'});
    }
    
    this._blinkState = !this._blinkState;
    clearTimeout(this._blinkId);
    this._blinkId = setTimeout("SVGTextMarker._render()", 550);

  }
  
});