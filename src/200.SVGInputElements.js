$.svg.addExtension('input', SVGInputElements);

function SVGInputElements(wrapper) {
  this._wrapper = wrapper; // The attached SVG wrapper object
  this._eventmanager;
}

$.extend(SVGInputElements.prototype, {

  /** 
   * Create a textArea.
   * Specify both of x and y or neither of them.
   * @param  parent    (element or jQuery) the parent node for the text (optional)
   * @param  x         (number or number[]) the x-coordinate(s) for the text (optional)
   * @param  y         (number or number[]) the y-coordinate(s) for the text (optional)
   * @param  value     (string) the text content
   * @param  settings  (object) additional settings for the textArea. These are SVG group value + optionally width and height values (optional)
   * @return  (element) the new text node 
   */
  textArea: function (parent, x, y, value, settings) {
    // Code copied and modified from Kieth Wood's jQuery SVG plugin:
    var args = this._wrapper._args(arguments, ['x', 'y', 'value']);
    if (typeof args.x == 'string' && arguments.length < 4) {
      args.value = args.x;
      args.settings = args.y;
      args.x = args.y = null;
    }
    return this._textArea(
      args.parent, 
      //       'textArea', 
      args.value, 
      $.extend({
        x: (args.x && isArray(args.x) ? args.x.join(' ') : args.x),
               y: (args.y && isArray(args.y) ? args.y.join(' ') : args.y)
      }, 
      args.settings || {})
    );
  },
  
  _textArea: function (parent, value, settings) {
    // If width is not enforced and parent has width, inherit width
    if (typeof settings.width == 'undefined') {
      if (box = parent.getBBox()) {
        width = box.width; 
      }
    }
    width = ( typeof settings.width == 'undefined' ) ? -1 : settings.width; 
    height = ( typeof settings.height == 'undefined' ) ? -1 : settings.height; 
    delete settings.width; 
    delete settings.height;
    
    return (new SVGEditableTextBox(this._wrapper)).init(parent, value, width, height, settings);
  },
  
  /** 
   * Code copied and modified from Kieth Wood's jQuery SVG plugin:
   * Create a list.
   * Specify both of x and y or neither of them.
   * @param  parent    (element or jQuery) the parent node for the text (optional)
   * @param  x         (number or number[]) the x-coordinate(s) for the text (optional)
   * @param  y         (number or number[]) the y-coordinate(s) for the text (optional)
   * @param  value     (string) the text content
   * @param  settings  (object) additional settings for the list. These are SVG group value + optionally width and height values (optional)
   * @return  (element) the new text node 
   */
  list: function (parent, x, y, value, settings) {
    var args = this._wrapper._args(arguments, ['x', 'y', 'value']);
    if (typeof args.x == 'string' && arguments.length < 4) {
      args.value = args.x;
      args.settings = args.y;
      args.x = args.y = null;
    }
    return this._list(
      args.parent, 
      args.value, 
      $.extend({
        x: (args.x && isArray(args.x) ? args.x.join(' ') : args.x),
               y: (args.y && isArray(args.y) ? args.y.join(' ') : args.y)
      }, 
      args.settings || {})
    );
  },
  
  _list: function (parent, value, settings) {
    width = ( typeof settings.width == 'undefined' ) ? -1 : settings.width; 
    height = ( typeof settings.height == 'undefined' ) ? -1 : settings.height; 
    delete settings.width; 
    delete settings.height; 
    
    return (new SVGEditableList(this._wrapper)).init(parent, value, width, height, settings);
  },
  
  /** 
   * Code copied and modified from Kieth Wood's jQuery SVG plugin:
   * Create a list.
   * Specify both of x and y or neither of them.
   * @param  parent    (element or jQuery) the parent node for the text (optional)
   * @param  x         (number or number[]) the x-coordinate(s) for the text (optional)
   * @param  y         (number or number[]) the y-coordinate(s) for the text (optional)
   * @param  value     (string) the text content
   * @param  settings  (object) additional settings for the list. These are SVG group value + optionally width and height values (optional)
   * @return  (element) the new text node 
   */
  text: function (parent, x, y, value, settings) {
    var args = this._wrapper._args(arguments, ['x', 'y', 'value']);
    if (typeof args.x == 'string' && arguments.length < 4) {
      args.value = args.x;
      args.settings = args.y;
      args.x = args.y = null;
    }
    return this._text(
      args.parent, 
      args.value, 
      $.extend({
        x: (args.x && isArray(args.x) ? args.x.join(' ') : args.x),
               y: (args.y && isArray(args.y) ? args.y.join(' ') : args.y)
      }, 
      args.settings || {})
    );
  },
  
  _text: function (parent, value, settings) {
    width = ( typeof settings.width == 'undefined' ) ? -1 : settings.width; 
    height = ( typeof settings.height == 'undefined' ) ? -1 : settings.height; 
    delete settings.width; 
    delete settings.height; 
    
    return (new SVGEditableText(this._wrapper)).init(parent, value, width, height, settings);
  },
  
  /** 
   * Code copied and modified from Kieth Wood's jQuery SVG plugin:
   * Create a list.
   * Specify both of x and y or neither of them.
   * @param  parent    (element or jQuery) the parent node for the text (optional)
   * @param  x         (number or number[]) the x-coordinate(s) for the text (optional)
   * @param  y         (number or number[]) the y-coordinate(s) for the text (optional)
   * @param  value     (string) the text content
   * @param  settings  (object) additional settings for the list. These are SVG group value + optionally width and height values (optional)
   * @return  (element) the new text node 
   */
  image: function (parent, x, y, value, settings) {
    var args = this._wrapper._args(arguments, ['x', 'y', 'value']);
    if (typeof args.x == 'string' && arguments.length < 4) {
      args.value = args.x;
      args.settings = args.y;
      args.x = args.y = null;
    }
    return this._image(
      args.parent, 
      args.value, 
      $.extend({
        x: (args.x && isArray(args.x) ? args.x.join(' ') : args.x),
               y: (args.y && isArray(args.y) ? args.y.join(' ') : args.y)
      }, 
      args.settings || {})
    );
  },
  
  _image: function (parent, value, settings) {
    width = ( typeof settings.width == 'undefined' ) ? -1 : settings.width; 
    height = ( typeof settings.height == 'undefined' ) ? -1 : settings.height; 
    delete settings.width; 
    delete settings.height; 
    
    return (new SVGEditableImage(this._wrapper)).init(parent, value, width, height, settings);
  }
});

