/** 
 *  SVGEditableList
**/

// $.svg.addExtension('list', SVGEditableList);

function SVGEditableList(wrapper){
  this._wrapper = wrapper; // The attached SVG wrapper object
}

// SVGEditableList.inheritsFrom( SVGEditableTextBox );


/* ------- PUBLIC INSTANCE ------- */

$.extend(SVGEditableList.prototype, new SVGEditableTextBox);
$.extend(SVGEditableList.prototype, {
  
  _getGPadding: function() {
    var padding = {};
    padding['top']    = num(StyleSheet.get( 'rect.list', 'padding-top' ))*1.2;
    padding['right']  = num(StyleSheet.get( 'rect.list', 'padding-right' ));
    padding['bottom'] = num(StyleSheet.get( 'rect.list', 'padding-bottom' ));
    padding['left']   = num(StyleSheet.get( 'rect.list', 'padding-left' ));
    return padding; 
  },
});