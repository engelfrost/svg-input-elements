this.SVGIE ?= {}

svgNS = 'http://www.w3.org/2000/svg'

controller =
	val: (model, str) ->
		if str?
			while model.view.firstChild
				model.view.removeChild model.view.firstChild
			model.words = SVGIE.word model.facet, null, str
		else 
			model.facet.toString()
	toString: (model) ->
		s = ""
		word = model.words
		while word?
			s += word "s" 
			word = word "next"
		s
	width: (model, w) ->
		unless w is undefined
			model.width = w
			model.words?.repos()
		model.width
	height: (model) ->
		model.height
	lineheight: (model) ->
		model.lineheight
	words: (model) ->
		model.words
	view: (model) ->
		model.view
	height: (model) ->
		model.height
			

SVGIE.textarea = (el, options, s) ->
	unless el? and (el.nodeName is "svg" or el.nodeName is "g")
		throw "Missing first argument, no <svg> or <g> passed"

	facet = (method, args) ->
		controller[method] model, args

	rect = null
	model = 
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
		facet: facet
	model.words = SVGIE.word facet, null, s

	facet