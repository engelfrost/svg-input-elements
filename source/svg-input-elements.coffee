svgNS = 'http://www.w3.org/2000/svg'
xlinkNS = 'http://www.w3.org/1999/xlink'

whitespaceRegexp = /\s/

this.svgieLine = (element) ->
	gElement = if element.nodeName == "text" then element.parentNode else element
	lineObject = 
		maxWidth: ->
			0
		,
		wordChain: null, 
		textElement: null

this.svgieWord = do -> 
	svgieWordPrototype = do ->
		prototype = 
			chars: ->
				if this.tspan? 
					this.tspan.textContent.length
				else 
					0
			,
			width: ->
				if this.tspan? 
					this.tspan.scrollWidth
				else 
					0
			,
			whitespace: ->
				if this.tspan? 
					whitespaceRegexp.test this.tspan.textContent
				else 
					null
	(str) -> 
		tspanElement = document.createElementNS svgNS, "tspan"
		tspanElement.textContent = str
		wordObject = Object.create svgieWordPrototype
		wordObject.tspan = tspanElement
		wordObject.next = null
		wordObject.prev = null
		wordObject

# args: [svgElement][, options]
this.svgInputElements = (args...) ->
	defaultWidth = "100"
	defaultHeight = "100"

	for arg, i in args
		(arg, i) ->
			# Only the first argument can be the SVG element
			if i == 0 and arg.nodeName == "svg"
				svgElement = arg
			# Options can be the first or second argument
			else if i <= 1 and !options? and typeof arg == "object"
				options = arg

	unless svgElement?
		svgElement = document.createElementNS svgNS, "svg"
		svgElement.setAttributeNS null, "version", "1.1"
		svgElement.setAttributeNS null, "width", defaultWidth + "px"
		svgElement.setAttributeNS null, "height", defaultHeight + "px"

	unless options?
		options = 
			width: defaultWidth
			height: defaultHeight

	# Define how words should be split
	regexp = /^(\S+|\s)(.*)/

	svgieTextareaPrototype = do ->
		popWord = (str, textElement) ->
			strings = regexp.exec(str)
			if strings?
				textElement.appendChild svgieWord(str).tspan
				popWord strings[2], textElement
		prototype = 
			parse: (str) ->
				textElement = document.createElementNS svgNS, "text"
				this.gElement.appendChild textElement
				popWord str, textElement

	svgieTextarea = Object.create svgieTextareaPrototype
	svgieTextarea.gElement = do ->
		g = document.createElementNS svgNS, "g"
		svgElement.appendChild g
		g

	svgieTextarea

#id="svg" version="1.1" width="100px" height="100px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
