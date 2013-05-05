// Function.inheritsFrom
Function.prototype.inheritsFrom = function( parentClassOrObject ){ 
  if ( parentClassOrObject.constructor == Function ) 
  { 
    //Normal Inheritance 
    this.prototype = new parentClassOrObject;
    this.prototype.constructor = this;
    this.prototype.super = parentClassOrObject.prototype;
  } 
  else 
  { 
    //Pure Virtual Inheritance 
    this.prototype = parentClassOrObject;
    this.prototype.constructor = this;
    this.prototype.super = parentClassOrObject;
  } 
  return this;
}

function isNumber(input){
  return typeof(input)=='number';
}

function isArray(a) {
  return (a && a.constructor == Array);
}

if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

/* Disable standard selection of text */
$.fn.disableSelection = function() {
  return this.each(function() {           
    $(this).attr('unselectable', 'on')
      .css({
        '-moz-user-select'    :'none',
        '-webkit-user-select' :'none',
        'user-select'         :'none',
        '-ms-user-select'     :'none'
      })
      .each(function() {
        this.onselectstart = function() { return false; 
      };
    });
  });
};

// Tripple click events
var tId;
$.event.special.tripleclick = {

    setup: function(data, namespaces) {
        var elem = this, $elem = jQuery(elem);
        $elem.bind('mouseup', jQuery.event.special.tripleclick.handler);
    },

    teardown: function(namespaces) {
        var elem = this, $elem = jQuery(elem);
        $elem.unbind('mouseup', jQuery.event.special.tripleclick.handler)
    },

    handler: function(event) {
        var elem = this, $elem = jQuery(elem), clicks = $elem.data('tclicks') || 0;
        clickpos = $elem.data('tclickpos') || -1;
        
        clicks += 1;
        clearTimeout(tId);
        tId = setTimeout(function(){ 
          clicks=0;
          
          $elem.data('tclickpos', {x: -1, y: -1});
          
          $elem.data('tclicks', 0);
           
        }, 350);
        
        if ( clicks === 2 ) {
          $elem.data('tclickpos', {x: event.clientX, y: event.clientY});
        }
        else if ( clicks === 3 ) {
            
          var dist = Math.sqrt(Math.pow(clickpos.x - event.clientX, 2) 
                        + Math.pow(clickpos.y - event.clientY,2));
                        
          clicks = 0;
            
          clearTimeout(tId);
                        
          if (dist < 5) { 


              // set event type to "tripleclick"
              event.type = "tripleclick";
  
              // let jQuery handle the triggering of "tripleclick" event handlers
              jQuery.event.handle.apply(this, arguments);
              
            }
            
            $elem.data('tclickpos', {x: -1, y: -1});
        }
        $elem.data('tclicks', clicks);
    }

};

// Double click events
var dId;
$.event.special.doubleclick = {

    setup: function(data, namespaces) {
        var elem = this, $elem = jQuery(elem);
        $elem.bind('mousedown', jQuery.event.special.doubleclick.handler);
    },

    teardown: function(namespaces) {
        var elem = this, $elem = jQuery(elem);
        $elem.unbind('mousedown', jQuery.event.special.doubleclick.handler)
    },

    handler: function(event) {
        var elem = this, $elem = jQuery(elem);
        clicktime = $elem.data('dclickstime') || -1;
        clickpos = $elem.data('dclickpos') || -1;
        
        if (clicktime < 0 || (clicktime > 0 && new Date().getTime() - clicktime > 500)) {
          clicktime = new Date().getTime();
          $elem.data('dclickstime', clicktime);
          $elem.data('dclickpos', {x: event.clientX, y: event.clientY});
        }
        else {
        
          if (new Date().getTime() - clicktime < 500) {
          
            var dist = Math.sqrt(Math.pow(clickpos.x - event.clientX, 2) 
                        + Math.pow(clickpos.y - event.clientY,2));
                        
            if (dist < 5) {
          
              // set event type to "doubleclick"
              event.type = "doubleclick";
  
              // let jQuery handle the triggering of "doubleclick" event handlers
              jQuery.event.handle.apply(this, arguments);
              
            }
          }
          
          $elem.data('dclickstime', -1);
          $elem.data('dclickpos', {x: -1, y: -1});
        }
    }

};

// List approved types
var types = [SVGGElement, SVGTextElement, SVGTSpanElement, SVGRectElement, SVGImageElement];
var typeNames = types.map(function(e,i){ return e.name; });

