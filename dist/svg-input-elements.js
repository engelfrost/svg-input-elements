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
        result = wordRegexp.exec(str) != null;
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
    var args, defaultHeight, defaultWidth, options, svgElement, svgieTextarea, svgieTextareaPrototype;
    svgElement = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    defaultWidth = 100;
    defaultHeight = 100;
    options = null;
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
    svgieTextareaPrototype = (function() {
      var prototype;
      return prototype = {
        parse: function(str) {
          console.log(str);
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
