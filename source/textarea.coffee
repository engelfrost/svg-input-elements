this.SVGIE ?= {}

svgNS = 'http://www.w3.org/2000/svg'
xlinkNS = 'http://www.w3.org/1999/xlink'


# Parse the arguments
getArguments = (args) ->
	options = {}
	s = ""

	for arg, i in args
		do (arg, i) ->
			if typeof arg is 'object'
				options = arg
			else if not args[i + 1]? and typeof arg is 'string'
				s = arg
			else 
				throw "Invalid argument"
	[options, s]

prototype =
	val: (str) ->
		self = this
		this.words = SVGIE.word self, null, str

SVGIE.textarea = (el, args...) ->
	unless el? and (el.nodeName is "svg" or el.nodeName is "g")
		throw "Missing first argument, no <svg> or <g> passed"

	[options, s] = getArguments args

	textarea = Object.create prototype
	textarea.height = if options.height? then options.height else null
	textarea.width = if options.width? then options.width else null
	if el.nodeName is 'g'
		textarea.view = el
	else
		textarea.view = document.createElementNS svgNS, "g"
		el.appendChild textarea.view

	# Calculate lineheight
	testWord = document.createElementNS svgNS, "text"
	textarea.view.appendChild testWord
	#while !textarea.view.contains testWord
	#	wait = true
	testTextNode = document.createTextNode "SVGIE"
	testWord.appendChild testTextNode
	#while !testWord.contains(testTextNode)
	#	wait = true
	rect = testWord.getBoundingClientRect() 
	#while rect.height is 0
	#	rect = testWord.getBoundingClientRect() 
	textarea.view.removeChild testWord

	textarea.lineheight = rect.height

	textarea.words = SVGIE.word textarea, null, s
	textarea