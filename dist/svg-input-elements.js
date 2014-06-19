(function() {
  var controllerPrototype, svgNS,
    __slice = [].slice;

  if (this.SVGIE == null) {
    this.SVGIE = {};
  }

  svgNS = 'http://www.w3.org/2000/svg';

  controllerPrototype = {
    val: function(s) {
      var word;
      if (s != null) {
        while (this.model.view.firstChild) {
          this.model.view.removeChild(this.model.view.firstChild);
        }
        return this.model.words = SVGIE.word(this.facet, null, s);
      } else {
        s = "";
        word = this.model.words;
        while (word != null) {
          s += word("val");
          word = word("next");
        }
        return s;
      }
    },
    width: function(w) {
      var _ref;
      if (w !== void 0) {
        this.model.width = w;
        if ((_ref = this.model.words) != null) {
          _ref.repos();
        }
      }
      return this.model.width;
    },
    height: function() {
      return this.model.height;
    },
    lineheight: function() {
      return this.model.lineheight;
    },
    words: function() {
      return this.model.words;
    },
    view: function() {
      return this.model.view;
    },
    height: function() {
      return this.model.height;
    }
  };

  SVGIE.textarea = function(el, options, s) {
    var controller, rect;
    if (!((el != null) && (el.nodeName === "svg" || el.nodeName === "g"))) {
      throw "Missing first argument, no <svg> or <g> passed";
    }
    if (typeof options !== 'object') {
      if (options === void 0) {
        options = {};
      } else {
        throw "Options object must be of type object";
      }
    }
    if (s == null) {
      s = "";
    }
    rect = null;
    controller = Object.create(controllerPrototype);
    controller.facet = function() {
      var args, method;
      method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (method === "facet" || method === "model" || (this[method] == null)) {
        void 0;
      }
      return controller[method].apply(controller, args);
    };
    controller.model = {
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
      facet: controller.facet
    };
    controller.model.words = SVGIE.word(controller.facet, null, s);
    return controller.facet;
  };

}).call(this);

(function() {
  var controllerPrototype, spaceNS, svgNS, whitespaceRegexp, wordRegexp,
    __slice = [].slice;

  if (this.SVGIE == null) {
    this.SVGIE = {};
  }

  svgNS = 'http://www.w3.org/2000/svg';

  spaceNS = "http://www.w3.org/XML/1998/namespace";

  wordRegexp = /^(\S+|\s)(.*)/;

  whitespaceRegexp = /\s/;

  controllerPrototype = {
    val: function() {
      var s;
      if (this.dx() === 0 && this.model.s === " ") {
        s = "";
      } else {
        s = this.model.s;
      }
      this.model.view.textContent = s;
      return s;
    },
    prev: function() {
      return this.model.prev;
    },
    next: function() {
      return this.model.next;
    },
    dx: function() {
      return this.model.dx;
    },
    line: function() {
      return this.model.line;
    },
    width: function() {
      return this.model.width;
    },
    textarea: function() {
      return this.model.textarea;
    },
    view: function() {
      return this.model.view;
    },
    whitespace: function() {
      return whitespaceRegexp.test(this.model.s);
    },
    repos: function() {
      var dx, prevLine;
      dx = this.model.prev != null ? this.model.prev("dx") + this.model.prev("width") : 0;
      if (this.model.dx !== dx) {
        prevLine = this.model.prev != null ? this.model.prev("line") : 1;
        if (this.model.textarea("width") === null || (dx + this.model.width) < this.model.textarea("width")) {
          this.model.dx = dx;
          this.model.line = prevLine;
        } else {
          this.model.dx = 0;
          this.model.line = prevLine + 1;
        }
        this.model.view.setAttributeNS(null, "x", this.model.dx);
        this.model.view.setAttributeNS(null, "y", this.model.line * this.model.textarea("lineheight"));
        if (this.model.next != null) {
          this.model.next.repos();
        }
      }
      return this.model.dx;
    }
  };

  SVGIE.word = function(textarea, prev, s) {
    var controller, rest, result, view;
    if (typeof textarea !== 'function') {
      throw "Textarea must be a textarea function";
    }
    if (!(prev === null || typeof prev === 'function')) {
      throw "Second argument should be a word controller or null";
    }
    if (typeof s !== 'string') {
      throw "Third argument must be a string";
    }
    if (s.length === 0) {
      return null;
    } else {
      result = wordRegexp.exec(s);
      rest = result[2];
      view = (function() {
        var textNode, v;
        v = document.createElementNS(svgNS, "text");
        v.setAttributeNS(spaceNS, "xml:space", "preserve");
        textNode = document.createTextNode(result[1]);
        v.appendChild(textNode);
        textarea("view").appendChild(v);
        return v;
      })();
      controller = Object.create(controllerPrototype);
      controller.facet = function() {
        var args, method;
        method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (method === "facet" || method === "model" || (this[method] == null)) {
          void 0;
        }
        return controller[method].apply(controller, args);
      };
      controller.model = {
        s: result[1],
        prev: prev,
        next: null,
        dx: -1,
        line: prev == null ? 1 : prev("line"),
        view: view,
        textarea: textarea,
        width: (function() {
          return view.getBoundingClientRect().width;
        })(),
        facet: controller.facet
      };
      controller.repos();
      console.log(controller.dx(), controller.val());
      if (rest != null) {
        controller.model.next = SVGIE.word(textarea, controller.facet, rest);
      }
      return controller.facet;
    }
  };

}).call(this);
