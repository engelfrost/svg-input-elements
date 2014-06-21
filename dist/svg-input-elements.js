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
      if (w !== void 0) {
        this.model.width = w;
        if (this.model.words != null) {
          this.model.words("repos");
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
    val: function(s) {
      var next;
      if (s != null) {
        this.model.s = s;
        this.model.view.textContent = s;
        this.model.width = this.model.view.getBoundingClientRect().width;
        next = this.next();
        if (next != null) {
          next("repos");
        }
      }
      return this.model.s;
    },
    prev: function(prev) {
      if (prev != null) {
        return this.model.prev = prev;
      } else {
        return this.model.prev;
      }
    },
    next: function(next) {
      if (next != null) {
        return this.model.next = next;
      } else {
        return this.model.next;
      }
    },
    dx: function() {
      return this.model.dx;
    },
    line: function() {
      return this.model.line;
    },
    width: function() {
      return this.model.width = this.model.view.getBoundingClientRect().width;
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
    firstInLine: function() {
      var prev;
      prev = this.prev();
      if (prev != null) {
        prev("line") < this.line();
      }
      return true;
    },
    autoWrapped: function() {
      if (this.model.prev == null) {
        return false;
      }
      if (this.model.textarea("width") === null) {
        return false;
      }
      if (!((this.model.prev("dx") + this.model.prev("width") + this.width()) < this.model.textarea("width"))) {
        return this.model.prev("whitespace") !== "linebreak";
      }
    },
    repos: function() {
      var dx, prevLine;
      dx = 0;
      if (this.model.prev != null) {
        if (!this.whitespace() && this.model.prev("whitespace") && this.model.prev("autoWrapped")) {
          dx = 0;
        } else {
          dx = this.model.prev("dx") + this.model.prev("width");
        }
      }
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
        this.model.next("repos");
      }
      return this.model.dx;
    },
    insert: function(s, pos) {
      var next, parsedS, rest, words;
      if (!((pos != null) && pos <= this.model.s.length)) {
        pos = this.model.s.length;
      }
      s = this.model.s.substr(0, pos) + s + this.model.s.substr(pos);
      next = this.model.next;
      parsedS = wordRegexp.exec(s);
      this.model.s = parsedS[1];
      rest = parsedS[2];
      this.val(this.model.s);
      if (rest != null) {
        words = SVGIE.word(this.model.textarea, this.facet, rest);
        if (words != null) {
          this.next(words);
          while (words("next") != null) {
            words = words("next");
          }
          words("next", next);
          if (next != null) {
            next("prev", words);
          }
        }
      }
      return this.val();
    }
  };

  SVGIE.word = function(textarea, prev, s) {
    var controller, next, parsedS, rest;
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
      parsedS = wordRegexp.exec(s);
      s = parsedS[1];
      rest = parsedS[2];
      if (prev != null) {
        next = prev("next");
      }
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
        s: s,
        prev: prev,
        next: next,
        dx: -1,
        line: prev == null ? 1 : prev("line"),
        view: (function() {
          var v;
          v = document.createElementNS(svgNS, "text");
          v.setAttributeNS(spaceNS, "xml:space", "preserve");
          textarea("view").appendChild(v);
          return v;
        })(),
        textarea: textarea,
        width: 0,
        facet: controller.facet
      };
      controller.val(controller.model.s);
      controller.width();
      controller.repos();
      if (next != null) {
        next("prev", controller.facet);
      }
      if (rest != null) {
        controller.model.next = SVGIE.word(textarea, controller.facet, rest);
      }
      return controller.facet;
    }
  };

}).call(this);
