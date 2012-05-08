/** 
 * 	SVGSelection
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
		if (select) {
			select.parent().attr('class', 'textbox');
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
	
		this._instances = $.grep(_instances, function(e){
			return e!==instance;
		});
		
		if (this._instances.length == 0) {
			$(window).unbind('mouseup.selection');
		}
	},
	
	_mouseup: function(e){
	
		if ($.inArray(e.target.constructor, types)!=-1){
	
			var g = this._getGroupTarget(e);
			
			$.each(this._instances, function(i,el){
			
				if (el.selected)
					el.mouseup(g,e);
			});
		} else {
			g = this.selectedGroup();
			if (g)
				g.mouseup(g,e);
		}
	},
	
	_mousedown: function(e){
		
		// if event started from any of the approved element types
		if ($.inArray(e.target.constructor, types)!=-1){
			
			// find the parent grouping element to our approved element
			var g = this._getGroupTarget(e);
			
			if (g) { // selection occured
			
				if (!g._selected)
					g.select(e);
				
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
	
			var g = this._getGroupTarget(e);
			
			$.each(this._instances, function(i,el){
			
				if (el.selected)
					el.mousemove(g,e);
			});
		} else {
			g = this.selectedGroup();
			if (g)
				g.mousemove(g,e);
		}
	},
	
	_click: function(e){
	
		if ($.inArray(e.target.constructor, types)!=-1){
	
			var g = this._getGroupTarget(e);
			
			$.each(this._instances, function(i,el){
			
				el.click(g,e);
			});
		}
	},
	
	_dblclick: function(e){
	
		if ($.inArray(e.target.constructor, types)!=-1){
	
			var g = this._getGroupTarget(e);
			
			$.each(this._instances, function(i,el){
			
				el.dblclick(g,e);
			});	
		}
	},
	
	_tplclick: function(e){
	
		if ($.inArray(e.target.constructor, types)!=-1){
	
			var g = this._getGroupTarget(e);
			
			$.each(this._instances, function(i,el){
			
				el.tplclick(g,e);
			});
		}
	},
	
	_contextmenu: function(e) {
		if ($.inArray(e.target.constructor, types)!=-1){
	
			var g = this._getGroupTarget(e);
			
			$.each(this._instances, function(i,el){
			
				el.contextmenu(g,e);
			});
		}
	},
	
	_getGroupTarget: function(e){
		// find the parent grouping element to our approved element
		
		var g, i = e.target;
		while( g == null){
			if (i.constructor === SVGGElement)
				g = i 
			else if (i.parentNode) {
				i = i.parentNode;
			}
			else
				break;
		}
		
		return g;
	}
});



/* ------- PUBLIC INSTANCE ------- */

$.extend(SVGSelectableGElement.prototype, {
	_group: null,
	selected: false,
	
	init: function() {
	
		// bind to events
		SVGSelectableGElement.setup( this );
		
	},
	
	destroy: function() {
	
		SVGSelectableGElement.destroy( this );
		
	},
	
	_render: function() {
    var that = this; 
		if (this._wrapper) {

			var classes = '';

			// create g element
			if (this._group) {
				
				this._group.setAttribute('transform','translate(-9999,-9999)');
				
				destroyElem(this._group);
				
				classes = this._group.getAttribute('class');
				this._group.removeAttribute('class');
				
      } 
      
	    this._group = this._wrapper.group(arguments[0]);
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
          this.setAttribute('class', 'textbox selected');
          
          this._render();
            
          this._selectable._select(this, e);
                      
        },
        
        reload: function() {
        	this._render();
        },
        
        _render: function() {
        	if (this._selected) {
        		// add a select highlighter inside the grouping element
	          this._wrapper.rect(this, 0, 0, this.width(), this.height(), {id: 'select'});
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
