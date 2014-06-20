this.SVGIE ?= {}

svgNS = 'http://www.w3.org/2000/svg'
spaceNS = "http://www.w3.org/XML/1998/namespace"

# Define how words should be split
wordRegexp = /^(\S+|\s)(.*)/
# Define whitespace. Must be the same definition as in the wordsplit regexp
whitespaceRegexp = /\s/

controllerPrototype = 
  val: (s) ->
    if s? 
      #change text
      @model.s = s
      @model.view.textContent = s
      #recalculate width
      @model.width = @model.view.getBoundingClientRect().width
      #repos next word
      next = @next()
      next?.repos()
    @model.s
    # if @model.dx is 0 and @model.s is " "
    #   @model.width = 0
    #   @model.view.textContent = s 
    #   s = ""
    # else
    #   s = @model.s
    # s
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
    @model.width = @model.view.getBoundingClientRect().width
  textarea: ->
    @model.textarea
  view: ->
    @model.view
  whitespace: ->
    whitespaceRegexp.test @model.s
  firstInLine: ->
    prev = @prev()
    if prev? 
      prev("line") < @line()
    true
  autoWrapped: ->
    unless @model.prev? 
    	return false
    unless @model.textarea("width") isnt null
    	return false
    unless (@model.prev("dx") + @model.prev("width") + @width()) < @model.textarea("width")
      return @model.prev("whitespace") isnt "linebreak"
  repos: ->
    dx = 0
    if @model.prev?
      # Ignore a single leading space
      if not @whitespace() and @model.prev("whitespace") and @model.prev("autoWrapped")
        dx = 0
      else 
        dx = @model.prev("dx") + @model.prev("width")
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
      view: do ->
        v = document.createElementNS svgNS, "text"
        v.setAttributeNS spaceNS, "xml:space", "preserve"
        textarea("view").appendChild v
        v
      textarea: textarea
      width: 0
      facet: controller.facet

    controller.val(controller.model.s)
    controller.width()
    controller.repos()

    if rest? 
      controller.model.next = SVGIE.word textarea, controller.facet, rest

    controller.facet
