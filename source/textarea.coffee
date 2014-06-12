this.SVGIE ?= {}

svgNS = 'http://www.w3.org/2000/svg'
xlinkNS = 'http://www.w3.org/1999/xlink'

defaultWidth = 100
defaultHeight = 100
svgElement = null
options = null

# Parse the arguments
getArguments = (args) ->
	for arg, i in args
		do (arg, i) ->
			# Only the first argument can be the SVG element
			if i == 0 and arg.nodeName is "svg"
				svgElement = arg
			# Options is the last argument
			else if arg? and not args[i + 1]?
				options = arg
				unless options.width?
					throw "Missing width property in settings object"
				unless options.height?
					throw "Missing height property in settings object"
			else 
				throw "Invalid argument"
	unless svgElement?
		svgElement = document.createElementNS svgNS, "svg"
		svgElement.setAttributeNS null, "version", "1.1"
		svgElement.setAttributeNS null, "width", String(defaultWidth) + "px"
		svgElement.setAttributeNS null, "height", String(defaultHeight) + "px"
	unless options? 
		options = 
			width: defaultWidth
			height: defaultHeight
	[svgElement, options]

prototype =
	parse: (str) ->
		this.lines = SVGIE.line this.gElement, str

SVGIE.textarea = (args...) ->
	[svgElement, options] = getArguments args

	model = Object.create prototype
	model.lines = null
	model.gElement = do ->
		g = document.createElementNS svgNS, "g"
		svgElement.appendChild g
		g
	model