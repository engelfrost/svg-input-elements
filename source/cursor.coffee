this.SVGIE ?= {}

svgNS = 'http://www.w3.org/2000/svg'

controllerPrototype = 
	set: (word, char) ->
		@model.word = word
		@model.char = char
		@model.view.setAttributeNS null, "transform", "translate(" + word("dx") + ", " + word("dy") + ")"
	word: ->
		@model.word
	char: ->
		@model.char

SVGIE.cursor = (textarea, word, char) ->
  controller = Object.create controllerPrototype
  controller.facet = (method, args...) ->
    if method is "facet" or method is "model" or not controller[method]?
      return undefined
    controller[method].apply controller, args
  controller.model = 
  	word: word
  	char: char
  	view: do =>
      v = document.createElementNS svgNS, "line"
      v.setAttributeNS null, "x1", 0
      v.setAttributeNS null, "y1", 0
      v.setAttributeNS null, "x2", 0
      v.setAttributeNS null, "y2", -1 * textarea("lineheight")
      v.setAttributeNS null, "stroke-width", 2
      v.setAttributeNS null, "stroke", "black"
      v.setAttributeNS null, "transform", "translate(" + word("dx") + ", " + word("dy") + ")"
      textarea("view").appendChild v
      v
  controller.facet

