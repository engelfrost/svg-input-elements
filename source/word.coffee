this.SVGIE ?= {}

svgNS = 'http://www.w3.org/2000/svg'
xlinkNS = 'http://www.w3.org/1999/xlink'

# Define how words should be split
wordRegexp = /^(\S+|\s)(.*)/
# Define whitespace. Must be the same definition as in the wordsplit regexp
whitespaceRegexp = /\s/
dx = 0

prototype = 
	dx: (x) ->
		if x? 
			dx = x
		else 
			dx
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
		result = wordRegexp.exec s
		rest = result[2]
		view = document.createElementNS svgNS, "text"


		textarea.view.appendChild view
		# This makes it work...
		# setTimeout -> 
		# 		textarea.view.appendChild view
		# 	,
		# 	0

		word = Object.create prototype
		word.s = result[1]
		word.prev = prev
		word.next = null
		word.line = 1
		word.width = 0
		word.height = 0
		word.view = view
		word.textarea = textarea

		if rest? 
			word.next = SVGIE.word textarea, word, rest
		word

# args: [svgElement][, options]
#this.svgInputElements = (args...) ->

#id="svg" version="1.1" width="100px" height="100px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
