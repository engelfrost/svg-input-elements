(function() {
  var svgNS, xlinkNS;

  if (this.SVGIE == null) {
    this.SVGIE = {};
  }

  svgNS = 'http://www.w3.org/2000/svg';

  xlinkNS = 'http://www.w3.org/1999/xlink';

  SVGIE.line = function(gElement, str) {
    var lineObject, textElement;
    textElement = document.createElementNS(svgNS, "text");
    textElement.setAttributeNS(null, "x", "0");
    textElement.setAttributeNS(null, "y", "20");
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
    lineObject.words = SVGIE.word(lineObject, null, null, str);
    return lineObject;
  };

}).call(this);

(function() {
  var defaultHeight, defaultWidth, getArguments, options, prototype, svgElement, svgNS, xlinkNS,
    __slice = [].slice;

  if (this.SVGIE == null) {
    this.SVGIE = {};
  }

  svgNS = 'http://www.w3.org/2000/svg';

  xlinkNS = 'http://www.w3.org/1999/xlink';

  defaultWidth = 100;

  defaultHeight = 100;

  svgElement = null;

  options = null;

  getArguments = function(args) {
    var arg, i, _fn, _i, _len;
    _fn = function(arg, i) {
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
    if (svgElement == null) {
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
    return [svgElement, options];
  };

  prototype = {
    parse: function(str) {
      return this.lines = SVGIE.line(this.gElement, str);
    }
  };

  SVGIE.textarea = function() {
    var args, model, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _ref = getArguments(args), svgElement = _ref[0], options = _ref[1];
    model = Object.create(prototype);
    model.lines = null;
    model.gElement = (function() {
      var g;
      g = document.createElementNS(svgNS, "g");
      svgElement.appendChild(g);
      return g;
    })();
    return model;
  };

}).call(this);

(function() {
  var popWord, prototype, svgNS, whitespaceRegexp, wordRegexp, xlinkNS;

  if (this.SVGIE == null) {
    this.SVGIE = {};
  }

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

  prototype = {
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

  SVGIE.word = function(lineObject, prev, next, str) {
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
      wordObject = Object.create(prototype);
      wordObject.tspan = tspanElement;
      wordObject.prev = prev;
      wordObject.next = next;
      if (rest != null) {
        wordObject.next = SVGIE.word(lineObject, wordObject, wordObject.next, rest);
      }
      return wordObject;
    }
  };

}).call(this);
