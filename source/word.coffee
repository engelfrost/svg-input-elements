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
      # Change text
      @model.s = s
      @model.view.textContent = s
        .replace(newlinesRegexp, "")
        .replace(/\t/, "    ")
      # Recalculate width
      @model.width = @model.view.getBoundingClientRect().width # What about that other word width property/method?
      # Repos next word unless next word is the first word
      @model.next("repos") unless @isEnd()
    @model.s
  wordLength: ->
    @model.s.length
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
  isBeginning: ->
    @model.beginning
  isEnd: ->
    @model.next "isBeginning"
  dx: ->
    @model.dx
  dy: ->
    @model.line * @model.textarea "lineheight"
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
      if @isBeginning()
        0
      else
        # Ignore a single leading space
        if not @whitespace() and @model.prev("whitespace") is "space" and @model.prev("autoWrapped")
          0
        else
          @model.prev("dx") + @model.prev("width")
    # Can we stay on the same line?
    if @whitespace() isnt "newline" and (@model.textarea("width") is null or @model.textarea("width") >= (dx + @model.width))
      # This will break if word is wider than textarea
      @model.dx = dx
      @model.line = @model.prev "line"
    else
      # Start a new line
      @model.dx = 0
      @model.line = @model.prev("line") + 1
    @model.view.setAttributeNS null, "x", @model.dx
    @model.view.setAttributeNS null, "y", @model.line * @model.textarea("lineheight")
    if @isEnd()
      @model.textarea "height", @facet "dy"
    else
      @model.next("repos")
    @model.dx
  insert: (s, pos) ->
    #TODO: Reposition cursor
    #TODO: Handele out of range pos values
    unless pos? and pos <= @model.s.length and pos >= 0
      throw "The position '" + pos + "' is not set or out of range"
    s = @model.s.substr(0, pos) + s + @model.s.substr(pos)
    next = @model.next
    parsedS = wordRegexp.exec s
    @model.s = parsedS[1]
    rest = parsedS[2]

    @val @model.s

    if rest?
      SVGIE.word @model.textarea, @facet, rest
    @val()


SVGIE.word = (textarea, prev, s) ->
  unless typeof textarea is 'function'
    throw "Textarea must be a textarea function"
  unless prev is null or typeof prev is 'function'
    throw "Second argument should be a word controller or null"
  unless typeof s is 'string'
    throw "Third argument must be a string"

  if s.length is 0 and prev?
    return null
  else if s.length is 0 and not prev?
      s = ""
      rest = ""
  else
    parsedS = wordRegexp.exec s
    s = parsedS[1]
    rest = parsedS[2]

  controller = Object.create controllerPrototype

  leftWord = prev if prev?
  rightWord = prev("next") if prev?

  controller.facet = (method, args...) ->
    if method is "facet" or method is "model" or !controller[method]?
      return undefined
    controller[method].apply controller, args
  controller.model =
    s: s
    prev: do ->
      if leftWord?
        leftWord "next", controller.facet
        leftWord
      else
        controller.facet
    next: do ->
      if rightWord?
        rightWord "prev", controller.facet
        rightWord
      else
        controller.facet
    dx: -1
    line: unless prev? then 1 else prev "line"
    view: do ->
      v = document.createElementNS svgNS, "text"
      v.setAttributeNS spaceNS, "xml:space", "preserve"
      textarea("view").appendChild v
      v.addEventListener "click", (e) ->
        # Make this textarea "focused"
        textarea "focus"

        x = e.clientX - v.ownerSVGElement.offsetLeft # clientX, pageX, x, offsetX <-relative to <text>
        y = e.clientY - v.ownerSVGElement.offsetTop
        p = textarea "svgPoint", x, y
        charNum = v.getCharNumAtPosition p
        charRect = v.getExtentOfChar charNum
        if x < (charRect.x + (charRect.width / 2))
          cursorPoint = v.getStartPositionOfChar charNum
        else
          cursorPoint = v.getEndPositionOfChar charNum
          charNum += 1
        cursor = textarea("cursor")
        cursor("set", controller.facet, charNum, cursorPoint)

        #if e.offsetX > (charRect.x + (charRect.width / 2))
        #  char += 1
        #closestGap = if e.offsetX < (charRect.x + (charRect.width / 2)) then clickedCharRect.x else clickedCharRect.x + clickedCharRect.width
        #console.log e
      v
    textarea: textarea
    width: 0
    facet: controller.facet
    atChar: 0
    beginning: not prev?

  controller.val controller.model.s
  controller.width() # Calculate width with new "val"
  controller.repos()

  #next("prev", controller.facet) if next?

  if rest?
    SVGIE.word textarea, controller.facet, rest

  controller.facet
