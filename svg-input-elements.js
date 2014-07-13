(function() {
  var controllerPrototype, svgNS,
    __slice = [].slice;

  if (this.SVGIE == null) {
    this.SVGIE = {};
  }

  svgNS = 'http://www.w3.org/2000/svg';

  controllerPrototype = {
    set: function(word, charNum, cursorPoint) {
      this.model.word = word;
      this.model.charNum = charNum;
      return this.model.view.setAttributeNS(null, "transform", "translate(" + cursorPoint.x + ", " + word("dy") + ")");
    },
    word: function() {
      return this.model.word;
    },
    charNum: function() {
      return this.model.charNum;
    },
    char: function(char) {
      console.log(char);
      return this.model.word("insert", char, this.model.charNum);
    }
  };

  SVGIE.cursor = function(textarea, word, charNum) {
    var controller;
    controller = Object.create(controllerPrototype);
    controller.facet = function() {
      var args, method;
      method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (method === "facet" || method === "model" || (controller[method] == null)) {
        return void 0;
      }
      return controller[method].apply(controller, args);
    };
    controller.model = {
      word: word,
      charNum: charNum,
      view: (function(_this) {
        return function() {
          var v;
          v = document.createElementNS(svgNS, "line");
          v.setAttributeNS(null, "x1", 0);
          v.setAttributeNS(null, "y1", 0);
          v.setAttributeNS(null, "x2", 0);
          v.setAttributeNS(null, "y2", -1 * textarea("lineheight"));
          v.setAttributeNS(null, "stroke-width", 1.5);
          v.setAttributeNS(null, "stroke", "black");
          v.setAttributeNS(null, "transform", "translate(" + (word("dx") + word("width")) + ", " + word("dy") + ")");
          textarea("view").appendChild(v);
          return v;
        };
      })(this)()
    };
    return controller.facet;
  };

}).call(this);

(function() {
  var controllerPrototype, svgNS,
    __slice = [].slice;

  if (this.SVGIE == null) {
    this.SVGIE = {};
  }

  svgNS = 'http://www.w3.org/2000/svg';

  controllerPrototype = {};

  SVGIE.keyboard = function(textarea, cursor) {
    var controller;
    controller = Object.create(controllerPrototype);
    controller.facet = function() {
      var args, method;
      method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (method === "facet" || method === "model" || (controller[method] == null)) {
        return void 0;
      }
      return controller[method].apply(controller, args);
    };
    controller.model = {
      cursor: cursor
    };
    window.addEventListener("keypress", function(e) {
      var s;
      if (e.which != null) {
        s = String.fromCharCode(e.keyCode);
      } else if (e.which !== 0 && e.charCode !== 0) {
        s = String.fromCharCode(e.which);
      } else {
        s = "";
      }
      console.log(e);
      return controller.model.cursor("char", s);
    });
    return controller.facet;
  };

}).call(this);

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
        if (word != null) {
          while (true) {
            s += word("val");
            if (word("isEnd")) {
              break;
            }
            word = word("next");
          }
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
    cursor: function() {
      return this.model.cursor;
    },
    view: function() {
      return this.model.view;
    },
    height: function() {
      return this.model.height;
    },
    svgPoint: function(x, y) {
      var p;
      p = this.model.svg.createSVGPoint();
      p.x = x;
      p.y = y;
      return p;
    }
  };

  SVGIE.textarea = function(el, options, s) {
    var controller, g, svg;
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
    if (el.nodeName === 'g') {
      g = el;
      svg = g.ownerSVGElement;
    } else {
      svg = el;
      g = document.createElementNS(svgNS, "g");
      el.appendChild(g);
    }
    controller = Object.create(controllerPrototype);
    controller.facet = function() {
      var args, method;
      method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (method === "facet" || method === "model" || (controller[method] == null)) {
        return void 0;
      }
      return controller[method].apply(controller, args);
    };
    controller.model = {
      height: options.height == null ? null : options.height,
      width: options.width == null ? null : options.width,
      view: g,
      lineheight: (function() {
        var rect, testTextNode, testWord;
        testWord = document.createElementNS(svgNS, "text");
        g.appendChild(testWord);
        testTextNode = document.createTextNode("SVGIE");
        testWord.appendChild(testTextNode);
        rect = testWord.getBoundingClientRect();
        g.removeChild(testWord);
        return rect.height;
      })(),
      facet: controller.facet,
      svg: svg
    };
    controller.model.words = SVGIE.word(controller.facet, null, s);
    controller.model.cursor = SVGIE.cursor(controller.facet, controller.model.words("prev"), -1);
    controller.model.keyboard = SVGIE.keyboard(controller.facet, controller.model.cursor);
    return controller.facet;
  };

}).call(this);

