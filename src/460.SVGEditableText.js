/** 
 *  SVGEditableList
**/

// $.svg.addExtension('list', SVGEditableList);

function SVGEditableText(wrapper){
  this._wrapper = wrapper; // The attached SVG wrapper object
}

// SVGEditableList.inheritsFrom( SVGEditableTextBox );


/* ------- PUBLIC INSTANCE ------- */

$.extend(SVGEditableText.prototype, new SVGEditableTextBox);
$.extend(SVGEditableText.prototype, {
  _classType: "text", 
  
  _preProcessSetText: function(text, textPosition) {
    var before = text.length; 
    text = text.replace(/[\n\r]{1}/g, ""); 
    var after = text.length; 
    var diff = before - after; 
    textPosition = textPosition - diff; 
    return [text, textPosition]; 
  },
});