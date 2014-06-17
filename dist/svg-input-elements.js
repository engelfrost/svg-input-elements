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
  var controller, spaceNS, svgNS, whitespaceRegexp, wordRegexp;

  if (this.SVGIE == null) {
    this.SVGIE = {};
  }

  svgNS = 'http://www.w3.org/2000/svg';

  spaceNS = "http://www.w3.org/XML/1998/namespace";

  wordRegexp = /^(\S+|\s)(.*)/;

  whitespaceRegexp = /\s/;

  controller = {
    s: function(model, view) {
      return model.s;
    },
    prev: function(model, view) {
      return model.prev;
    },
    next: function(model, view) {
      return model.next;
    },
    dx: function(model, view) {
      return model.dx;
    },
    line: function(model, view) {
      return model.line;
    },
    width: function(model, view) {
      return model.width;
    },
    textarea: function(model, view) {
      return model.textarea;
    },
    view: function(model, view) {
      return model.view;
    },
    whitespace: function(model, view) {
      return whitespaceRegexp.test(model.s);
    },
    repos: function(model, view) {
      var dx, prevLine;
      dx = model.prev != null ? model.prev.dx + model.prev.width : 0;
      if (model.dx !== dx) {
        prevLine = model.prev != null ? model.prev.line : 1;
        if (model.textarea.width === null || (dx + model.width) < model.textarea.width) {
          model.dx = dx;
          model.line = prevLine;
        } else {
          model.dx = 0;
          model.line = prevLine + 1;
        }
        model.view.setAttributeNS(null, "x", model.dx);
        model.view.setAttributeNS(null, "y", model.line * model.textarea.lineheight);
        if (model.next != null) {
          model.next.repos();
        }
      }
      return model.dx;
    }
  };

  SVGIE.word = function(textarea, prev, s) {
    var model, rest, result, textNode, view;
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
      model = {
        s: result[1],
        prev: prev,
        next: null,
        dx: 0,
        line: !(prev != null ? prev.line : void 0) ? 1 : prev.line,
        view: view,
        textarea: textarea,
        width: (function() {
          return view.getBoundingClientRect().width;
        })()
      };
      controller.repos(model, view);
      if (rest != null) {
        model.next = SVGIE.word(textarea, model, rest);
      }
      return function(method, args) {
        return controller[method](model, view, args);
      };
    }
  };

}).call(this);
