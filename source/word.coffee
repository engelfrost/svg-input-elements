this.SVGIE ?= {}

svgNS = 'http://www.w3.org/2000/svg'
spaceNS = "http://www.w3.org/XML/1998/namespace"

# Define how words should be split
wordRegexp = /^(\S+|\s)(.*)/
# Define whitespace. Must be the same definition as in the wordsplit regexp
whitespaceRegexp = /\s/

controllerPrototype = 
  val: ->
    if @model.dx is 0 and @model.s is " "
      @model.width = 0
      s = ""
    else
      s = @model.s
    @model.view.textContent = s 
    s
    #@model.s
  prev: ->
    @model.prev
  next: ->
    @model.next
  dx: ->
    @model.dx
  line: ->
    @model.line
  width: ->
    @model.width
  textarea: ->
    @model.textarea
  view: ->
    @model.view
  whitespace: ->
    whitespaceRegexp.test @model.s
  repos: ->
    dx = if @model.prev? then @model.prev("dx") + @model.prev("width") else 0
    unless @model.dx is dx
      prevLine = if @model.prev? then @model.prev("line") else 1
      if @model.textarea("width") is null or (dx + @model.width) < @model.textarea("width")
        # This will break if word is wider than textarea
        @model.dx = dx
        @model.line = prevLine
      else 
        @model.dx = 0
        @model.line = prevLine + 1
      @model.view.setAttributeNS null, "x", @model.dx
      @model.view.setAttributeNS null, "y", @model.line * @model.textarea("lineheight")
      if @model.next? 
        @model.next.repos()
    @model.dx

SVGIE.word = (textarea, prev, s) ->
  unless typeof textarea is 'function'
    throw "Textarea must be a textarea function"
  unless prev is null or typeof prev is 'function'
    throw "Second argument should be a word controller or null"
  unless typeof s is 'string'
    throw "Third argument must be a string"

  if s.length is 0
    null
  else
    result = wordRegexp.exec s
    rest = result[2]
    view = do ->
    	v = document.createElementNS svgNS, "text"
	    v.setAttributeNS spaceNS, "xml:space", "preserve"
	    textNode = document.createTextNode result[1]
	    v.appendChild textNode
	    textarea("view").appendChild v
	    v

    controller = Object.create controllerPrototype

    controller.facet = (method, args...) ->
	    if method is "facet" or method is "model" or !@[method]?
	      undefined
	    controller[method].apply controller, args
    controller.model =
      s: result[1]
      prev: prev
      next: null
      dx: -1
      line: unless prev? then 1 else prev "line"
      view: view
      textarea: textarea
      width: do ->
        view.getBoundingClientRect().width
      facet: controller.facet

    controller.repos()
    console.log controller.dx(), controller.val()

    if rest? 
      controller.model.next = SVGIE.word textarea, controller.facet, rest

    controller.facet
