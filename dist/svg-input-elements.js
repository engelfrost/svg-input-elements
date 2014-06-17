(function() {
  var getArguments, prototype, svgNS,
    __slice = [].slice;

  if (this.SVGIE == null) {
    this.SVGIE = {};
  }

  svgNS = 'http://www.w3.org/2000/svg';

  getArguments = function(args) {
    var arg, i, options, s, _fn, _i, _len;
    options = {};
    s = "";
    _fn = function(arg, i) {
      if (typeof arg === 'object') {
        return options = arg;
      } else if ((args[i + 1] == null) && typeof arg === 'string') {
        return s = arg;
      } else {
        throw "Invalid argument";
      }
    };
    for (i = _i = 0, _len = args.length; _i < _len; i = ++_i) {
      arg = args[i];
      _fn(arg, i);
    }
    return [options, s];
  };

  prototype = {
    val: function(str) {
      var self;
      if (str != null) {
        self = this;
        while (this.view.firstChild) {
          this.view.removeChild(this.view.firstChild);
        }
        return this.words = SVGIE.word(self, null, str);
      } else {
        return this.toString();
      }
    },
    toString: function() {
      var s, word;
      s = "";
      word = textarea.words;
      while (word != null) {
        s += word.s;
        word = word.next;
      }
      return s;
    }
  };

  SVGIE.textarea = function() {
    var args, el, facet, options, rect, s, testTextNode, testWord, textarea, _ref;
    el = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (!((el != null) && (el.nodeName === "svg" || el.nodeName === "g"))) {
      throw "Missing first argument, no <svg> or <g> passed";
    }
    _ref = getArguments(args), options = _ref[0], s = _ref[1];
    facet = {
      width: function(w) {
        var _ref1;
        if (w === void 0) {
          textarea.width = w;
          if ((_ref1 = textarea.words) != null) {
            _ref1.repos();
          }
          return w;
        } else {
          return textarea.width;
        }
      }
    };
    textarea = Object.create(prototype);
    textarea.facet = facet;
    textarea.height = options.height != null ? options.height : null;
    textarea.width = options.width != null ? options.width : null;
    if (el.nodeName === 'g') {
      textarea.view = el;
    } else {
      textarea.view = document.createElementNS(svgNS, "g");
      el.appendChild(textarea.view);
    }
    testWord = document.createElementNS(svgNS, "text");
    textarea.view.appendChild(testWord);
    testTextNode = document.createTextNode("SVGIE");
    testWord.appendChild(testTextNode);
    rect = testWord.getBoundingClientRect();
    textarea.view.removeChild(testWord);
    textarea.lineheight = rect.height;
    textarea.words = SVGIE.word(textarea, null, s);
    return textarea;
  };

}).call(this);

(function() {
  var prototype, spaceNS, svgNS, whitespaceRegexp, wordRegexp;

  if (this.SVGIE == null) {
    this.SVGIE = {};
  }

  svgNS = 'http://www.w3.org/2000/svg';

  spaceNS = "http://www.w3.org/XML/1998/namespace";

  wordRegexp = /^(\S+|\s)(.*)/;

  whitespaceRegexp = /\s/;

  prototype = {
    whitespace: function() {
      var self;
      self = this;
      return whitespaceRegexp.test(self.s);
    },
    repos: function() {
      var dx, prevLine;
      dx = this.prev != null ? this.prev.dx + this.prev.width : 0;
      if (this.dx !== dx) {
        prevLine = this.prev != null ? this.prev.line : 1;
        if (this.textarea.width === null || (dx + this.width) < this.textarea.width) {
          this.dx = dx;
          this.line = prevLine;
        } else {
          this.dx = 0;
          this.line = prevLine + 1;
        }
        this.view.setAttributeNS(null, "x", this.dx);
        this.view.setAttributeNS(null, "y", this.line * this.textarea.lineheight);
        if (this.next != null) {
          this.next.repos();
        }
      }
      return this.dx;
    }
  };

  SVGIE.word = function(textarea, prev, s) {
    var rest, result, textNode, view, word;
    if (textarea == null) {
      throw "Textarea must be a textarea object";
    }
    if (arguments.length !== 3) {
      throw "word() takes three arguments";
    }
    if (!((prev != null) || typeof prev === 'object')) {
      throw "Second argument should be a word or null";
    }
    if (typeof s !== 'string') {
      throw "expected third parameter to be a string";
    }
    if (s.length === 0) {
      return null;
    } else {
      result = wordRegexp.exec(s);
      rest = result[2];
      view = document.createElementNS(svgNS, "text");
      view.setAttributeNS(spaceNS, "xml:space", 'preserve');
      textNode = document.createTextNode(result[1]);
      view.appendChild(textNode);
      textarea.view.appendChild(view);
      word = Object.create(prototype);
      word.s = result[1];
      word.prev = prev;
      word.next = null;
      word.dx = 0;
      word.line = !(prev != null ? prev.line : void 0) ? 1 : prev.line;
      word.view = view;
      word.textarea = textarea;
      word.width = (function() {
        return view.getBoundingClientRect().width;
      })();
      word.repos();
      if (rest != null) {
        word.next = SVGIE.word(textarea, word, rest);
      }
      return word;
    }
  };

}).call(this);
