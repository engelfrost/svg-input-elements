this.SVGIE ?= {}

#svgNS = 'http://www.w3.org/2000/svg'

controllerPrototype = {}

SVGIE.cursor = ->

  controller = Object.create controllerPrototype
  controller.facet = (method, args...) ->
    if method is "facet" or method is "model" or !@[method]?
      return undefined
    controller[method].apply controller, args
  controller.model = 
  	view: {}