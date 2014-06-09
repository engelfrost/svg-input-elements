(function() {
  var popWord, regexp, svgNS, whitespaceRegexp, xlinkNS,
    __slice = [].slice;

  svgNS = 'http://www.w3.org/2000/svg';

  xlinkNS = 'http://www.w3.org/1999/xlink';

  regexp = /^(\S+|\s)(.*)/;

  whitespaceRegexp = /\s/;

  popWord = function(str) {
    var strings;
    strings = regexp.exec(str);
    if (strings != null) {
      return [strings[2], strings[1]];
    } else {
      return null;
    }
  };

  this.svgieLine = function(gElement, str) {
    var lineObject, textElement;
    textElement = document.createElementNS(svgNS, "text");
    gElement.appendChild(textElement);
    lineObject = {
      maxWidth: function() {
        return 100;
      },
      next: null,
      prev: null,
      textElement: textElement,
      words: null
    };
    return lineObject;
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
    return function(lineObject, prev, next, str) {
      var rest, tspanElement, word, wordObject, _ref;
      if (str == null) {
        return null;
      } else if (str.length === 0) {
        return null;
      } else {
        word = null;
        rest = null;
        _ref = regexp.exec(str) != null, str = _ref[0], word = _ref[1], rest = _ref[2];
        tspanElement = document.createElementNS(svgNS, "tspan");
        tspanElement.textContent = word;
        lineObject.textElement.insertBefore(next, tspanElement);
        wordObject = Object.create(svgieWordPrototype);
        wordObject.tspan = tspanElement;
        wordObject.prev = prev;
        wordObject.next = next;
        if (rest != null) {
          wordObject.next = svgieWord(lineObject, wordObject, wordObject.next, rest);
        }
        return wordObject;
      }
    };
  })();

  this.svgInputElements = function() {
    var arg, args, defaultHeight, defaultWidth, i, options, svgElement, svgieTextarea, svgieTextareaPrototype, _i, _len;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    defaultWidth = 100;
    defaultHeight = 100;
    options = null;
    svgElement = null;
    for (i = _i = 0, _len = args.length; _i < _len; i = ++_i) {
      arg = args[i];
      (function(arg, i) {
        if (i === 0 && arg.nodeName === "svg") {
          return svgElement = arg;
        } else if (i < 2 && options === null && typeof arg === "object") {
          return options = arg;
        }
      });
    }
    if (svgElement == null) {
      svgElement = document.createElementNS(svgNS, "svg");
      svgElement.setAttributeNS(null, "version", "1.1");
      svgElement.setAttributeNS(null, "width", String(defaultWidth) + "px");
      svgElement.setAttributeNS(null, "height", String(defaultHeight) + "px");
    } else {
      options = {
        width: defaultWidth,
        height: defaultHeight
      };
    }
    svgieTextareaPrototype = (function() {
      var prototype;
      return prototype = {
        parse: function(str) {
          return this.lines = svgieLine(this.gElement, str);
        }
      };
    })();
    svgieTextarea = Object.create(svgieTextareaPrototype);
    svgieTextarea.lines = null;
    svgieTextarea.gElement = (function() {
      var g;
      g = document.createElementNS(svgNS, "g");
      svgElement.appendChild(g);
      return g;
    })();
    return svgieTextarea;
  };

}).call(this);
