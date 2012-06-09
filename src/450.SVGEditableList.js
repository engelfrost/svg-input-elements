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
  _classType: "list", 
  
  _getGPadding: function(g) {
    var padding = {};
    padding['top']    = num(StyleSheet.get( 'rect.list', 'padding-top', g ))*1.2;
    padding['right']  = num(StyleSheet.get( 'rect.list', 'padding-right', g ));
    padding['bottom'] = num(StyleSheet.get( 'rect.list', 'padding-bottom', g ));
    padding['left']   = num(StyleSheet.get( 'rect.list', 'padding-left', g )) + num(StyleSheet.get('text', "font-size", g))*2;
    return padding; 
  },
  
  _postParagraphHook: function(group, text) {
    var height = num(text.getAttribute("y"));
    var paddingLeft = num(StyleSheet.get("rect.list", "padding-left", group));
    var lineHeight = num(StyleSheet.get("text", "line-height", group));
    var fontSize = num(StyleSheet.get("text", "font-size", group));
    var radius = fontSize * 0.2; 
    this._wrapper.circle(group, fontSize + paddingLeft, height + lineHeight - fontSize/2 + radius/2, radius); 
    return true; 
  },
});