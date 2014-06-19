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
  var controller, spaceNS, svgNS, whitespaceRegexp, wordRegexp,
    __slice = [].slice;

  if (this.SVGIE == null) {
    this.SVGIE = {};
  }

  svgNS = 'http://www.w3.org/2000/svg';

  spaceNS = "http://www.w3.org/XML/1998/namespace";

  wordRegexp = /^(\S+|\s)(.*)/;

  whitespaceRegexp = /\s/;

  controller = {
    val: function(model) {
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
    var controllerFacet, model, rest, result, textNode, view;
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
      view = document.createElementNS(svgNS, "text");
      view.setAttributeNS(spaceNS, "xml:space", 'preserve');
      textNode = document.createTextNode(result[1]);
      view.appendChild(textNode);
      textarea("view").appendChild(view);
      controllerFacet = function() {
        var args, method;
        method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        args = Array.prototype.slice.call(args, 0);
        args.unshift(model);
        return controller[method].apply(controller[method], args);
      };
      model = {
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
        facet: controllerFacet
      };
      controller.repos(model);
      if (rest != null) {
        model.next = SVGIE.word(textarea, controllerFacet, rest);
      }
      return controllerFacet;
    }
  };

}).call(this);
