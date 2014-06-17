this.SVGIE ?= {}

svgNS = 'http://www.w3.org/2000/svg'
spaceNS = "http://www.w3.org/XML/1998/namespace"

# Define how words should be split
wordRegexp = /^(\S+|\s)(.*)/
# Define whitespace. Must be the same definition as in the wordsplit regexp
whitespaceRegexp = /\s/

prototype = 
	whitespace: ->
		self = this
		whitespaceRegexp.test self.s
	repos: ->
		dx = if @prev? then @prev.dx + @prev.width else 0
		unless @dx is dx
			prevLine = if @prev? then @prev.line else 1
			if @textarea.width is null or (dx + @width) < @textarea.width
				# This will break if word is wider than textarea
				@dx = dx
				@line = prevLine
			else 
				@dx = 0
				@line = prevLine + 1
			@view.setAttributeNS null, "x", @dx
			@view.setAttributeNS null, "y", @line * @textarea.lineheight
			if @next? 
				@next.repos()
		@dx


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
		word.dx = 0
		word.line = unless prev?.line then 1 else prev.line
		word.view = view
		word.textarea = textarea
		word.width = do ->
			view.getBoundingClientRect().width

		word.repos()

		if rest? 
			word.next = SVGIE.word textarea, word, rest
		word
