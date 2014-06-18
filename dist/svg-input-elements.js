(function() {
  var controller, svgNS;

  if (this.SVGIE == null) {
    this.SVGIE = {};
  }

  svgNS = 'http://www.w3.org/2000/svg';

  controller = {
    val: function(model, str) {
      if (str != null) {
        while (model.view.firstChild) {
          model.view.removeChild(model.view.firstChild);
        }
        return model.words = SVGIE.word(model.facet, null, str);
      } else {
        return model.facet.toString();
      }
    },
    toString: function(model) {
      var s, word;
      s = "";
      word = model.words;
      while (word != null) {
        s += word("s");
        word = word("next");
      }
      return s;
    },
    width: function(model, w) {
      var _ref;
      if (w !== void 0) {
        model.width = w;
        if ((_ref = model.words) != null) {
          _ref.repos();
        }
      }
      return model.width;
    },
    height: function(model) {
      return model.height;
    },
    lineheight: function(model) {
      return model.lineheight;
    },
    words: function(model) {
      return model.words;
    },
    view: function(model) {
      return model.view;
    },
    height: function(model) {
      return model.height;
    }
  };

  SVGIE.textarea = function(el, options, s) {
    var facet, model, rect;
    if (!((el != null) && (el.nodeName === "svg" || el.nodeName === "g"))) {
      throw "Missing first argument, no <svg> or <g> passed";
    }
    facet = function(method, args) {
      return controller[method](model, args);
    };
    rect = null;
    model = {
      height: options.height == null ? null : options.height,
      width: options.width == null ? null : options.width,
      view: (function() {
        var testTextNode, testWord, view;
        if (el.nodeName === 'g') {
          view = el;
        } else {
          view = document.createElementNS(svgNS, "g");
          el.appendChild(view);
        }
        testWord = document.createElementNS(svgNS, "text");
        view.appendChild(testWord);
        testTextNode = document.createTextNode("SVGIE");
        testWord.appendChild(testTextNode);
        rect = testWord.getBoundingClientRect();
        view.removeChild(testWord);
        return view;
      })(),
      lineheight: rect.height,
      facet: facet
    };
    model.words = SVGIE.word(facet, null, s);
    return facet;
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
    s: function(model) {
      return model.s;
    },
    prev: function(model) {
      return model.prev;
    },
    next: function(model) {
      return model.next;
    },
    dx: function(model) {
      return model.dx;
    },
    line: function(model) {
      return model.line;
    },
    width: function(model) {
      return model.width;
    },
    textarea: function(model) {
      return model.textarea;
    },
    view: function(model) {
      return model.view;
    },
    whitespace: function(model) {
      return whitespaceRegexp.test(model.s);
    },
    repos: function(model) {
      var dx, prevLine;
      dx = model.prev != null ? model.prev("dx") + model.prev("width") : 0;
      if (model.dx !== dx) {
        prevLine = model.prev != null ? model.prev("line") : 1;
        if (model.textarea("width") === null || (dx + model.width) < model.textarea("width")) {
          model.dx = dx;
          model.line = prevLine;
        } else {
          model.dx = 0;
          model.line = prevLine + 1;
        }
        model.view.setAttributeNS(null, "x", model.dx);
        model.view.setAttributeNS(null, "y", model.line * model.textarea("lineheight"));
        if (model.next != null) {
          model.next.repos();
        }
      }
      return model.dx;
    }
  };

  SVGIE.word = function(textarea, prev, s) {
    var facet, model, rest, result, textNode, view;
    if (textarea == null) {
      throw "Textarea must be a textarea function";
    }
    if (arguments.length !== 3) {
      throw "word() takes three arguments";
    }
    if (!(prev === null || typeof prev === 'function')) {
      throw "Second argument should be a word function or null";
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
      textarea("view").appendChild(view);
      facet = function(method, args) {
        return controller[method](model, view, args);
      };
      model = {
        s: result[1],
        prev: prev,
        next: null,
        dx: -1,
        line: !(typeof prev === "function" ? prev("line") : void 0) ? 1 : prev("line"),
        view: view,
        textarea: textarea,
        width: (function() {
          return view.getBoundingClientRect().width;
        })(),
        facet: facet
      };
      controller.repos(model);
      if (rest != null) {
        model.next = SVGIE.word(textarea, facet, rest);
      }
      return facet;
    }
  };

}).call(this);
