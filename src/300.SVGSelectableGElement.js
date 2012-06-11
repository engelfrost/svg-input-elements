/** 
 *  SVGSelection
**/

function SVGSelectableGElement(){}

// "public static"
$.extend(SVGSelectableGElement, {
  _once: false,
  
  _instances: [],
  
  setup: function( instance ){
    
    // do all times
    
    // add instance to list of instances
    if ($.inArray(instance, this._instances)==-1)
      this._instances.push( instance );
    
    if (!this._once){
      
      // do only once
      
      var that = this;
      
      $(window).bind('mousedown.' + this.name, function(e){
        that._mousedown(e);
      });
       
      $(window).bind('mouseup.' + this.name, function(e){
        that._mouseup(e);
      });
      
      $(window).bind('mousemove.' + this.name, function(e){
        that._mousemove(e);
      });
      
      $(window).bind('click.' + this.name, function(e){
        that._click(e);
      });
      
      $(window).bind('doubleclick.' + this.name, function(e){
        that._dblclick(e);
      });
      
      $(window).bind('tripleclick.' + this.name, function(e){
        that._tplclick(e);
      });
      
      $(window).bind('contextmenu.' + this.name, function(e){
        that._contextmenu(e);
      });
      
      this._once = true;
    }
  },
  
  deselectAll: function(){
    
    // clear all selected boxes
    select = $('#select');
    if (select.length) {
      classes = (s = select.parent().attr('class')) ? s.replace('selected', '') : ''; 
      select.parent().attr('class', classes.trim());
      select.remove();  
      $('#textbox-marker').css({display: 'none'});
    }
    
    // call down to each instance
    $.each(this._instances, function(i,el){
      el._deselect();
    });
    
  },
  
  selectedGroup: function(){
    var selectedGroup = null;
    $.each(this._instances, function(i,el){
      if (el.selected) {
        selectedGroup = el;
      }
    });
    return selectedGroup;
  },
  
  destroy: function( instance ){
  
    this._instances = $.grep(this._instances, function(e){
      return e!==instance;
    });
    
    /*
if (this._instances.length == 0) {
      $(window).unbind('mouseup.selection');
    }
*/
  },
  
  _mouseup: function(e){
  
  	var g;
  
    if ($.inArray(e.target.constructor, types)!=-1){
  
      var g = this._getGroupTarget(e.target);
      
      $.each(this._instances, function(i,el){
      
        if (el.selected) {
          
          e.target = g;
	        el.trigger(e);
	        
	        el.mouseup(g,e);
        }
      });
    } else {
      var g = this.selectedGroup();
      if (g) {
        
        e.target = g._group;
        g.trigger(e);
        
        g.mouseup(g._group,e);
      }
    }
  },
  
  _mousedown: function(e){
    
    // if event started from any of the approved element types
    if ($.inArray(e.target.constructor, types)!=-1){
      
      // find the parent grouping element to our approved element
      var g = this._getGroupTarget(e.target);
      
      if (g) { // selection occured
      
      	// pass along the event to outsiders
        e.target = g;
        g._selectable.trigger(e);
      
        if (!g._selected) {
          $(g).parent().append(g);
          g.select(g,e);
        }
        
      }
      else {
        SVGSelectableGElement.deselectAll();
      }
    
    }
    else {
      SVGSelectableGElement.deselectAll();
    }
    
    $.each(this._instances, function(i,el){
      el.mousedown(g,e);
    })
    
  },
  
  _mousemove: function(e){
  
    if ($.inArray(e.target.constructor, types)!=-1){
  
      var g = this._getGroupTarget(e.target);
      
      $.each(this._instances, function(i,el){
      
        if (el.selected && el._group == g) {
          el.mousemove(g,e);
          
          e.target = g;
  	    	g._selectable.trigger(e);
        }
        else {
          // when another g element that is not selected is below the mouse
          g2 = SVGSelectableGElement.selectedGroup();
          if (g2) {
            e.target = g2;
            g2.mousemove(g2._group,e);
            
            e.target = g2._group;
  	    		g2.trigger(e);
          }
        }
      });
      
    } else {
      g = SVGSelectableGElement.selectedGroup();
      if (g) {
        g.mousemove(g._group,e);
        
        e.target = g._group;
  	    g.trigger(e);
      }
    }
  },
  
  _click: function(e){
  
    if ($.inArray(e.target.constructor, types)!=-1){
  
      var g = this._getGroupTarget(e.target);
      
      $.each(this._instances, function(i,el){
      
        el.click(g,e);
      });
    }
  },
  
  _dblclick: function(e){
  
    if ($.inArray(e.target.constructor, types)!=-1){
  
      var g = this._getGroupTarget(e.target);
      
      $.each(this._instances, function(i,el){
      
        el.dblclick(g,e);
      }); 
    }
  },
  
  _tplclick: function(e){
  
    if ($.inArray(e.target.constructor, types)!=-1){
  
      var g = this._getGroupTarget(e.target);
      
      $.each(this._instances, function(i,el){
      
        el.tplclick(g,e);
      });
    }
  },
  
  _contextmenu: function(e) {
    if ($.inArray(e.target.constructor, types)!=-1){
  
      var g = this._getGroupTarget(e.target);
      
      $.each(this._instances, function(i,el){
      
        el.contextmenu(g,e);
      });
    }
  },
  
  _getGroupTarget: function(i){
    // find the parent grouping element to our approved element
    
    var g;
    while( g == null){
      if (i.constructor === SVGGElement && $(i).is('.selectable')) {
        g = i;
      }
      else if (i.parentNode) {
        i = i.parentNode;
      }
      else {
        break;
      }
    }
    
    return g;
  }
});



