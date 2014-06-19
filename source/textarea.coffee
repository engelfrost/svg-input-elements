@SVGIE ?= {}

svgNS = 'http://www.w3.org/2000/svg'

controllerPrototype =
	val: (s) ->
		if s?
			while @model.view.firstChild
				@model.view.removeChild @model.view.firstChild
			@model.words = SVGIE.word @facet, null, s
		else 
			s = ""
			word = @model.words
			while word?
				s += word "val" 
				word = word "next"
			s
	width: (w) ->
		unless w is undefined
			@model.width = w
			@model.words?.repos()
		@model.width
	height: ->
		@model.height
	lineheight: ->
		@model.lineheight
	words: ->
		@model.words
	view: ->
		@model.view
	height: ->
		@model.height
			

SVGIE.textarea = (el, options, s) ->
	unless el? and (el.nodeName is "svg" or el.nodeName is "g")
		throw "Missing first argument, no <svg> or <g> passed"
	unless typeof options is 'object'
		if options is undefined
			options = {}
		else
			throw "Options object must be of type object"
	unless s? 
		s = ""

	rect = null

	controller = Object.create controllerPrototype
	controller.facet = (method, args...) ->
		if method is "facet" or method is "model" or !@[method]?
			undefined
		controller[method].apply controller, args

	controller.model = 
		height: unless options.height? then null else options.height
		width: unless options.width? then null else options.width
		view: do ->
			if el.nodeName is 'g'
				view = el
			else
				view = document.createElementNS svgNS, "g"
				el.appendChild view
			# Calculate lineheight
			testWord = document.createElementNS svgNS, "text"
			view.appendChild testWord
			testTextNode = document.createTextNode "SVGIE"
			testWord.appendChild testTextNode
			rect = testWord.getBoundingClientRect()
			view.removeChild testWord
			view
		lineheight: rect.height
		facet: controller.facet

	# controller.facet needs controller.model to be defined
	controller.model.words = SVGIE.word controller.facet, null, s

	controller.facet