@SVGIE ?= {}

svgNS = 'http://www.w3.org/2000/svg'

focusedTextarea = null

# Keyboard events
window.addEventListener "keypress", (e) ->
  if focusedTextarea? 
    if e.which? 
      s = String.fromCharCode e.keyCode
    else if e.which isnt 0 and e.charCode isnt 0
      s = String.fromCharCode e.which 
    else 
      s = ""
    word = focusedTextarea "cursor", "word"
    char = focusedTextarea "cursor", "char"
    word "insert", s, char
    char += 1
    focusedTextarea "cursor", word, char

controllerPrototype =
  val: (s) ->
    if s?
      while @model.view.firstChild
        @model.view.removeChild @model.view.firstChild
      @model.words = SVGIE.word @facet, null, s
    else 
      s = ""
      word = @model.words
      if word? then loop
        s += word "val" 
        break if word "isEnd"
        word = word "next"
      s
  width: (w) ->
    unless w is undefined # allow setting width to null
      @model.width = w 
      @model.background.setAttributeNS null, "width", w
      @model.words("repos") if @model.words?
    @model.width
  height: (h) ->
    unless h is undefined
      @model.height = h
      @model.background.setAttributeNS null, "height", h
    @model.height
  focus: (textarea) ->
    focusedTextarea = textarea
    @facet is focusedTextarea
  focused: ->
    @facet is focusedTextarea
  lineheight: ->
    @model.lineheight
  words: ->
    @model.words
  cursor: ->
    @model.cursor
  insert: (s) ->
    word = @facet("cursor")("word")
    pos  = @facet("cursor")("pos")
    word "insert", s, pos
  view: ->
    @model.view
  svgPoint: (x, y) ->
    p = @model.svg.createSVGPoint()
    p.x = x
    p.y = y
    p

SVGIE.textarea = (el, options, s) ->
  unless el? and (el.nodeName is "svg" or el.nodeName is "g")
    throw "Missing first argument, no <svg> or <g> passed"
  unless typeof options is 'object'
    if options is undefined
      options = {}
    else
      throw "Options object must be of type object"
  unless s? 
    s = ""

  # Set the group element and svg element 
  if el.nodeName is 'g'
    g = el
    svg = g.ownerSVGElement
  else
    svg = el
    g = document.createElementNS svgNS, "g"
    el.appendChild g

  # Make sure a width is set
  unless options.width? 
    options.width = svg.getBoundingClientRect().width

  background = document.createElementNS svgNS, "rect"
  background.setAttributeNS null, "x", 0
  background.setAttributeNS null, "y", 0
  background.setAttributeNS null, "width", options.width
  background.setAttributeNS null, "fill", "white"
  # set height later, since we only support "auto-height" at the moment
  g.appendChild background

  controller = Object.create controllerPrototype
  controller.facet = (method, args...) ->
    if method is "facet" or method is "model" or not controller[method]?
      return undefined
    controller[method].apply controller, args
  controller.model = 
    height: unless options.height? then null else options.height
    width: unless options.width? then null else options.width
    view: g
    background: background
    lineheight: do ->
      testWord = document.createElementNS svgNS, "text"
      g.appendChild testWord
      testTextNode = document.createTextNode "SVGIE"
      testWord.appendChild testTextNode
      rect = testWord.getBoundingClientRect()
      g.removeChild testWord
      rect.height
    facet: controller.facet
    svg: svg
  # Watch out with dependencies! controller.facet needs controller.model to be defined
  controller.model.words = SVGIE.word controller.facet, null, s
  controller.model.cursor = SVGIE.cursor controller.facet, controller.model.words("prev"), -1
  #controller.model.keyboard = SVGIE.keyboard controller.facet, controller.model.cursor

  # Set this textarea to focused when the background is clicked
  background.addEventListener "click", (e) ->
    focusedTextarea = controller.facet
    word = controller.facet "words"
    loop
      break if word "isEnd"
      break if (word("next")("dy") - focusedTextarea("lineheight")) > e.offsetY
      word = word "next"

    pos = word("wordLength") - 1
    cursorPoint = word("view").getEndPositionOfChar pos
    focusedTextarea("cursor") "set", word, pos, cursorPoint

  controller.facet