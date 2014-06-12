this.SVGIE ?= {}

svgNS = 'http://www.w3.org/2000/svg'
xlinkNS = 'http://www.w3.org/1999/xlink'

SVGIE.line = (gElement, str) ->
	textElement = document.createElementNS svgNS, "text"
	textElement.setAttributeNS null, "x", "0"
	textElement.setAttributeNS null, "y", "20"
	gElement.appendChild textElement
	lineObject = 
		maxWidth: ->
			100
		,
		next: null, 
		prev: null, 
		textElement: textElement, 
		words: null
	lineObject.words = SVGIE.word lineObject, null, null, str
	lineObject