this.SVGIE ?= {}

svgNS = 'http://www.w3.org/2000/svg'

controllerPrototype = {}

SVGIE.keyboard = (textarea, cursor) ->
  controller = Object.create controllerPrototype

  controller.facet = (method, args...) ->
    if method is "facet" or method is "model" or not controller[method]?
      return undefined
    controller[method].apply controller, args
  controller.model = 
    cursor: cursor

  window.addEventListener "keypress", (e) ->
    if e.which? 
      s = String.fromCharCode e.keyCode
    else if e.which isnt 0 and e.charCode isnt 0
      s = String.fromCharCode e.which 
    else 
      s = ""
    console.log e
    controller.model.cursor "char", s
  controller.facet