(function() {
  var controllerPrototype, newlinesRegexp, spaceNS, svgNS, whitespaceRegexp, wordRegexp,
    __slice = [].slice;

  if (this.SVGIE == null) {
    this.SVGIE = {};
  }

  svgNS = 'http://www.w3.org/2000/svg';

  spaceNS = "http://www.w3.org/XML/1998/namespace";

  wordRegexp = /^(\S+|\r\n|\s)((\r|\n|.)*)$/;

  whitespaceRegexp = /\s/;

  newlinesRegexp = /(\r\n|\r|\n)/;

  controllerPrototype = {
    val: function(s) {
      if (s != null) {
        this.model.s = s;
        this.model.view.textContent = s.replace(newlinesRegexp, "").replace(/\t/, "    ");
        this.model.width = this.model.view.getBoundingClientRect().width;
        if (!this.isEnd()) {
          this.model.next("repos");
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
    isBeginning: function() {
      return this.model.beginning;
    },
    isEnd: function() {
      return this.model.next("isBeginning");
    },
    dx: function() {
      return this.model.dx;
    },
    dy: function() {
      return this.model.line * this.model.textarea("lineheight");
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
      var whitespace;
      whitespace = false;
      if (whitespaceRegexp.test(this.model.s)) {
        whitespace = (function() {
          switch (false) {
            case this.model.s !== " ":
              return "space";
            case this.model.s !== "\t":
              return "tab";
            case !newlinesRegexp.test(this.model.s):
              return "newline";
            default:
              return true;
          }
        }).call(this);
      }
      return whitespace;
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
      var dx;
      dx = (function(_this) {
        return function() {
          if (_this.isBeginning()) {
            return 0;
          } else {
            if (!_this.whitespace() && _this.model.prev("whitespace") === "space" && _this.model.prev("autoWrapped")) {
              return 0;
            } else {
              return _this.model.prev("dx") + _this.model.prev("width");
            }
          }
        };
      })(this)();
      if (this.whitespace() !== "newline" && (this.model.textarea("width") === null || this.model.textarea("width") >= (dx + this.model.width))) {
        this.model.dx = dx;
        this.model.line = this.model.prev("line");
      } else {
        this.model.dx = 0;
        this.model.line = this.model.prev("line") + 1;
      }
      this.model.view.setAttributeNS(null, "x", this.model.dx);
      this.model.view.setAttributeNS(null, "y", this.model.line * this.model.textarea("lineheight"));
      if (!this.isEnd()) {
        this.model.next("repos");
      }
      return this.model.dx;
    },
    insert: function(s, pos) {
      var next, parsedS, rest;
      if (!((pos != null) && pos <= this.model.s.length && pos >= 0)) {
        throw "The position '" + pos + "' is not set or out of range";
      }
      s = this.model.s.substr(0, pos) + s + this.model.s.substr(pos);
      next = this.model.next;
      parsedS = wordRegexp.exec(s);
      this.model.s = parsedS[1];
      rest = parsedS[2];
      this.val(this.model.s);
      if (rest != null) {
        SVGIE.word(this.model.textarea, this.facet, rest);
      }
      return this.val();
    }
  };

  SVGIE.word = function(textarea, prev, s) {
    var controller, leftWord, parsedS, rest, rightWord;
    if (typeof textarea !== 'function') {
      throw "Textarea must be a textarea function";
    }
    if (!(prev === null || typeof prev === 'function')) {
      throw "Second argument should be a word controller or null";
    }
    if (typeof s !== 'string') {
      throw "Third argument must be a string";
    }
    if (s.length === 0 && (prev != null)) {
      return null;
    } else if (s.length === 0 && (prev == null)) {
      s = "";
      rest = "";
    } else {
      parsedS = wordRegexp.exec(s);
      s = parsedS[1];
      rest = parsedS[2];
    }
    controller = Object.create(controllerPrototype);
    if (prev != null) {
      leftWord = prev;
    }
    if (prev != null) {
      rightWord = prev("next");
    }
    controller.facet = function() {
      var args, method;
      method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (method === "facet" || method === "model" || (controller[method] == null)) {
        return void 0;
      }
      return controller[method].apply(controller, args);
    };
    controller.model = {
      s: s,
      prev: (function() {
        if (leftWord != null) {
          leftWord("next", controller.facet);
          return leftWord;
        } else {
          return controller.facet;
        }
      })(),
      next: (function() {
        if (rightWord != null) {
          rightWord("prev", controller.facet);
          return rightWord;
        } else {
          return controller.facet;
        }
      })(),
      dx: -1,
      line: prev == null ? 1 : prev("line"),
      view: (function() {
        var v;
        v = document.createElementNS(svgNS, "text");
        v.setAttributeNS(spaceNS, "xml:space", "preserve");
        textarea("view").appendChild(v);
        v.addEventListener("click", function(e) {
          var charNum, charRect, cursor, cursorPoint, p, x, y;
          x = e.clientX - v.ownerSVGElement.offsetLeft;
          y = e.clientY - v.ownerSVGElement.offsetTop;
          p = textarea("svgPoint", x, y);
          charNum = v.getCharNumAtPosition(p);
          charRect = v.getExtentOfChar(charNum);
          if (x < (charRect.x + (charRect.width / 2))) {
            cursorPoint = v.getStartPositionOfChar(charNum);
          } else {
            cursorPoint = v.getEndPositionOfChar(charNum);
            charNum += 1;
          }
          cursor = textarea("cursor");
          return cursor("set", controller.facet, charNum, cursorPoint);
        });
        return v;
      })(),
      textarea: textarea,
      width: 0,
      facet: controller.facet,
      atChar: 0,
      beginning: prev == null
    };
    controller.val(controller.model.s);
    controller.width();
    controller.repos();
    if (rest != null) {
      SVGIE.word(textarea, controller.facet, rest);
    }
    return controller.facet;
  };

}).call(this);
