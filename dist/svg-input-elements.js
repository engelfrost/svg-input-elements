(function() {
  var popWord, svgNS, whitespaceRegexp, wordRegexp, xlinkNS,
    __slice = [].slice;

  svgNS = 'http://www.w3.org/2000/svg';

  xlinkNS = 'http://www.w3.org/1999/xlink';

  wordRegexp = /^(\S+|\s)(.*)/;

  whitespaceRegexp = /\s/;

  popWord = function(str) {
    var strings;
    strings = wordRegexp.exec(str);
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
    lineObject.words = svgieWord(lineObject, null, null, str);
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
      var rest, result, tspanElement, word, wordNode, wordObject;
      if (str == null) {
        return null;
      } else if (str.length === 0) {
        return null;
      } else {
        result = wordRegexp.exec(str);
        str = result[0];
        word = result[1];
        rest = result[2];
        tspanElement = document.createElementNS(svgNS, "tspan");
        lineObject.textElement.insertBefore(tspanElement, next);
        if (!whitespaceRegexp.test(word)) {
          wordNode = document.createTextNode(word);
          tspanElement.appendChild(wordNode);
        }
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
    var arg, args, defaultHeight, defaultWidth, i, options, svgElement, svgieTextarea, svgieTextareaPrototype, _fn, _i, _len;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    defaultWidth = 100;
    defaultHeight = 100;
    options = null;
    _fn = function(arg, i) {
      var svgElement;
      if (i === 0 && arg.nodeName === "svg") {
        return svgElement = arg;
      } else if ((arg != null) && (args[i + 1] == null)) {
        options = arg;
        if (options.width == null) {
          throw "Missing width property in settings object";
        }
        if (options.height == null) {
          throw "Missing height property in settings object";
        }
      } else {
        throw "Invalid argument";
      }
    };
    for (i = _i = 0, _len = args.length; _i < _len; i = ++_i) {
      arg = args[i];
      _fn(arg, i);
    }
    if (typeof svgElement === "undefined" || svgElement === null) {
      svgElement = document.createElementNS(svgNS, "svg");
      svgElement.setAttributeNS(null, "version", "1.1");
      svgElement.setAttributeNS(null, "width", String(defaultWidth) + "px");
      svgElement.setAttributeNS(null, "height", String(defaultHeight) + "px");
    }
    if (options == null) {
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
