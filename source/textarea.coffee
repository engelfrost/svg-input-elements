@SVGIE ?= {}

svgNS = 'http://www.w3.org/2000/svg'

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
      @model.words("repos") if @model.words?
    @model.width
  height: ->
    @model.height
  lineheight: ->
    @model.lineheight
  words: ->
    @model.words
  cursor: ->
    @model.cursor
  view: ->
    @model.view
  height: ->
    @model.height
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

  controller = Object.create controllerPrototype
  controller.facet = (method, args...) ->
    if method is "facet" or method is "model" or not controller[method]?
      return undefined
    controller[method].apply controller, args
  controller.model = 
    height: unless options.height? then null else options.height
    width: unless options.width? then null else options.width
    view: g
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
  controller.model.keyboard = SVGIE.keyboard controller.facet, controller.model.cursor

  controller.facet