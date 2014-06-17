this.SVGIE ?= {}

svgNS = 'http://www.w3.org/2000/svg'
spaceNS = "http://www.w3.org/XML/1998/namespace"

# Define how words should be split
wordRegexp = /^(\S+|\s)(.*)/
# Define whitespace. Must be the same definition as in the wordsplit regexp
whitespaceRegexp = /\s/

controller = 
	s: (model) ->
		return model.s
	prev: (model) ->
		model.prev
	next: (model) ->
		model.next
	dx: (model) ->
		model.dx
	line: (model) ->
		model.line
	width: (model) ->
		model.width
	textarea: (model) ->
		model.textarea
	view: (model) ->
		model.view
	whitespace: (model) ->
		whitespaceRegexp.test model.s
	repos: (model) ->
		dx = if model.prev? then model.prev("dx") + model.prev("width") else 0
		unless model.dx is dx
			prevLine = if model.prev? then model.prev("line") else 1
			if model.textarea("width") is null or (dx + model.width) < model.textarea("width")
				# This will break if word is wider than textarea
				model.dx = dx
				model.line = prevLine
			else 
				model.dx = 0
				model.line = prevLine + 1
			model.view.setAttributeNS null, "x", model.dx
			model.view.setAttributeNS null, "y", model.line * model.textarea("lineheight")
			if model.next? 
				model.next.repos()
		model.dx


SVGIE.word = (textarea, prev, s) ->
	unless textarea?
		throw "Textarea must be a textarea function"
	unless arguments.length is 3
		throw "word() takes three arguments"
	unless prev is null or typeof prev is 'function'
		throw "Second argument should be a word function or null"
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
		textarea("view").appendChild view

		facet = (method, args) ->
			controller[method] model, view, args

		model =
			s: result[1]
			prev: prev
			next: null
			dx: 0
			line: unless prev? "line" then 1 else prev "line"
			view: view
			textarea: textarea
			width: do ->
				view.getBoundingClientRect().width
			facet: facet

		controller.repos(model)

		if rest? 
			model.next = SVGIE.word textarea, facet, rest

		facet