/* ------- PUBLIC INSTANCE ------- */

$.extend(SVGSelectableGElement.prototype, {
  _group: null,
  selected: false,
  _class: 'selectable',
  _events: null,
  _parent: null,
  _destroyed: false,
  
  bind: function() {
    this._events.bind.apply(this._events, arguments);
  },
  unbind: function() {
    this._events.unbind.apply(this._events, arguments);
  },
  trigger: function() {
    this._events.trigger.apply(this._events, arguments);
  },
  
  init: function() {
    this._events = this._eventmanager = $('<input>'),
         
    // bind to events
    SVGSelectableGElement.setup( this );
    
  },
  
  destroy: function() {
  
    SVGSelectableGElement.destroy( this );
    this._destroyed = true;
    
  },
  
  isSelected: function() {
  	return this.selected;
  },
  
  appendTo: function(parent) {
  	this._parent = parent;
  	//this._render();
  },
  
  _render: function() {
    var that = this; 
    if (this._wrapper && !this._destroyed) {

      var classes;

      // create g element
      if (this._group) {
        
        this._group.setAttribute('transform','translate(-9999,-9999)');
        
        classes = this._group.getAttribute('class');
        this._group.removeAttribute('class');
        
        destroyElem(this._group);
        
      } 
      else {
        classes = this._class;
      }
      
      this._group = this._wrapper.group(arguments[0], arguments[1], arguments[2]);
      (classes ? this._group.setAttribute('class', classes) : 0); // add old classes if there are any
      
      // extend g element with select capability
      
      $.extend(this._group, {
        _wrapper: this._wrapper,
        _selectable: this,
        _selected: this.selected,
        
        select: function(e){
        
          if (!this._selected)
            SVGSelectableGElement.deselectAll();
          
          this._selected = true;
          
          // set the class of the element to selected, so we can find it later
          this.setAttribute('class', this.getAttribute('class').trim() + ' selected');
          
          this._render();
            
          this._selectable._select(this, e);
                      
        },
        
        reload: function() {
          this._render();
        },
        
        _render: function() {
          if (this._selected && !that._destroyed) {
            // add a select highlighter inside the grouping element
//             console.log("300", $(this)[0]);
//             console.log($(this));
//             stroke = num(StyleSheet.get('rect#select', 'stroke-width', $(this).parent()[0]));
            background = $(this).find("rect.background")[0].getBBox();
//             console.log(background);
            this._wrapper.rect(this, 0, 0, background.width, background.height, {id: 'select'});
          }
          
        },
      });
      
      return this._group; 
    }
  },
  
  _select: function(g,e){
    this.selected = true;
    this.select(g,e); // pass along the event
  },
  
  _deselect: function(){
    this.selected = false;
    this._group._selected = false;
    this.deselect(); // pass along the event
  },
  
  _delete: function(){
  	this.trigger('delete');
  },
  
  remove: function(){
  	$(this._group).remove();
  	this.destroy();
  },
  
  setValue: function(value) {
  	this._value = value;
  },
  
  // extension point (hooks)
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
