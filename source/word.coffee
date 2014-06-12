this.SVGIE ?= {}

svgNS = 'http://www.w3.org/2000/svg'
xlinkNS = 'http://www.w3.org/1999/xlink'

# Define how words should be split
wordRegexp = /^(\S+|\s)(.*)/
# Define whitespace. Must be the same definition as in the wordsplit regexp
whitespaceRegexp = /\s/

popWord = (str) ->
	strings = wordRegexp.exec str
	if strings?
		[strings[2], strings[1]]
	else
		null

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

SVGIE.word = (lineObject, prev, next, str) ->
	unless str?
		null
	else if str.length is 0
		null
	else
		result = wordRegexp.exec(str)
		str = result[0]
		word = result[1]
		rest = result[2]
		tspanElement = document.createElementNS svgNS, "tspan"
		lineObject.textElement.insertBefore tspanElement, next

		unless whitespaceRegexp.test word
			wordNode = document.createTextNode word
			tspanElement.appendChild wordNode

		wordObject = Object.create prototype
		wordObject.tspan = tspanElement
		wordObject.prev = prev
		wordObject.next = next

		if rest? 
			wordObject.next = SVGIE.word lineObject, wordObject, wordObject.next, rest
		wordObject

# args: [svgElement][, options]
#this.svgInputElements = (args...) ->

#id="svg" version="1.1" width="100px" height="100px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
