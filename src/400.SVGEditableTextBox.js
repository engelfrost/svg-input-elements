/** 
 *  SVGEditableTextBox
**/

function SVGEditableTextBox(wrapper){
  this._wrapper = wrapper; // The attached SVG wrapper object
}

SVGEditableTextBox.inheritsFrom( SVGSelectableGElement );

// "static" stuff
$.extend(SVGEditableTextBox, {
  once: false,
  _wordCache: {}, 
  _textareaCount: 0, 
  
  setup: function(){
    
    // do all times
    
    if (!this.once){
      
      // do only once
      
      $(window).bind('keypress.' + this.name, function(e) {
        // Catch all characters and insert into any selected text box
        
        var selectedGroup = SVGSelectableGElement.selectedGroup();
        var that = this; 
        
        if (selectedGroup 
          && selectedGroup.constructor === SVGEditableTextBox) {
          char = String.fromCharCode(e.which);
          
          if (!(e.shiftKey
              && ((e.keyCode > 36 && e.keyCode < 41 && !e.ctrlKey)
                || (e.keyCode > 34 && e.keyCode < 37))
              )){
            selectedGroup._selectStartCoord = null;
            selectedGroup.removeSelection();
          }
            
          var charPosition  = selectedGroup._textPosition,
              pos           = selectedGroup._getTextPosition(charPosition),
              paragraph     = pos.paragraph,
              row           = pos.row; 
          
          switch (e.which) {
            case 13: // enter
              char = e.shiftKey ? "\r" : "\n";
              break;
              
            case 32: // space
              char = "\u00A0";
              break;
              
            default: 
          }
          
          selectedGroup._setText(
            selectedGroup._text.substring(0, charPosition) 
            + char 
            + selectedGroup._text.substring(charPosition), 
            charPosition + 1
          );
          
          e.preventDefault();
          selectedGroup.update();
        }
      });
      
      $(window).bind('keydown.' + this.name, function(e){
        // Catch all commands and apply to the selected textbox
        
        var stopDefault = true,
            cancelUpdate = true;
        var selectedGroup = SVGSelectableGElement.selectedGroup();
        var markall = false;
        var unselect_marker = false;
        
        if (selectedGroup 
          && selectedGroup.constructor === SVGEditableTextBox) {
        
          var keepDesiredX = false;
          
          var charPosition  = selectedGroup._textPosition,
              possi         = selectedGroup._getTextPosition(charPosition),
              paragraph     = possi.paragraph,
              row           = possi.row;
          
          if (e.shiftKey && (e.keyCode < 35 || e.keyCode > 40)){
            if (selectedGroup._selection) {
              selectedGroup._selectStartCoord = selectedGroup._selection.start;
            }
          }
          else if (e.shiftKey
              && ((e.keyCode > 36 && e.keyCode < 41 && !e.ctrlKey)
                || (e.keyCode > 34 && e.keyCode < 37))
              ) {
            
            if (!selectedGroup._selectStartCoord) {
            // set start position for new selection            
              selectedGroup._selectStartCoord = 
                selectedGroup._getCoordInTextbox(
                  selectedGroup._group, 
                  possi.paragraph+1, 
                  possi.row+1, 
                  possi.char
                );
               
              selectedGroup._selection = null;
            
            }
            
          }
          else if (e.keyCode > 34 && e.keyCode < 41) {
            //arrows, home, end
            selectedGroup._selectStartCoord = null;
            
          }
          
          if (e.metaKey || e.ctrlKey) { // CTRL/CMD
            stopDefault = true;
            
            switch (e.keyCode) {
              case 35: // end
              
                var c = selectedGroup._textPositions[paragraph][row];
                if (selectedGroup._text[c] == ' ' && c != 0)
                  c = c + 1;
                
                selectedGroup._textPosition = c;
                break;
                
              case 36: // home
              
                selectedGroup._textPosition = 0;
                break;

              
              case 65: // cmd/ctrl+a
                
                markall = true;
                
                var endpos = selectedGroup._getTextPosition(selectedGroup._text.length-1);
                var stopcoord = selectedGroup._getCoordInTextbox(selectedGroup._group, endpos.paragraph+1, endpos.row+1, 999999);
                
                selectedGroup._selectStartCoord = selectedGroup._getCoordInTextbox(selectedGroup._group, 1, 1, 0);
                
                selectedGroup._selection = {
                  start: selectedGroup._selectStartCoord,
                  stop: stopcoord
                };
                
                selectedGroup._drawMarking(selectedGroup._group, stopcoord);
                selectedGroup._selectStartCoord = null;
              
                SVGTextMarker.hide();
                
                selectedGroup._textPosition = selectedGroup._text.length;
                
                break;
              
              case 67: // cmd/ctrl+c 
                tx = $('<textarea>' + selectedGroup.getSelectedText().replace(/\r/g, String.fromCharCode(11)) + '</textarea>');
                dump = $('<div class="dump">').css({position:'absolute',top:'-9999px',left:'-9999px'}).prepend(tx);
                $('body').prepend(dump);
                tx.bind('change', function(e){
                  console.log('change');
                });
                tx.bind('copy', function(e){
                  setTimeout(function(){
                    dump.remove();
                  }, 100);
                });
                tx.focus();
                tx.select();
                
                stopDefault = false;
                
                break;
              
              case 83: // cmd/ctrl+s
              	e.preventDefault(); 
              	break;
              
              case 86: // cmd/ctrl+v
                
                tx = $('<textarea></textarea>');
                dump = $('<div class="dump">').css({position:'absolute',top:'-9999px',left:'-9999px'}).prepend(tx);
                $('body').prepend(dump);
                tx.bind('change', function(e){
                  console.log('change');
                });
                tx.bind('paste', function(e){
                  that = this;
                  setTimeout(function(){
                    var newtxt = $(that).val();
                    if (selectedGroup._selection) {
                      selectedGroup.removeSelection(); 
                    }
                    
                    selectedGroup._setText(
                      selectedGroup._text.substring(
                          0,
                          selectedGroup._textPosition
                        ) 
                        + newtxt 
                        + selectedGroup._text.substring(
                          selectedGroup._textPosition, 
                          selectedGroup._text.length-1
                        ), 
                        selectedGroup._textPosition + newtxt.length
                      );
                    
                    dump.remove();
                    selectedGroup.update();
                  },0);
                });
                tx.focus();
                
                stopDefault = false; 
                
                break;
              
              case 88: // cmd/ctrl+x 
                if (selectedGroup._selection) {
                  tx = $('<textarea>' + selectedGroup.getSelectedText().replace(/\r/g, String.fromCharCode(11)) + '</textarea>');
                  selectedGroup.removeSelection();
                  
                  selectedGroup._setText(selectedGroup._text, selectedGroup._textPosition);
                  
                  dump = $('<div class="dump">').css({position:'absolute',top:'-9999px',left:'-9999px'}).prepend(tx);
                  $('body').prepend(dump);
                  tx.bind('change', function(e){
                    console.log('change');
                  });
                  tx.bind('copy', function(e){
                    setTimeout(function(){
                      dump.remove();
                    }, 100);
                  });
                  tx.focus();
                  tx.select();
                  
                  stopDefault = false;
                }
                
                cancelUpdate = false; break;
              
              case 90: // cmd/ctrl(+shift)+z
                if (e.shiftKey) {
                  selectedGroup._historyRedo();
                  
                }
                else {
                  selectedGroup._historyUndo();
                  
                }
                break;
              default: 
                stopDefault = false; 
            }
          }
          
          if (e.metaKey) { // CMD only
            stopDefault = true;
            
            switch (e.keyCode) {
            
              case  8: // cmd+backspace (remove til beginning of line)
              
                if (selectedGroup._selection) {
                  selectedGroup.removeSelection();
                
                } else {  
                  selectedGroup._setText(
                    selectedGroup._text.substring(0, selectedGroup._textPositions[paragraph][row]) 
                    + selectedGroup._text.substring(charPosition), 
                                         Math.max(0,selectedGroup._textPositions[paragraph][row])
                  );
                  
                  cancelUpdate = false;
                  
                  break;
                  
                }
                
                break;
              
              case 37: // cmd+left (beginning of line)
                selectedGroup._textPosition = 
                selectedGroup._textPositions[paragraph][row];
                break;
                
              case 38: // cmd+up (beginning of text)
              
                selectedGroup._textPosition = 0;
                break;
                
              case 39: // cmd+right (end of line)
                selectedGroup._textPosition = 
                selectedGroup._getEndOfRowPosition(paragraph, row);
                break;
                
              case 40: // cmd+down (end of text)
                var v = selectedGroup._textPositions;
                selectedGroup._textPosition = selectedGroup._text.length;
                break;
                
              default: 
                stopDefault = false;
            }
          }
          
          if (!e.metaKey && !e.ctrlKey) {
  
            switch (e.which) {
              case  8: // backspace
                if (selectedGroup._selection) {
                  selectedGroup.removeSelection();
                  
                  selectedGroup._setText(selectedGroup._text, selectedGroup._textPosition);
                  
                } else if (SVGTextMarker.isVisible()) {
                  selectedGroup._setText( 
                    selectedGroup._text.substring(0, charPosition-1) 
                    + selectedGroup._text.substring(charPosition), 
                                         Math.max(0,charPosition - 1)
                  );
                  
                }
                
                // send a delete event when user wants to delete the group
                if (!selectedGroup._contextMenu && !(selectedGroup._selection || SVGTextMarker.isVisible())) {
                  selectedGroup._delete();
                }
                
                cancelUpdate = false;
                break;
                
              case 27: // esc
              
                if (selectedGroup._contextMenu) {
                  selectedGroup.closeContextMenu();
                }
                else if (selectedGroup._selection || SVGTextMarker.isVisible()) {
                  selectedGroup.stopEditing();
                }
                else {
                  SVGSelectableGElement.deselectAll();
                }
                break;
                
              case 35: // end
                selectedGroup._textPosition = 
                  selectedGroup._getEndOfRowPosition(paragraph, row);
                break;
                
              case 36: // home
                selectedGroup._textPosition = 
                  selectedGroup._textPositions[paragraph][row];
                break;
                
              case 37: // left
                if (!selectedGroup._selection || e.shiftKey)
                  selectedGroup._textPosition =  Math.max(charPosition - 1, 0);
                else if (!e.shiftKey) {
                  
                  var pa = selectedGroup._selection.start.paragraph,
                      ro = selectedGroup._selection.start.row, 
                      ch = selectedGroup._selection.start.char;
                      
                  if (
                      (
                        pa == selectedGroup._selection.stop.paragraph 
                        && 
                        ro == selectedGroup._selection.stop.row 
                        && 
                        ch > selectedGroup._selection.stop.char
                      ) || (
                        pa == selectedGroup._selection.stop.paragraph 
                        && 
                        ro > selectedGroup._selection.stop.row
                      ) || (
                        pa > selectedGroup._selection.stop.paragraph
                      )
                    ){
                    
                    pa = selectedGroup._selection.stop.paragraph;
                    ro = selectedGroup._selection.stop.row;
                    ch = selectedGroup._selection.stop.char;
                  }
                  
                  selectedGroup._textPosition = selectedGroup._textPositions[pa-1][ro-1] + ch;
                  
                }
                break;
                
              case 38: // up
                keepDesiredX = true;
                selectedGroup._moveDown = false;
                
                var dscx;
                
                if (selectedGroup._selection && !e.shiftKey) {
                  
                  paragraph = selectedGroup._selection.start.paragraph-1,
                  row = selectedGroup._selection.start.row-1;
                  dscx = selectedGroup._selection.start.x;
                  
                  if (row == selectedGroup._selection.start.row-1
                      && paragraph == selectedGroup._selection.stop.paragraph-1)
                    dscx = Math.min(selectedGroup._selection.stop.x, selectedGroup._selection.start.x);
                      
                  if (
                      (
                        paragraph == selectedGroup._selection.stop.paragraph-1 
                        && 
                        row > selectedGroup._selection.stop.row-1
                      ) || (
                        paragraph > selectedGroup._selection.stop.paragraph-1
                      )
                    ){
                    
                    paragraph = selectedGroup._selection.stop.paragraph-1,
                    row = selectedGroup._selection.stop.row-1;
                    dscx = selectedGroup._selection.stop.x;
                  }
                }
                
                var t               = selectedGroup._textPositions,
                    p               = row-1<0 ? paragraph-1 : paragraph,
                    r               = row-1<0 ? (t[p]||[0]).length-1 : row-1,
                    rp              = t[Math.max(0,p)][r];
                  
                var desx            = (t[p]||!e.shiftKey?(dscx || SVGTextMarker.getDesiredX()) * selectedGroup._group.getScreenCTM().a : 0),
                    coord           = selectedGroup._getCoordInRowNearX(selectedGroup._group,Math.max(0,p)+1,r+1,desx),
                    c               = rp + coord.char;
                    
                if (coord) {
                  var len           = t[paragraph][row] - rp,
                      char          = selectedGroup._text[c-1];
                      
                  c -= (/\s/.test(char) && coord.char!= 0 ? 1 : 0);
                  
                }
                
                selectedGroup._textPosition = c;
                
                break;
                
              case 39: // right 
                if (!selectedGroup._selection || e.shiftKey) {
                  selectedGroup._textPosition =  Math.min(charPosition + 1, selectedGroup._text.length);
                }
                else if (!e.shiftKey) {
                  
                  var pa = selectedGroup._selection.stop.paragraph,
                      ro = selectedGroup._selection.stop.row, 
                      ch = selectedGroup._selection.stop.char;
                      
                  if (
                      (
                        pa == selectedGroup._selection.start.paragraph 
                        && 
                        ro == selectedGroup._selection.start.row 
                        && 
                        ch < selectedGroup._selection.start.char
                      ) || (
                        pa == selectedGroup._selection.start.paragraph 
                        && 
                        ro < selectedGroup._selection.start.row
                      ) || (
                        pa < selectedGroup._selection.start.paragraph
                      )
                    ){
                    
                    pa = selectedGroup._selection.start.paragraph;
                    ro = selectedGroup._selection.start.row;
                    ch = selectedGroup._selection.start.char;
                  }
                  
                  selectedGroup._textPosition = selectedGroup._textPositions[pa-1][ro-1] + ch;
                  
                }
                break;
                
              case 40: // down
                keepDesiredX = true;
                selectedGroup._moveDown = true;
                
                if (selectedGroup._selection && !e.shiftKey) {
                  
                  paragraph = selectedGroup._selection.stop.paragraph-1,
                  row = selectedGroup._selection.stop.row-1;
                  dscx = selectedGroup._selection.stop.x;
                  
                  if (row == selectedGroup._selection.start.row-1
                      && paragraph == selectedGroup._selection.stop.paragraph-1)
                    dscx = Math.max(selectedGroup._selection.stop.x, selectedGroup._selection.start.x);
                      
                  if (
                      (
                        paragraph == selectedGroup._selection.start.paragraph-1 
                        && 
                        row < selectedGroup._selection.start.row-1
                      ) || (
                        paragraph < selectedGroup._selection.start.paragraph-1
                      )
                    ){
                    
                    paragraph = selectedGroup._selection.start.paragraph-1,
                    row = selectedGroup._selection.start.row-1,
                    dscx = selectedGroup._selection.start.x;
                  }
                }
                
                var t               = selectedGroup._textPositions,
                    np              = paragraph + (t.length > paragraph+1 ? 1 : 0)
                    p               = row+1 >= t[paragraph].length ? np : paragraph,
                    r               = row+1 >= t[paragraph].length ? (paragraph+1 > t.length-1 ? t[p].length-1 : 0) : row+1,
                    rp              = t[p][r];
                  
                var desx            = (e.shiftKey && p == t.length-1 && t[p].length == row+1 ? 999999 : (dscx || SVGTextMarker.getDesiredX()) * selectedGroup._group.getScreenCTM().a),
                    coord           = selectedGroup._getCoordInRowNearX(selectedGroup._group,p+1,r+1,desx),
                    c               = rp + coord.char;
                    
                if (coord) {
                  var len           = rp - t[paragraph][row],
                      char          = selectedGroup._text[c-1];
                      
                  c -= (/\s/.test(char) && coord.char!= 0 && coord.char != len ? 1 : 0);
                  
                }
                
                selectedGroup._textPosition = c;
                break;
                
              case 46: // delete
                if (selectedGroup._selection) {
                  selectedGroup.removeSelection();
                  
                } else if (selectedGroup._selection || SVGTextMarker.isVisible()) {
                  selectedGroup._setText(
                    selectedGroup._text.substring(0, charPosition) 
                    + selectedGroup._text.substring(charPosition+1), 
                                         charPosition
                  );
                  
                  cancelUpdate = false;
                  
                  break;
                  
                }
                
                // send a delete event when user wants to delete the group
                if (!selectedGroup._contextMenu && !(selectedGroup._selection || SVGTextMarker.isVisible())) {
                  selectedGroup._delete();
                }
                
                cancelUpdate = false;
                
                break;
              default: stopDefault = false;
            }
          }
          
          if (stopDefault) {
            e.preventDefault();
            (cancelUpdate ? 0 : selectedGroup.update() );
          }
          
          selectedGroup._keepDesiredX = keepDesiredX;
          
          (cancelUpdate ? 0 : selectedGroup.update() );
          
          if (cancelUpdate && !markall) {
            // keep marker visible if group was selected
            var lineHeight = num(StyleSheet.get('text', 'line-height', selectedGroup._group));  // Find and pass parent here for all style rules!
            var possi = selectedGroup._getTextPosition(selectedGroup._textPosition);
            var coord = selectedGroup._getCoordInTextbox(selectedGroup._group, possi.paragraph+1, possi.row+1, possi.char);
            
            if (selectedGroup._group._selected && !unselect_marker) {
             
              var desx = ( selectedGroup._keepDesiredX ? SVGTextMarker.getDesiredX() : coord.x );
              
              SVGTextMarker.show(selectedGroup._wrapper, $.extend(coord, {
                  width   : 2 / selectedGroup._group.getCTM().a,
                  height  : lineHeight * 1.2,
                  desx    : desx
                }));
            }
            
            if (selectedGroup._selectStartCoord) {
              selectedGroup._drawMarking(selectedGroup._group, coord);
            } 
            else if (!e.shiftKey) { // NOT SHIFT
              if ((e.keyCode >= 35 && e.keyCode <= 40) && !(e.ctrlKey || e.metaKey) // (NOT CMD/CTRL) + ARROWS/HOME/END
                  ||
                  ((e.keyCode >= 35 && e.keyCode <= 36) && (e.ctrlKey || e.metaKey)) // (CTRL)HOME-END
                  || 
                  ((e.keyCode >= 37 && e.keyCode <= 40) && e.metaKey)) { // MAC HOME/END-TOP/BOTTOM
                
                $('.marking').remove();
                selectedGroup._selection = null;
                
              } else {
                SVGTextMarker.hide();
              }
                            
            }
                      
          }

        }
        
      });
      
      $(window).bind('keyup.' + this.name, function(e){
        
        var selectedGroup = SVGSelectableGElement.selectedGroup();
        
        if (e.which == 16) { // shift only
          selectedGroup._selectStartCoord = null;
        }
        
      });
      
      // disable standard selection of text within the svg element
      $("svg").disableSelection();
      
      this.once = true;
      
    }
  }
});
