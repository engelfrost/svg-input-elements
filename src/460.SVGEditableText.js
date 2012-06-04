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
  _classType: "text", 
  
  _getGPadding: function(g) {
    var padding = {};
    padding['top']    = num(StyleSheet.get( 'rect.text', 'padding-top', g ))*1.2;
    padding['right']  = num(StyleSheet.get( 'rect.text', 'padding-right', g ));
    padding['bottom'] = num(StyleSheet.get( 'rect.text', 'padding-bottom', g ));
    padding['left']   = num(StyleSheet.get( 'rect.text', 'padding-left', g )) + num(StyleSheet.get('text', "font-size", g));
    return padding; 
  },
  
  _preProcessSetText: function(text, textPosition) {
    var before = text.length; 
    text = text.replace(/[\n\r]{1}/g, ""); 
    var after = text.length; 
    var diff = before - after; 
    textPosition = textPosition - diff; 
    return [text, textPosition]; 
  },
});