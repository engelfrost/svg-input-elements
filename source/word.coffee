this.SVGIE ?= {}

svgNS = 'http://www.w3.org/2000/svg'
spaceNS = "http://www.w3.org/XML/1998/namespace"

# Define how words should be split
wordRegexp = /^(\S+|\r\n|\s)((\r|\n|.)*)$/
# Define whitespace. Must be the same definition as in the wordsplit regexp
whitespaceRegexp = /\s/
newlinesRegexp = /(\r\n|\r|\n)/

controllerPrototype = 
  val: (s) ->
    if s? 
      #change text
      @model.s = s
      @model.view.textContent = s
        .replace(newlinesRegexp, "")
        .replace(/\t/, "    ")
      #recalculate width
      @model.width = @model.view.getBoundingClientRect().width
      #repos next word
      @next() "repos" if @next()?
    @model.s
  prev: (prev) ->
    if prev? 
      @model.prev = prev
    else 
      @model.prev
  next: (next) ->
    if next? 
      @model.next = next
    else
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
    whitespace = no
    if whitespaceRegexp.test @model.s
      whitespace = switch 
        when @model.s is " " then "space"
        when @model.s is "\t" then "tab"
        when newlinesRegexp.test @model.s then "newline" #what about \r and \r\n?
        else true
    whitespace
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
    # Get new dx value
    dx = do =>
      if @model.prev?
        # Ignore a single leading space
        if not @whitespace() and @model.prev("whitespace") is "space" and @model.prev("autoWrapped")
          0
        else 
          @model.prev("dx") + @model.prev("width")
      else 
        0
    prevWordLine = if @model.prev? then @model.prev("line") else 1
    # Can we stay on the same line? 
    if @whitespace() isnt "newline" and (@model.textarea("width") is null or @model.textarea("width") >= (dx + @model.width))
      # This will break if word is wider than textarea
      @model.dx = dx
      @model.line = prevWordLine
    else 
      @model.dx = 0
      @model.line = prevWordLine + 1
    @model.view.setAttributeNS null, "x", @model.dx
    @model.view.setAttributeNS null, "y", @model.line * @model.textarea("lineheight")
    if @model.next? 
      @model.next("repos")
    @model.dx
  insert: (s, pos) ->
    unless pos? and pos <= @model.s.length
      pos = @model.s.length
    s = @model.s.substr(0, pos) + s + @model.s.substr(pos)
    next = @model.next
    parsedS = wordRegexp.exec s
    @model.s = parsedS[1]
    rest = parsedS[2]

    @val @model.s 

    if rest? 
      words = SVGIE.word @model.textarea, this.facet, rest
      if words? 
        # Connect new list of words with 'next', and vice versa
        this.next words
        while words("next")?
          words = words("next")
        words "next", next
        if next?
          next "prev", words
    @val()

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
    parsedS = wordRegexp.exec s
    s = parsedS[1]
    rest = parsedS[2]

    next = prev("next") if prev?

    controller = Object.create controllerPrototype

    controller.facet = (method, args...) ->
      if method is "facet" or method is "model" or !controller[method]?
        return undefined
      controller[method].apply controller, args
    controller.model =
      s: s
      prev: prev
      next: next
      dx: -1
      line: unless prev? then 1 else prev "line"
      view: do ->
        v = document.createElementNS svgNS, "text"
        v.setAttributeNS spaceNS, "xml:space", "preserve"
        textarea("view").appendChild v
        v.addEventListener "click", (e) ->
          x = e.offsetX - v.offsetLeft
          y = v.offsetTop
          p = textarea "svgPoint", x, y
          clickedChar = v.getCharNumAtPosition p
          #clickedCharRect = v.getExtentOfChar clickedChar
          #if e.offsetX > (clickedCharRect.x + (clickedCharRect.width / 2))
          #  clickedChar += 1
          #closestGap = if e.offsetX < (clickedCharRect.x + (clickedCharRect.width / 2)) then clickedCharRect.x else clickedCharRect.x + clickedCharRect.width
          console.log e
        v
      textarea: textarea
      width: 0
      facet: controller.facet
      atChar: 0

    controller.val controller.model.s
    controller.width() # Calculate width with new "val"
    controller.repos()

    next("prev", controller.facet) if next?

    if rest? 
      controller.model.next = SVGIE.word textarea, controller.facet, rest

    controller.facet
