this.SVGIE ?= {}

svgNS = 'http://www.w3.org/2000/svg'

controllerPrototype = 
	set: (word, charNum, cursorPoint) ->
		@model.word = word
		@model.charNum = charNum
		@model.view.setAttributeNS null, "transform", "translate(" + cursorPoint.x + ", " + word("dy") + ")"
	word: ->
		@model.word
	charNum: ->
		@model.charNum
	char: (char) ->
		console.log char
		@model.word("insert", char, @model.charNum)

SVGIE.cursor = (textarea, word, charNum) ->
  controller = Object.create controllerPrototype
  controller.facet = (method, args...) ->
    if method is "facet" or method is "model" or not controller[method]?
      return undefined
    controller[method].apply controller, args
  controller.model = 
  	word: word
  	charNum: charNum
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

