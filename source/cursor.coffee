this.SVGIE ?= {}

svgNS = 'http://www.w3.org/2000/svg'

controllerPrototype = 
  set: (word, pos, cursorPoint) ->
    @model.word = word
    @model.pos = pos
    @model.point = cursorPoint if cursorPoint?
    @model.view.setAttributeNS null, "transform", "translate(" + cursorPoint.x + ", " + word("dy") + ")"
    @facet
  word: ->
    @model.word
    @facet
  pos: ->
    @model.pos
    @facet
  # char: (char) ->
  #   console.log char
  #   @model.word("insert", char, @model.pos)

SVGIE.cursor = (textarea, word, pos) ->
  controller = Object.create controllerPrototype
  controller.facet = (method, args...) ->
    if method is "facet" or method is "model" or not controller[method]?
      return undefined
    controller[method].apply controller, args
  controller.model = 
    word: word
    pos: pos
    point: null
    view: do =>
      v = document.createElementNS svgNS, "line"
      v.setAttributeNS null, "x1", 0
      v.setAttributeNS null, "y1", 0
      v.setAttributeNS null, "x2", 0
      v.setAttributeNS null, "y2", -1 * textarea("lineheight")
      v.setAttributeNS null, "stroke-width", 1.5
      v.setAttributeNS null, "stroke", "black"
      v.setAttributeNS null, "transform", "translate(" + (word("dx") + word("width")) + ", " + word("dy") + ")"
      textarea("view").appendChild v
      v
  controller.facet