var StyleSheet = {
  StyleCache: {}, 
  /** 
   * selector:  CSS selector without parents and pseudo-classes. Only tag, id, and class. 
   * style:     The style wanted
   * parent:    The parent object, for matching inheritance
   * 
   * Returns the style value for given selector and style. Any style definitions
   * that require parents are ignored, since thier relevancy is ambiguous. We 
   * only handle the structure 'tag#id.class, tag#id.class...'
   */ 
  getAllStyles: function(selector, parent) {
    return this._get(selector, undefined, parent); 
  },
  
  get: function (selector, style, parent) {
    style = style || ""; 
    
    strParent = this._parentToString(parent); 
    
    if (this.StyleCache[strParent]                   !== undefined 
      && this.StyleCache[strParent][selector]        !== undefined 
      && this.StyleCache[strParent][selector][style] !== undefined 
    ) {
      return this.StyleCache[strParent][selector][style]; 
    }
    else {
      return this._get(selector, style, parent); 
    }
  },
  
  _get: function (selector, style, parent) {
    var selectorRegExp = /^([\w]*)(\#[\w]+)?(\.[\w]+)?$/;
    var heritageRegExp = /^(.*[^>])(\s+|\s*\>\s*)([\w\.\#]+)$/; 
    var result = ''; 
    
    if (style !== undefined) {
      var ccStyle = $.camelCase(style);
    }
    $.each( document.styleSheets, function( i, styleSheet ) {
      // parse all stylesheets
      
      _parseRules(styleSheet.cssRules);
      
      // This is a function so that it can be called recursively
      function _parseRules(cssRules) {
          if (cssRules) {
              $.each(cssRules, function (i, ruleBundle) {
                  // parse all rules

                  // Is this an @import rule? 
                  if (ruleBundle.styleSheet) {
                      cssRules = ruleBundle.styleSheet.cssRules;
                      _parseRules(cssRules);
                  }
                  else {
                      if (ruleBundle.selectorText) {
                          $.each(ruleBundle.selectorText.split(","), function (i, rule) {
                              // split all grouped styles

                              var heritageOk = true;
                              if (heritageRegExp.test(rule.trim())) {
                                  // The rule uses parents, check if parent qualifies

                                  var heritage = heritageRegExp.exec(rule.trim());

                                  // Does parent match the rule? 
                                  heritageOk = $(parent).is(heritage[1]);

                                  // Still got to make sure the child qualifies
                                  rule = heritage[3];
                              }

                              r = selectorRegExp.exec(rule.trim());
                              s = selectorRegExp.exec(selector);

                              // We ignore some stuff, like pseudo-elements, rules with parents etc. 
                              // We only handle what the regexp can handle.

                              // This can probably be re-written with jQuery .is()...
                              if (r != null && s != null) {

                                  // Check if rule requires a specific tag
                                  tagOk = (r[1] == '' || r[1] == s[1]);

                                  // Check if rule requires ID 
                                  idOk = (r[2] == undefined || r[2] == s[2]);

                                  // Check if rule requires class
                                  classOk = (r[3] == undefined || r[3] == s[3]);

                                  if (tagOk && idOk && classOk && heritageOk) {
                                      // If this is a match, update result with any new stuff

                                      if (style === undefined) {
                                          $.each(ruleBundle.style, function (key, val) {
                                              if (val) {
                                                  result +=
                                                    val
                                                    + ": "
                                                    + ruleBundle.style[val]
                                                    + "; ";
                                              }
                                          });
                                      }
                                      else {
                                          if (typeof ruleBundle.style[style] != 'undefined'
                                            && ruleBundle.style[style] !== '') {

                                              // Save the result, but don't return it yet. Other rules may 
                                              // overwrite it later, since the rules are cascading. 
                                              result = ruleBundle.style[style];
                                          }
                                          else if (typeof ruleBundle.style[ccStyle] != 'undefined'
                                            && ruleBundle.style[ccStyle] !== '') {

                                              // Some browsers use camelCase
                                              result = ruleBundle.style[ccStyle];
                                          }
                                      }
                                  }
                              }
                          });
                      }
                  }
              });
          }
        }
    });
    
    // Return the final result. 
    this.cache(selector, style, result, parent);
    return result; 
  },
  
  _parentToString: function(parent) {
    if (parent) {
      return parent.nodeName 
        + "--" + (parent.getAttribute('id') || "") 
        + "--" + (parent.getAttribute('class') || "").replace(" ", ".");
    }
    else {
      return ""; 
    }
  },
  
  cache: function (selector, style, value, parent) {  //TODO: Do something with parent!
    parent = this._parentToString(parent); 
    
    if (this.StyleCache[parent] === undefined) {
      this.StyleCache[parent] = {};
    }
    if (this.StyleCache[parent][selector] === undefined) {
      this.StyleCache[parent][selector] = {}; 
    }
    if (this.StyleCache[parent][selector][style] === undefined) {
      this.StyleCache[parent][selector][style] = value; 
    }
    return value; 
  }
}

function num(val){ num
  return val != null && typeof(val) != 'undefined' ? parseInt(val || 0) : 0;
}

var elems = [], destroyerId;
function destroyElem(element){
  elems.push(element);
  clearTimeout(destroyerId);
  destroyerId = setTimeout(function(){destroyer()}, 100);
}

function destroyer() {
  if (elems.length>0) {
    element = elems.pop();
    
    /*
while (element.hasChildNodes()) {
      element.removeChild(element.lastChild);
    }
*/
    element.innerHTML = '';
    $(element).remove();
    
    destroyerId = setTimeout(function(){destroyer()}, 10);
  }
}

/* Extend TextBox SVG types with more locatability functionality */
$.each(types, function(i,t){
  if (t !== SVGRectElement && t !== SVGImageElement) {
    $.extend(t.prototype, {
      width: function() {
        if (t === SVGTSpanElement){ 
          var len = this.getSubStringLength(0, this.firstChild.data.length);
          
          if ($.browser.mozilla) { // Mozilla(FF)
            len = Math.max(0,Math.ceil(len-8)); // Ugly-fix!!
          }   
        
          return len;
        } else {
          return this.getBBox().width;
        }
      },
      height: function() {
        if (t === SVGTSpanElement){ 
          g = SVGSelectableGElement._getGroupTarget(this);
          return num(StyleSheet.get('text', 'line-height', g));
        } else {
            var height = this.getBBox().height;
          
          if ($.browser.mozilla && t === SVGGElement) {
              var tpad = num(StyleSheet.get( 'text', 'padding-bottom', this ));
            height += Math.min(num(StyleSheet.get( 'rect.textbox', 'padding-bottom', this )), tpad/(tpad>10?1.2:(tpad>6?0.9:0.8)));
          }
        
          return height;
        }
      }
    });
  }
  $.extend(t.prototype, {
    offset: function() { // position within parentNode element
      if (t === SVGTSpanElement){ 
        
        var dx = num(this.getAttribute('dx'));
        var dy = num(this.getAttribute('dy'));
        dy += num(this.parentNode.getAttribute('y'));

        // iterate through sibling-tspans above and grab their relative position
        var prev = this.previousSibling;
        while(prev != null) {
          dy  += num(prev.getAttribute('dy'));
          prev = prev.previousSibling;
        }
        
        return {
          left  : dx, 
          top   : dy}
      } else if (t !== SVGTSpanElement) {
        return {
          left  : this.getCTM().e + num(this.getAttribute('x')), // not verified
          top   : this.getCTM().f + num(this.getAttribute('y'))} // not verified
      }
      return {
        left  : this.getCTM().e - this.parentNode.getCTM().e + num(this.getAttribute('x')),
        top   : this.getCTM().f - this.parentNode.getCTM().f + num(this.getAttribute('y'))}
    },
    position: function() { // position within screenSpace
      if (t === SVGTSpanElement){
        var screenCTM = this.parentNode.getScreenCTM();
        
        var x = num(this.parentNode.getAttribute('x'));
        var y = num(this.parentNode.getAttribute('y'));
        
        var dx = num(this.getAttribute('dx'));
        var dy = num(this.getAttribute('dy'));

        // iterate through siblings above and grab their relative position
        var prev = this.previousSibling;
        while(prev != null) {
          dy  += num(prev.getAttribute('dy'));
          prev = prev.previousSibling;
        }
        
        return {
          left  : Math.round( screenCTM.e + (x + dx) * screenCTM.a ), 
          top   : Math.round( screenCTM.f + (y + dy) * screenCTM.d )}
      }
      var pos;
      if (typeof this.getScreenCTM == 'function'){ // Webkit
        var pos = this.getScreenCTM();
      }
      else { // firefox
        var pos = $(this).position();
      }
      return {
        left  : Math.round( pos.e ), 
        top   : Math.round( pos.f )};
    }
  });
});

/*
String.prototype.ltrim = function() {
  return this.replace(/^\s+/,"");
}
String.prototype.rtrim = function() {
  return this.replace(/\s+$/,"");
}
*/
