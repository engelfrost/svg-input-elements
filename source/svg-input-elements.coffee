svgNS = 'http://www.w3.org/2000/svg'
xlinkNS = 'http://www.w3.org/1999/xlink'


# Define how words should be split
regexp = /^(\S+|\s)(.*)/
# Define whitespace. Must be the same definition as in the wordsplit regexp
whitespaceRegexp = /\s/

popWord = (str) ->
	strings = regexp.exec str
	if strings?
		[strings[2], strings[1]]
	else
		null

this.svgieLine = (gElement, str) ->
	textElement = document.createElementNS svgNS, "text"
	gElement.appendChild textElement
	lineObject = 
		maxWidth: ->
			100
		,
		next: null, 
		prev: null, 
		textElement: textElement, 
		words: null
	#lineObject.words = svgieWord lineObject, null, null, str
	lineObject

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
	(lineObject, prev, next, str) ->
		if !str?
			null
		else if str.length is 0
			null
		else
			word = null
			rest = null
			[str, word, rest] = regexp.exec(str)?
			#if word?
			tspanElement = document.createElementNS svgNS, "tspan"
			tspanElement.textContent = word
			lineObject.textElement.insertBefore next, tspanElement

			wordObject = Object.create svgieWordPrototype
			wordObject.tspan = tspanElement
			wordObject.prev = prev
			wordObject.next = next

			if rest? 
				wordObject.next = svgieWord lineObject, wordObject, wordObject.next, rest
			wordObject

# args: [svgElement][, options]
this.svgInputElements = (args...) ->
	defaultWidth = 100
	defaultHeight = 100
	options = null
	svgElement = null

	for arg, i in args
		(arg, i) ->
			# Only the first argument can be the SVG element
			if i == 0 and arg.nodeName is "svg"
				svgElement = arg
			# Options can be the first or second argument
			else if i < 2 and options is null and typeof arg is "object"
				options = arg

	unless svgElement?
		svgElement = document.createElementNS svgNS, "svg"
		svgElement.setAttributeNS null, "version", "1.1"
		svgElement.setAttributeNS null, "width", String(defaultWidth) + "px"
		svgElement.setAttributeNS null, "height", String(defaultHeight) + "px"

	# if options? 
	# 	unless options.width?
	# 		throw "Missing width property in settings object"
	# 	unless options.height?
	# 		throw "Missing height property in settings object"
	else
		options = 
			width: defaultWidth
			height: defaultHeight

	svgieTextareaPrototype = do ->
		prototype = 
			parse: (str) ->
				this.lines = svgieLine(this.gElement, str)
				#textElement = document.createElementNS svgNS, "text"
				#popWord str, textElement

	svgieTextarea = Object.create svgieTextareaPrototype
	svgieTextarea.lines = null
	svgieTextarea.gElement = do ->
		g = document.createElementNS svgNS, "g"
		svgElement.appendChild g
		g

	svgieTextarea

#id="svg" version="1.1" width="100px" height="100px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
