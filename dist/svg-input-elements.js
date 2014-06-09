(function() {
  var svgNS, whitespaceRegexp, xlinkNS,
    __slice = [].slice;

  svgNS = 'http://www.w3.org/2000/svg';

  xlinkNS = 'http://www.w3.org/1999/xlink';

  whitespaceRegexp = /\s/;

  this.svgieLine = function() {
    var lineObject;
    return lineObject = {
      maxWidth: function() {
        return 0;
      },
      wordChain: null,
      textElement: null
    };
  };

  this.svgieWord = (function() {
    var svgieWordPrototype;
    svgieWordPrototype = (function() {
      var prototype;
      return prototype = {
        chars: function() {
          if (this.tspan != null) {
            return this.tspan.textContent.length;
          } else {
            return 0;
          }
        },
        width: function() {
          if (this.tspan != null) {
            return this.tspan.scrollWidth;
          } else {
            return 0;
          }
        },
        whitespace: function() {
          if (this.tspan != null) {
            return whitespaceRegexp.test(this.tspan.textContent);
          } else {
            return null;
          }
        }
      };
    })();
    return function(str) {
      var tspanElement, wordObject;
      tspanElement = document.createElementNS(svgNS, "tspan");
      tspanElement.textContent = str;
      wordObject = Object.create(svgieWordPrototype);
      wordObject.tspan = tspanElement;
      wordObject.next = null;
      wordObject.prev = null;
      return wordObject;
    };
  })();

  this.svgInputElements = function() {
    var arg, args, defaultHeight, defaultWidth, i, options, regexp, svgElement, svgieTextarea, svgieTextareaPrototype, _i, _len;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    defaultWidth = "100";
    defaultHeight = "100";
    for (i = _i = 0, _len = args.length; _i < _len; i = ++_i) {
      arg = args[i];
      (function(arg, i) {
        var options, svgElement;
        if (i === 0 && arg.nodeName === "svg") {
          return svgElement = arg;
        } else if (i <= 1 && (typeof options === "undefined" || options === null) && typeof arg === "object") {
          return options = arg;
        }
      });
    }
    if (typeof svgElement === "undefined" || svgElement === null) {
      svgElement = document.createElementNS(svgNS, "svg");
      svgElement.setAttributeNS(null, "version", "1.1");
      svgElement.setAttributeNS(null, "width", defaultWidth + "px");
      svgElement.setAttributeNS(null, "height", defaultHeight + "px");
    }
    if (typeof options === "undefined" || options === null) {
      options = {
        width: defaultWidth,
        height: defaultHeight
      };
    }
    regexp = /^(\S+|\s)(.*)/;
    svgieTextareaPrototype = (function() {
      var popWord, prototype;
      popWord = function(str, textElement) {
        var strings;
        strings = regexp.exec(str);
        if (strings != null) {
          textElement.appendChild(svgieWord(str).tspan);
          return popWord(strings[2], textElement);
        }
      };
      return prototype = {
        parse: function(str) {
          var textElement;
          textElement = document.createElementNS(svgNS, "text");
          this.gElement.appendChild(textElement);
          return popWord(str, textElement);
        }
      };
    })();
    svgieTextarea = Object.create(svgieTextareaPrototype);
    svgieTextarea.gElement = (function() {
      var g;
      g = document.createElementNS(svgNS, "g");
      svgElement.appendChild(g);
      return g;
    })();
    return svgieTextarea;
  };

}).call(this);
