
/* ------- PUBLIC INSTANCE ------- */

$.extend(SVGEditableTextBox.prototype, {
  _text: '',
  _textPosition: 0, 
  _selectStartCoord: null,
  _selection: null,
  _selectionDisabled: false,
  _tplClickState: false,
  _keepDesiredX: false,
  _moveDown: true,
  _renderTimer: -1,
  _contextMenu: false,
  _classType: "textbox", 
  _size: {width: 0, height: 0}, // cached size, for detecting size change
  g: null,
  
  _history: [{}],
  _historyPos: 0,
  _historyAdd: function(val, textPosition) {
    if (!this._history[this._historyPos+1] 
      || (this._history[this._historyPos+1] 
        && val.length != this._history[this._historyPos+1].length)
      ) {
      this._history = this._history.slice(this._historyPos, this._historyPos+100);
      this._historyPos = 0; 
      this._history.unshift({text: val, textPosition: textPosition});
    }
    return val; 
  },
  _historyUndo: function() {
    this._historyPos = Math.min(this._historyPos+1, this._history.length-1); 
    if (this._history.length > -1) {
      this._text = this._history[this._historyPos].text;   
      this._textPosition = 
        this._history[this._historyPos].textPosition || this._textPosition;  
    }
    this.update(); 
    return this._text;
  },
  _historyRedo: function() {
    this._historyPos = Math.max(this._historyPos-1, 0); 
    this._text = this._history[this._historyPos].text; 
    this._textPosition = 
      this._history[this._historyPos].textPosition || this._textPosition; 
    this.update(); 
    return this._text; 
  },
  
  _setText: function(text, textPosition) {
    this._historyAdd(text, textPosition); 
    var res = this._preProcessSetText(text, textPosition); 
    this._text = res[0]; 
    this._textPosition = res[1];
  },
  
  init: function(parent, value, width, height, settings) {
  
    this._parent = parent; 
    this._text = this._preProcessSetText(value.toString(), 0)[0];
    this._history = [{text: value.toString(), textPosition: null}];
    this._width = width; // value -1 means "no maxwidth"
    this._height = height; // not used at the moment
    SVGEditableTextBox._textareaCount++; 
    this._id = (settings.id || 'textarea-' + SVGEditableTextBox._textareaCount.toString());
    this._class += " " + this._classType + " "+(settings.class || '');
    this._settings = settings;
    
    this._textPositions = []; 
  
    // bind to events
    SVGEditableTextBox.setup();
    
    this.super.init.apply(this);
    
    // Render Objects
    return this._render();
    
  },
  
  editable: function(){
    /* TODO */
  },
  
  destroy: function(){
    $(window).unbind('keydown.editable-textbox');
    
    this.super.destroy.apply(this);
  },
  
  getHeight: function() {
    return this._size['height'];
  },
  
  getWidth: function() {
    return this._size['width'];
  },
  
  openContextMenu: function(g,e) {
    // determine wheter click was on marking or elsewhere
    
    var mouse = {x: e.clientX, y: e.clientY},
        within = false;
    
    $('.marking').each(function(i,el){
    
      var pos = $(el).position();
      
      var bbox = el.getBBox(), 
          width = bbox.width,
          height = bbox.height;
      
      if (pos.left < mouse.x && pos.top < mouse.y // left & below marking
          && pos.left+width > mouse.x && pos.top+height > mouse.y) { // right & above marking
          
          within = true;

      }
    
    });
    
    if (within) {
      this.openMarkingContextMenu();
    }
    else {
      this._selection = null;
      $('.marking').remove();
      this.openSelectionContextMenu();
    }
    
  },
  
  closeContextMenu: function() {
    this._contextMenu = false;
    var newt = (this._group.getAttribute('class')||'').replace('contextmenu', '').trim();
    this._group.setAttribute('class', newt);
  },
  
  openMarkingContextMenu: function() {
    // TODO: Implement context menu for markings
  },
  
  openSelectionContextMenu: function() {
    // TODO: Implement context menu for the group
  },
  
  stopEditing: function(all) {
    if (this._selection && !all) {
      $('.marking').remove();
      this._selection = null;
    }
    else if (SVGTextMarker.isVisible() && !all) {
      SVGTextMarker.hide();
      unselect_marker = true;
    }
    else {
    	$('.marking').remove();
      this._selection = null;
      SVGTextMarker.hide();
      unselect_marker = true;
    }
  },
  
  getSelectedText: function() {
    var txt;
    if (this._selection) {
      p1 = this._getTextCharPosition(this._selection.start);
      p2 = this._getTextCharPosition(this._selection.stop);
      
      txt = this._text.substring(Math.min(p1,p2), Math.max(p1,p2));
    } 
    return txt;
  },
  
  removeSelection: function(){
    if (this._selection) {
      p1 = this._getTextCharPosition(this._selection.start);
      p2 = this._getTextCharPosition(this._selection.stop);
      
      this._text = this._text.substring(0, Math.min(p1,p2)) + this._text.substring(Math.max(p1,p2), this._text.length);
      this._selection = null;
      
      this._textPosition = Math.min(p1,p2);
      this.update();
    }
  },
  
  disableSelection: function() {
  	this.stopEditing(true);
  	this._selectionDisabled = true;
  },
  
  enableSelection: function(){
  	this._selectionDisabled = false;
  },
  
  update: function() {
    var self = this;
    clearTimeout(this._renderTimer);
    this._renderTimer = setTimeout(function(){self._render()},0);
  },
  
  _getGPadding: function(g) {
    var padding = {
      'top'    : num(StyleSheet.get( 'rect.background', 'padding-top', g))*1.2,
      'right'  : num(StyleSheet.get( 'rect.background', 'padding-right', g)),
      'bottom' : num(StyleSheet.get( 'rect.background', 'padding-bottom', g)),
      'left'   : num(StyleSheet.get( 'rect.background', 'padding-left', g))
    }
    return padding; 
  },
  
  _preProcessSetText: function(text, textPosition) {
    return [text, textPosition]; 
  },
  
  _postParagraphHook: function(group, text) {
    return true; 
  },
  
  _render: function() {
    
    var that = this; 
    var x = this._settings.x; 
    var y = this._settings.y; 
//     console.log("this class", this._class);
    var gSettings = {class: this._class, transform: 'translate('+x+','+y+')'};
    var g = this.super._render.call(this, this._parent, this._id, gSettings);
    
    if (g) {
    
    var padding = this._getGPadding(g);
    var maxWidth = this._width - padding['left'] - padding['right'];
//     console.log(maxWidth);
    
    // padding-top is applied through text elements,
    // padding-left is applied through tspan elements and 
    // padding bottom and padding right is applied through the background rect.
    // (padding-left must also be applied to the rect to compensate)
    // Confusing, but it works. 
    
    var textY = padding['top']; 
    var tspanDy = num( StyleSheet.get( 'text', 'line-height', g ) );
    var tspanSettings = { 
      'dy': num(tspanDy), 
      'x': 0, 
      'dx': num(padding['left']), 
//       'xml:space': 'preserve'
    };
    var textSettings = {
      'style': StyleSheet.getAllStyles('text', g)
    };
    if (this._settings.clipPath) {
      textSettings['clip-path'] = this._settings.clipPath;
    }
    
//     console.log(textSettings); 
    
    var paragraphCount = []; // 
    var rowCount = []; 
    var lastRow = 0; 
    var tspans; // tspans to be rendered
    var paragraphs = []; 
    var regex = /(([^\n]+)?[\n])|([^\n]+$)/g; // split by \n preserving any \n.
//     this._text = this._preProcessText(this._text); 
    while ((w = regex.exec(this._text)) != null) {
      paragraphs.push(w[0]); //.replace(/\n$/, ' '));
    }
    if(paragraphs.length == 0) {
      paragraphs = ['']; 
    }
    
    // Special case: trailing empty paragraph
    var lastParagraphLength = paragraphs[paragraphs.length - 1].length; 
    if (paragraphs[paragraphs.length-1].charAt(lastParagraphLength-1) == "\n") {
      paragraphs.push("\u00A0"); // Add space so that height can be calculated
    }
    
//     paragraphs = regex.exec(this._text);
    // Make sure caching is set up: 
    testText = this._wrapper.createText();
    testText.span("test", tspanSettings); 
    var style = $(tmp = that._wrapper.text(-1000, -1000, testText, textSettings))[0].style; 
    fontSettings = style.fontFamily + ','
      + style.fontSize + ','
      + style.fontWeight + ','
      + style.fontStretch + ','
      + style.fontStyle + ','
      + style.fontVariant + ','
      + style.letterSpacing; 
    
    $(tmp).remove();
    
    if (!(fontSettings in SVGEditableTextBox._wordCache)) {
      SVGEditableTextBox._wordCache[fontSettings] = {};
    }
    
    $.each(paragraphs, function(i, paragraph) {
      // Reset row counter
      rowCount = [];
      
      // Find the correct y-offset if there are previous text areas:
      if (el = $(g).find("text").last()[0]) {
        textY = num(el.getAttribute('y')); //parseInt(/translate\(\d+\, (\d+)\)/.exec(e.getAttribute('transform'))[1]); // Better way of doing this? Value is not the same as e.getCTM().f
        var height =  el.getBoundingClientRect().height;
        
        textY += (height / el.getCTM().d); //TODO: This is wrong, renders differently in Fx and GCr
        
        if ($.browser.mozilla) {
          textY += num(StyleSheet.get('text', 'padding-bottom', g)) * 1.4; // Ugly-fix!!!
        }
      }
      
      tspans = that._wrapper.createText(); 
      
      // split paragraph into sections by \r
      var sections = [];
      var regex = /(([^\r]+)?\r)|([^\r]+$)/g;
      while ((w = regex.exec(paragraph)) != null) {
        sections.push(w[0].replace("\r", "\u00A0"));
      }
      if (sections.length == 0 || (sections.length == 1 && sections[0] == "\n")) {
        sections = ["\u00A0"]; 
      }
      
      // Special case: trailing empty new line
      var lastSectionLength = sections[sections.length - 1].length; 
      if (sections[sections.length - 1].charAt(lastSectionLength-1) == "\r") {
        sections.push("\u00A0"); // Add no-break space so that height can be calculated
      }
      
      $.each(sections, function(j, section) {
        // this will be turned into a row when filled up or when there are no 
        // more remainingWords
        
        // Split into words and spaces
        var regex = /\r|[ \u00A0]{1}|[^ \u00A0]+/g; 
        var remainingWords = []; 
        
        while ((w = regex.exec(section)) != null) {
          remainingWords.push(w[0]);
        }
        var tmpRow = '';  
        var tmpText; 
        var tmpRowWidth = 0; 
        
        // Add words one by one splitting them into new spans as necessary
        while (remainingWords[0]) { 
                    
          
          // Search for cached word: 
          cachedWord = SVGEditableTextBox._wordCache[fontSettings][remainingWords[0]];
          if(cachedWord === undefined) {
            // Measure the word length
            
            tmpTspans = that._wrapper.createText(); 
            tmpTspans.span( "\u00A0"+remainingWords[0]+"\u00A0", tspanSettings );
            tmpText = that._wrapper.text( -1000, -1000, tmpTspans, textSettings );
            
            wrapperTspans = that._wrapper.createText(); 
            wrapperTspans.span("\u00A0\u00A0", tspanSettings);
            wrapperText = that._wrapper.text(-1000, -1000, wrapperTspans, textSettings);
            
            cachedWord = SVGEditableTextBox._wordCache[fontSettings][remainingWords[0]] = {
              width: tmpText.width() - wrapperText.width(),
              // Timestamp not needed unless we maintain the cache size
//               timestamp: new Date().getTime()
            }; 
            
            $(tmpText).remove();
            $(wrapperText).remove();
          }
          
          wordWidth = cachedWord.width; 
          
          if ((tmpRowWidth + wordWidth) <= maxWidth || maxWidth == -1) {
            // We're OK, add the word to the row
            var word = remainingWords.shift(); 
//             if (word == "\r") {
//               tmpRow = "\u00A0"; 
//             }
//             else {
              tmpRow = tmpRow + word; 
//             }
            tmpRowWidth += wordWidth; 
          } 
          else { 
            // The row is full.
            
            if (tmpRow == '') {
              // The row is only one word long, so starting a new row won't 
              // help. Instead wrap the word into two or more rows. 
              
              var tmpWord = ''; 
              var remainingChars = remainingWords[0].split("");
              
              while (remainingChars[0]) {
                newTmpWord = tmpWord + remainingChars[0]; 
                
                // Search for cached word: 
                cachedWord = 
                  SVGEditableTextBox._wordCache[fontSettings][newTmpWord];
                
                if(cachedWord === undefined) {
                  // Measure the word length
                  
                  tmpTspans = that._wrapper.createText(); 
                  tmpTspans.span(newTmpWord.replace(/ /g, "\u00A0"), tspanSettings);
                  tmpText = that._wrapper.text(-1000, -1000, tmpTspans); //, textSettings);
                  
                  cachedWord = 
                    SVGEditableTextBox._wordCache[fontSettings][newTmpWord] = 
                    {
                      width: tmpText.width() 
                        + padding['left']
                        + padding['right'], // TODO: is padding supposed to be here? 
//                       timestamp: new Date().getTime()
                    }; 
                }
                
                if (cachedWord.width <= maxWidth) {
                  // We're OK, add another letter to the word
                  tmpWord += remainingChars.shift();
                  wordWidth = cachedWord.width;
                }
                else {
                  // We can't make the word longer now, wrap it and keep 
                  // rendering the word in the next row
                  
                  if (tmpWord.length == 0) {
                    // If maxWidth is less than the caracter width add it 
                    // anyway, each row must take at least one character. 
                    tmpWord += remainingChars.shift(); 
                  }
                  
                  // Add tmpWord to our "real" textbox
                  el = tspans.span(tmpWord.replace(/ /g, "\u00A0"), tspanSettings); 
                  rowCount.push(lastRow);
                  lastRow += tmpWord.length; // adds one too many if final row
                  tmpWord = ''; 
                  wordWidth = 0; 
                }
                
                $(tmpText).remove();
              }
              
              // The too long word is now taken care of! 
              
              remainingWords.shift();
              if (tmpWord !== '') {
                // Add the last part of the long word to be included in the  
                // next row
                
                remainingWords.unshift(tmpWord); 
              }
            }
            else {
              // The row is full, the next word does not fit here
              
              // Always end with a space, even if the line is too long. 
              if (!/[ \u00A0]{1}$/.test(tmpRow) && /^[ \u00A0]{1}$/.test(remainingWords[0])) {
                tmpRow += remainingWords.shift(); 
              }
              
              // Save this row
              tspans.span(tmpRow.replace(/ /g, "\u00A0"), tspanSettings);
              rowCount.push(lastRow); // counter
              lastRow += tmpRow.length;
              // Reset the row variable: 
              tmpRow = ''; 
              tmpRowWidth = 0; 
            }
          }
        }
        
        // We're done, so add the very last row of text
        tspans.span(tmpRow.replace(/ /g, "\u00A0"), tspanSettings); 
        rowCount.push(lastRow); 
        
        // Note: lastRow will be 1 too much for the final row, which does not 
        // end with \r or \n. However, we don't use this variable for the very 
        // last row, so it doesn't matter. 
        lastRow += tmpRow.length; 
      });
      
      paragraphCount.push(rowCount); 
      
      // Append the text to its group: 
      t = that._wrapper.text(g, 0, num(textY), tspans, textSettings);
      
      
      
      that._postParagraphHook(g, t);
    });
    
    // Add invisible lines from bottom to height
    
    var lineHeight = num(StyleSheet.get('text', 'line-height', g));
    

    var width = num(maxWidth) + padding['right'] + padding['left']; 
    var height = g.height() + num(padding['bottom']) + 
      g.firstChild.getBBox().y; // this last value differs depending on 
                                // lineHeight and such
    var bgRect = that._wrapper.rect(g, 0, 0, width, height, 
                                    {class: 'background'} 
                                   );
    g.insertBefore( bgRect, g.firstChild );
    // keep group in focus if selected
    g.reload();
   
    this._textPositions = paragraphCount; 
    
    // keep marker visible if group was selected
    if (g._selected && !this._selectionDisabled) {
      
      var possi = this._getTextPosition(this._textPosition);
      var coord = this._getCoordInTextbox(g, possi.paragraph+1, possi.row+1, possi.char);
      var desx = ( this._keepDesiredX ? SVGTextMarker.getDesiredX() : coord.x );
      
      SVGTextMarker.show(this._wrapper, $.extend(coord, {
	        width   : 2 / g.getCTM().a,
  	      height  : lineHeight * 1.2,
    	    desx    : desx
      	}));
    }
    
    var eChange = $.Event("change", {target: g});
    var eChangeSize = $.Event("changeSize", {target: g});
    
    
    // Trigger events if things have changed
//     this.change();
//     console.log("svg", eChange); 
    
    this.trigger(eChange, [this._text]);
    if (this._size.width != width || this._size.height != height) {
      this._size.width = width; 
      this._size.height = height; 
      this.trigger(eChangeSize, [width, height]); 
    }
    
//     this._group = g;

		}
    
    return this;
  },
  
  _coordInText: function(g,e,no_space_end){    
    // find nearest line if click was outside any line but still inside the grouping element
    var row = e.target,
        nearestDist = 999999, 
        nearestEl,
        paragraphIndex = 0,
        rowIndex = 0,
        lineHeight = num(StyleSheet.get('text', 'line-height', g));
    
    // put mouse position in a temp var
    var mouse={
      x: e.clientX, 
      y: e.clientY
    };
    
    // but only if our target element wasn't a line
    if (g && e.target.constructor !== SVGTSpanElement){
      row = null;
      
      // for each paragraph
      $.each(g.getElementsByTagName('text'), function(i,e){
      
        // for each line
        $.each(e.getElementsByTagName('tspan'), function(i2,e2){
          var temp = e2.position();
          
          // calculate distance
          dist = Math.sqrt(Math.pow(temp.left - mouse.x, 2) + Math.pow(temp.top - mouse.y, 2));
          
          // if distance to next row is smaller than previously seen, remember it
          if (dist < nearestDist) {
            nearestDist = dist;
            nearestEl = e2;
            paragraphIndex = i;
            rowIndex = i2;
          }
          
        });
      });
      
      // store nearest line
      row = nearestEl;
      
    } else {
      if (e.target.parentNode) {
        $.each(e.target.parentNode.parentNode.getElementsByTagName('text'), function(i,el){
          $.each(el.childNodes, function(i2,el2){
            if (el2 == row){
              paragraphIndex = i;
              rowIndex = i2;
            }
          });
        });
      }
    }
    
    if (row && row.firstChild) {
      // store current line's position, no need to calc it every time
      var pos = row.position();
      
      // get closest char position on row to marker
      var stopNext  = false,
          prevLen   = pos.x,
          leftPos   = pos.x, 
          rightPos,
          i = 0,
          closestPos = 0,
          pattern = (no_space_end ? /\r|\n|\s+$/ : /\r|\n/ );
      
      // from start of string to end of string
      var rowLen = row.firstChild.data.replace(pattern, '').length
      for(i; i <= rowLen; i++) {
        // get char width from beginning of line to current character's position in ScreenSpace
        var len = row.getSubStringLength(0,i); // Webkit(Chrome)
        
        if ($.browser.mozilla) { // Mozilla(FF)
          len = Math.max(0,Math.ceil(len-8)); // Ugly-fix!!
        }
        
        charPos = len * g.getScreenCTM().a + pos.left;
        
        // if next position is closest to mouse, then break
        if (stopNext) {
          rightPos = prevLen;
          charIndex = i;
          break;
        }
        
        // stop loop if position of char is larger than mouse's position
        if (charPos > mouse.x) {
          stopNext = true;
          leftPos = prevLen;
        }
        
        // store distance to mouse from current char
        prevLen = charPos;
        
      }
      
      // if no char position was bigger than mouse position, use minimum
      if (!rightPos) rightPos = prevLen;
      
      // determine closest char on line to mouse position
      if (mouse.x-leftPos<rightPos-mouse.x){
        closestPos = leftPos;
        i--;
      }
      else {
        closestPos = rightPos;
      }
      
      var screenCTM = g.getScreenCTM();
      
      return {
        parent    : g,
        element   : row,
        x         : Math.round((closestPos - screenCTM.e) / screenCTM.a),
        y         : Math.round((pos.top - screenCTM.f) / screenCTM.d) - lineHeight,
        paragraph : paragraphIndex + 1,
        row       : rowIndex + 1,
        char      : i-1
      };
    }
    return null;
  },
  
  _getClosestRowCoordsInText: function(g,e){
    
    var pos = this._coordInText(g,e);
  
    if (pos){
      return {
        parent    : g,
        element   : pos.element,  
        x         : pos.x,
        y         : pos.y,
        paragraph : pos.paragraph,
        row       : pos.row,
        char      : pos.char
      };
    }
    return null;
  },
  
  _getWordCoordsInText: function(g, e) {
  
    var pos = this._coordInText(g,e);
  
    if (pos){
    
      var str = pos.element.firstChild.data;
      
      if (str[pos.char]!='\u00A0') {
      
      // get the closest word on the row
    
        for (var i=Math.max(pos.char-1, 0); i>=0; i--){
          if (str[i] == '\u00A0' && i < str.length-1) {
              i = i+1;
              break;
            }
            else if (i <= 0) {
              i = 0;
              break;
            }
        }
        
        for (var j=Math.min(pos.char+1, str.length); j<str.length; j++){
            if (j >= str.length) {
              j = str.length;
              break;
            }
            else if (str[j] == '\u00A0') {
              break;
            }
        }
      } else {
      
      // get the closest spaces on the row
        
        for (var i=Math.max(pos.char-1, 0); i>=0; i--){
          if (str[i] != '\u00A0' && i < str.length-1) {
              i = i+1;
              break;
            }
            else if (i <= 0) {
              i = 0;
              break;
            }
        }
        
        for (var j=Math.min(pos.char+1, str.length); j<str.length; j++){
            if (j >= str.length) {
              j = str.length;
              break;
            }
            else if (str[j] != '\u00A0') {
              break;
            }
        }
        
      }
  
      var len1 = pos.element.getSubStringLength(i, pos.char - i);
      var len2 = pos.element.getSubStringLength(pos.char-(pos.char<str.length?0:1), j - pos.char);
      
      if ($.browser.mozilla) { // Mozilla(FF)
        if (i==0){
          len1 = Math.max(0,Math.ceil(len1-8)); // Ugly-fix!!
          if (len1==0)
            len2 = Math.max(0,Math.ceil(len2-8)); // Ugly-fix!!
        }
        else {
          len1 = Math.max(0,Math.floor(len1+1)); // Ugly-fix!!
        }
        len2 = Math.max(0,Math.floor(len2)); // Ugly-fix!!
      }
    
      return {
        start: {
          parent    : g,
          x         : pos.x - len1,
          y         : pos.y,
          paragraph : pos.paragraph,
          row       : pos.row,
          char      : i
        },
        stop: {
          parent    : g,  
          x         : pos.x + len2,
          y         : pos.y,
          paragraph : pos.paragraph,
          row       : pos.row,
          char      : j
        }
      };
    }
    return null;
  },
  
  _getEndOfRowPosition: function(paragraph, row) {
    if (
      (c = this._textPositions[paragraph][row+1]) !== undefined
    ) {}
    else if (
      this._textPositions[paragraph+1] !== undefined 
      && (c = this._textPositions[paragraph+1][0]) !== undefined
    ) {}
    else { 
      c = this._text.length + 1;
    }
    
    c--;
    
//     if (/\r|\n/.test(this._text.charAt(c-1))) {
//       c--;
//     }
    
    return c; 
  },
  
  _getTextCharPosition: function(coord) {
      return this._textPositions[coord.paragraph-1][coord.row-1] + coord.char;
  },
  
  _getTextPosition: function(pos) {
    
    // Make sure that that pos is within limits
    if (pos <= 0) {
      return {
        paragraph: 0, 
        row: 0, 
        char: 0
      }
    }
    else if (pos > this._text.length) {
      paragraph = this._textPositions.length - 1; 
      row = this._textPositions[paragraph].length - 1; 
      return {
        paragraph: paragraph, 
        row: row, 
        char: this._text.length - this._textPositions[paragraph][row]
      }
    }
    
    row = 0; 
    paragraph = 0; 
    done = false; 
    
    while (this._textPositions[paragraph] !== undefined) {
      while (this._textPositions[paragraph][row] !== undefined) {
        if (this._textPositions[paragraph][row] < pos) {
          // This could be a valid result, save and then see if we can find 
          // a better one
          result = {
            paragraph: paragraph,
            row: row, 
            char: pos - this._textPositions[paragraph][row]
          }
        }
        else if (this._textPositions[paragraph][row] == pos) { // TODO: need this still?
           
          // Exactly what we're looking for, return
          return {
            paragraph: paragraph,
            row: row, 
            char: pos - this._textPositions[paragraph][row]
          };
        }
        else if (this._textPositions[paragraph][row] > pos) {
          // Too far, the last result was as good as it gets
          return result; 
        }
        row++; 
      } 
      paragraph++;
      row = 0;
    }
    
    return result; // Should not be necessary, here as a precaution. 
  },
  
  _getCoordInTextbox: function(g, paragraph, row, char) {
  
    if (g !== undefined && g !== null) {
      
      // go to the paragraph
      var pEl = g.getElementsByTagName('text')[paragraph-1];
      if (pEl) {
        var rEl = pEl.getElementsByTagName('tspan')[row-1];
        
        if (rEl && rEl.firstChild) {
          var len;
          if (rEl.firstChild.data.length >= char && char>0) {
            len = rEl.getSubStringLength(0,char);
          }
          else if (char==0) {
            len = 0;
          }
          else {
            len = rEl.getComputedTextLength();
          }
          
          var screenCTM = g.getScreenCTM();
          var lineHeight = num(StyleSheet.get('text', 'line-height', g));
            
          if ($.browser.mozilla) { // Mozilla(FF)
            len = Math.max(0,Math.ceil(len-8)); // Ugly-fix!!
          }
          
          var pos = rEl.position();
          
          charPos = len * screenCTM.a + pos.left;
    
          return {
            parent    : g,
            element   : row,
            x         : Math.round((charPos - screenCTM.e) / screenCTM.a),
            y         : Math.round((pos.top - screenCTM.f) / screenCTM.d) - lineHeight,
            paragraph : paragraph,
            row       : row,
            char      : char
          };
        }
      }
    } 
    return null;
  },
  
  _getCoordInRowNearX: function(g, paragraph, row, x) {
  
    if (g){
    
      // go to the paragraph
      var pEl = g.getElementsByTagName('text')[paragraph-1];
      if (pEl) {
        var rEl = pEl.getElementsByTagName('tspan')[row-1];
        
        if (rEl && rEl.firstChild) {
        
          // find closest char near X
          var pos = rEl.position();
          var stopNext  = false,
          prevLen   = pos.x,
          leftPos   = pos.x, 
          rightPos,
          i = 0,
          x = x + g.position().left,
          closestPos = 0,
          screenCTM = g.getScreenCTM(),
          lineHeight = num(StyleSheet.get('text', 'line-height', g));
      
          // from start of string to end of string
          for(i; i <= rEl.firstChild.data.length; i++) {
            // get char width from beginning of line to current character's position in ScreenSpace
            var len = rEl.getSubStringLength(0,i); // Webkit(Chrome)
                
            if ($.browser.mozilla) { // Mozilla(FF)
              len = Math.max(0,Math.ceil(len-8)); // Ugly-fix!!
            }
            
            charPos = len * g.getScreenCTM().a + pos.left;
            
            // if next position is closest to mouse, then break
            if (stopNext) {
              rightPos = prevLen;
              charIndex = i;
              break;
            }
            
            // stop loop if position of char is larger than X position
            if (charPos > x) {
              stopNext = true;
              leftPos = prevLen;
            }
            
            // store distance to mouse from current char
            prevLen = charPos;
            
          }
          
          // if no char position was bigger than mouse position, use minimum
          if (!rightPos) rightPos = prevLen;
          
          // determine closest char on line to mouse position
          if (x-leftPos<rightPos-x){
            closestPos = leftPos;
            i--;
          }
          else {
            closestPos = rightPos;
          }
    
          return {
            parent    : g,
            element   : rEl,
            x         : Math.round((closestPos - screenCTM.e) / screenCTM.a),
            y         : Math.round((pos.top - screenCTM.f) / screenCTM.d) - lineHeight,
            paragraph : paragraph-1,
            row       : row-1,
            char      : i-1
          };
        }
      }
    } 
    return null;
  },
  
  _drawWordMarking: function(g, e) {
  
    var coords = this._getWordCoordsInText(g, e),
        width  = coords.stop.x - coords.start.x,
        height = num(StyleSheet.get('text', 'line-height', g));
    
    var marking = this._wrapper.rect(
          coords.stop.parent, 
          coords.start.x, coords.start.y, width, height * 1.2, 
          {class: 'marking'});
    marking.parentNode.insertBefore(marking, marking.parentNode.firstChild.nextSibling);
    
    this._selection = coords;    
  },
  
  _drawRowMarking: function(g, e){
    var coords = this._coordInText(g, e),
        pos = coords.element.offset(),
        width  = coords.element.width(),
        height = coords.element.height();
        
    var marking = this._wrapper.rect(
          coords.parent, 
          pos.left, pos.top - height, width, height * 1.2, 
          {class: 'marking'});
    marking.parentNode.insertBefore(marking, marking.parentNode.firstChild.nextSibling);
    
    this._selection = {
      start: {
        parent: g,
        element: coords.element,
        x: pos.left,
        y: pos.top - height,
        paragraph: coords.paragraph,
        row: coords.row,
        char: 0
      },
      stop: {
        parent: g,
        element: coords.element,
        x: pos.left + width,
        y: pos.top - height,
        paragraph: coords.paragraph,
        row: coords.row,
        char: coords.element.firstChild.data.length-1
      }
    }; 
      
  },
  
  _drawMarking: function(g, e_or_pos) {
  
    var lineHeight = num(StyleSheet.get('text', 'line-height', g));
    
    // if target inside / or the group element
    if (this._selectStartCoord != null) {
      var selectStopCoord;
      
      // if inside of group element
      $('.marking').remove();
    
      if (g 
          && g._selectable 
          && g._selectable.selected) {
        
        if (e_or_pos.clientX !== undefined)
          selectStopCoord = this._coordInText(g,e_or_pos);
        else
          selectStopCoord = e_or_pos;
      
      }
      // if outside of group element
      else { 
        
        // get selected group
        var nearGroup = SVGSelectableGElement.selectedGroup();
        
        // get closest paragraph, row and char for this group
        selectStopCoord = this._getClosestRowCoordsInText(nearGroup._group,e_or_pos);
        
      }
      
      var minX = Math.min(this._selectStartCoord.x, selectStopCoord.x),
          minY = Math.min(this._selectStartCoord.y, selectStopCoord.y),
          maxX = Math.max(this._selectStartCoord.x, selectStopCoord.x),
          maxY = Math.max(this._selectStartCoord.y, selectStopCoord.y);
          
      if (isNumber(minX) 
          && isNumber(minY) 
          && isNumber(maxX) 
          && isNumber(maxY)) {
        
        // more than one row in marking
        if (this._selectStartCoord.row + '.' + this._selectStartCoord.paragraph 
            != selectStopCoord.row + '.' + selectStopCoord.paragraph) {
        
          var that = this;
          var p = 1;

          $.each(selectStopCoord.parent.getElementsByTagName('text'), function(i,el){
              
              var r = 1;
            
              $.each(el.childNodes, function(i2,el2){
                                                  
                var minRow, maxRow, 
                    x1 = that._selectStartCoord.x, 
                    x2 = selectStopCoord.x, pos;
                              
                if (that._selectStartCoord.paragraph > selectStopCoord.paragraph) {
                  minRow = {p: selectStopCoord.paragraph, r: selectStopCoord.row};
                              
                  maxRow = {p: that._selectStartCoord.paragraph, r: that._selectStartCoord.row};
                  
                  x1 = selectStopCoord.x;
                  x2 = that._selectStartCoord.x;
                } 
                else if (that._selectStartCoord.paragraph == selectStopCoord.paragraph) {
                  minRow = {p: that._selectStartCoord.paragraph,
                              r: Math.min(that._selectStartCoord.row, selectStopCoord.row)};
                              
                  maxRow = {p: that._selectStartCoord.paragraph,
                              r: Math.max(that._selectStartCoord.row, selectStopCoord.row)};
                  
                  if (that._selectStartCoord.row > selectStopCoord.row){
                    x1 = selectStopCoord.x;
                    x2 = that._selectStartCoord.x;
                  }
                }
                else {
                  minRow = {p: that._selectStartCoord.paragraph,
                              r: that._selectStartCoord.row};
                              
                  maxRow = {p: selectStopCoord.paragraph,
                            r: selectStopCoord.row};
                             
                }

                var paint = false;
                // paint on first row with marking
                if (p == minRow.p && r == minRow.r) {
                  pos = {left: x1, top: minY};
                  width = el2.width() - pos.left + el2.offset().left;
                  height = el2.height();
                  paint = true;
                }
                else if ((p >= minRow.p && p <= maxRow.p) 
                  && ((r > minRow.r && p == minRow.p && p < maxRow.p) 
                     || (p > minRow.p && p < maxRow.p && minRow.p != maxRow.p)
                     || (minRow.p == maxRow.p && r > minRow.r && r < maxRow.r)
                     || (r < maxRow.r && p == maxRow.p && p > minRow.p))) {
                  
                  pos = el2.offset(),
                  width = el2.width(), 
                  height = el2.height();
                  
                  pos.top -= lineHeight;
                  paint = true;
                }
                // paint on last row with marking
                else if (p == maxRow.p && r == maxRow.r){
                  pos = el2.offset();
                  width = x2 - pos.left;
                  height = el2.height();
                  
                  pos.top -= lineHeight;
                  paint = true;
                }

                if (pos != null && typeof(pos) != 'undefined' && paint) {
                  var marking = that._wrapper.rect(
                        selectStopCoord.parent, 
                        pos.left, pos.top + ($.browser.mozilla?2:0), width, height * ($.browser.mozilla?1:1.2), 
                        {class: 'marking'});
                  marking.parentNode.insertBefore(marking, marking.parentNode.firstChild.nextSibling);
                }
                
                r++;
                
              });
              
              p++;
            
          });
          
        }
        // only one row in marking
        else {  
          var marking = this._wrapper.rect(
                this._selectStartCoord.parent, 
                minX, minY + ($.browser.mozilla?1:0), maxX - minX, maxY - minY + lineHeight * ($.browser.mozilla?1.1:1.2), 
                {class: 'marking'});
          marking.parentNode.insertBefore(marking, marking.parentNode.firstChild.nextSibling);
          
        }
        
        this._selection = {
          start: this._selectStartCoord,
          stop: selectStopCoord
        };
        SVGTextMarker.hide();
        
      } else {
        $('.marking').remove();
      }
      
    }
  },
  
  select: function(g,e) {
    
  },
  
  deselect: function() {
  
    SVGTextMarker.hide();
    
    $('.marking').remove(); 
    
  },
  
  mouseup: function(g,e) {
  
    this._selectStartCoord = null;
    
  },
  
  mousedown: function(g,e) {
  
    // if target inside / or the group element
    var image = (g) && (-1 != $.inArray(
      "image", 
      g.getAttribute("class").split(" ")
    ));
    if (g && g._selectable && g._selectable.selected && !image){
    
      if (e.button != 2) { // contextmenu
        
        this.closeContextMenu();
        
        var dclicktime = $(window).data('dclickstime');
        var diff = new Date().getTime() - dclicktime;
        
        if (!diff || (diff > 300 || this._selection) && !this._tplClickState) {
          if (this._selection) {
            this._selection = null;
            $('.marking').remove();
          }
                    
          var lineHeight = num(StyleSheet.get('text', 'line-height', g));
          var coord = this._coordInText(g,e,true);
          
          if (!this._selectionDisabled) {
            SVGTextMarker.show(this._wrapper, $.extend(coord, {
              width   : 2 / g.getCTM().a,
              height  : lineHeight * 1.2,
              desx    : coord.x
            }));
          }
          
          row = coord.row-1;
          paragraph = coord.paragraph-1; 
          this._textPosition = this._textPositions[paragraph][row] + coord.char;
        
          this._selectStartCoord = this._coordInText(g,e);
          
        } 
        else if (this._tplClickState) {
          this._tplClickState = false;
        }
      }
    } 
  },
  
  mousemove: function(g,e) {
  
    if (this._selectStartCoord)  {
    
      var screenCTM = this._selectStartCoord.parent.getScreenCTM();
      var lineHeight = num(StyleSheet.get('text', 'line-height', g));
                    
      var dx = Math.abs((this._selectStartCoord.x)  * screenCTM.a + screenCTM.e - e.clientX),
          dy = Math.abs((this._selectStartCoord.y + lineHeight)  * screenCTM.d + screenCTM.f - e.clientY);
          
      var delta = Math.sqrt(Math.pow(dx, 2) 
                    + Math.pow(dy,2));
                  
/*       console.log(dx,dy, '.c' , e.clientX, e.clientY, '=', delta); */
      
      if ((dy > lineHeight || dx > 3)) {
    
        if (SVGTextMarker.isVisible()) {
                      
          
            SVGTextMarker.hide();
        }
        
        if (!this._selectionDisabled)
	        this._drawMarking(g,e);
        
      } 
      else if (!this._selectionDisabled) {
          
        SVGTextMarker.show(this._wrapper, $.extend(this._selectStartCoord, {
          width   : 2 / g.getCTM().a,
          height  : lineHeight * 1.2,
          desx    : this._selectStartCoord.x
        }));
        
        $('.marking').remove();
        this._selection = null;
      }
      
    } 
    else if (!this._selectionDisabled) {
      this._drawMarking(g,e);
    }
    
  },
  
  click: function(g,e) {
    
    var lineHeight = num(StyleSheet.get('text', 'line-height', g));
    
    var dclicktime = $(window).data('dclickstime');
    
    if ((new Date().getTime() - dclicktime < 300 || this._selection == null) && !this._tplClickState) {
    
    	// why is this still here
      
    } else if (this._tplClickState) {
      this._tplClickState = false;
    }
    
  },
  
  dblclick: function(g,e) {
    
    // if target inside / or the group element
    if (g){
    
      SVGTextMarker.hide();
  
      $('.marking').remove();
      
      this.closeContextMenu();
      
      if (!this._selectionDisabled)
	      this._drawWordMarking(g,e);
      
    }

  },
  
  tplclick: function(g,e) {
    SVGTextMarker.hide();
    
    $('.marking').remove();
    
    this._tplClickState = true;
    
    this.closeContextMenu();

    if (!this._selectionDisabled)
	    this._drawRowMarking(g,e);
    
    //var coordInText = this._getClosestRowCoordsInText(g,e);
  },
  
  contextmenu: function(g,e) {
    e.preventDefault();
    this._contextMenu = true;
    g.setAttribute('class', g.getAttribute('class')  
      + (/contextmenu/.test(g.getAttribute('class'))?'':' contextmenu'));
      
    this.openContextMenu(g,e);
  }
});
