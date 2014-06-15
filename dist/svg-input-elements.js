(function() {
  var getArguments, prototype, svgNS, xlinkNS,
    __slice = [].slice;

  if (this.SVGIE == null) {
    this.SVGIE = {};
  }

  svgNS = 'http://www.w3.org/2000/svg';

  xlinkNS = 'http://www.w3.org/1999/xlink';

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
      self = this;
      return this.words = SVGIE.word(self, null, str);
    }
  };

  SVGIE.textarea = function() {
    var args, el, options, s, textarea, _ref;
    el = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (!((el != null) && (el.nodeName === "svg" || el.nodeName === "g"))) {
      throw "Missing first argument, no <svg> or <g> passed";
    }
    _ref = getArguments(args), options = _ref[0], s = _ref[1];
    textarea = Object.create(prototype);
    textarea.height = options.height != null ? options.height : null;
    textarea.width = options.width != null ? options.width : null;
    if (el.nodeName === 'g') {
      textarea.view = el;
    } else {
      textarea.view = document.createElementNS(svgNS, "g");
      el.appendChild(textarea.view);
    }
    textarea.words = SVGIE.word(textarea, null, s);
    return textarea;
  };

}).call(this);

(function() {
  var dxValue, prototype, svgNS, whitespaceRegexp, wordRegexp, xlinkNS;

  if (this.SVGIE == null) {
    this.SVGIE = {};
  }

  svgNS = 'http://www.w3.org/2000/svg';

  xlinkNS = 'http://www.w3.org/1999/xlink';

  wordRegexp = /^(\S+|\s)(.*)/;

  whitespaceRegexp = /\s/;

  dxValue = 0;

  prototype = {
    dx: function(x) {
      var self;
      self = this;
      if (x != null) {
        if ((self.textarea.width != null) && (self.width + x) > self.textarea.width) {
          self.line = self.line + 1;
          return dxValue = 0;
        } else {
          return dxValue = x;
        }
      } else {
        return dxValue;
      }
    },
    whitespace: function() {
      var self;
      self = this;
      return whitespaceRegexp.test(self.s);
    }
  };

  SVGIE.word = function(textarea, prev, s) {
    var rest, result, view, word;
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
      textarea.view.appendChild(view);
      word = Object.create(prototype);
      word.s = result[1];
      word.prev = prev;
      word.next = null;
      word.line = 1;
      word.width = 0;
      word.height = 0;
      word.view = view;
      word.textarea = textarea;
      if (rest != null) {
        word.next = SVGIE.word(textarea, word, rest);
      }
      return word;
    }
  };

}).call(this);
