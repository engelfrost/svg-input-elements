this.SVGIE ?= {}

svgNS = 'http://www.w3.org/2000/svg'
spaceNS = "http://www.w3.org/XML/1998/namespace"
xlinkNS = 'http://www.w3.org/1999/xlink'

# Define how words should be split
wordRegexp = /^(\S+|\s)(.*)/
# Define whitespace. Must be the same definition as in the wordsplit regexp
whitespaceRegexp = /\s/

prototype = 
	dx: (x) ->
		if @prev? 
			dx = @prev.dx() + @prev.width
			if @textarea.width is null or (dx + @width) < @textarea.width
				@view.setAttributeNS null, "x", dx
				dx
			else 
				@view.setAttributeNS null, "x", 0
				@line = @prev.line + 1
				0
		else 
			@view.setAttributeNS null, "x", 0
			0
	whitespace: ->
		self = this
		whitespaceRegexp.test self.s

SVGIE.word = (textarea, prev, s) ->
	unless textarea?
		throw "Textarea must be a textarea object"
	unless arguments.length is 3
		throw "word() takes three arguments"
	unless prev? or typeof prev is 'object'
		throw "Second argument should be a word or null"
	unless typeof s is 'string'
		throw "expected third parameter to be a string"

	if s.length is 0
		null
	else
		dxValue = 0
		result = wordRegexp.exec s
		rest = result[2]
		view = document.createElementNS svgNS, "text"
		view.setAttributeNS spaceNS, "xml:space", 'preserve'
		textNode = document.createTextNode result[1]
		view.appendChild textNode
		textarea.view.appendChild view

		word = Object.create prototype
		word.s = result[1]
		word.prev = prev
		word.next = null
		word.line = unless prev?.line then 1 else prev.line
		word.view = view
		word.textarea = textarea
		word.width = do ->
			view.getBoundingClientRect().width

		# Attributes for <text>
		view.setAttributeNS null, "x", word.dx()
		console.log textarea.lineheight?, word.textarea.lineheight, word.line
		view.setAttributeNS null, "y", word.textarea.lineheight * word.line

		if rest? 
			word.next = SVGIE.word textarea, word, rest
		word

# args: [svgElement][, options]
#this.svgInputElements = (args...) ->

#id="svg" version="1.1" width="100px" height="100px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
