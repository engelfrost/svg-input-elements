svgNS = 'http://www.w3.org/2000/svg'
xlinkNS = 'http://www.w3.org/1999/xlink'

describe "The SVGIE.textarea function", ->
  svg = ->
    svgElement = document.createElementNS svgNS, "svg"
    svgElement.setAttributeNS null, "version", "1.1"
    svgElement.setAttributeNS null, "width", "100px"
    svgElement.setAttributeNS null, "height", "100px"
    svgElement
  g = (svgElement) ->
    gElement = document.createElementNS svgNS, "g"
    if svgElement? 
      svgElement.appendChild gElement
    gElement

  it "can take the argument (svg: <svg>)", ->
    expect(-> SVGIE.textarea()).toThrow()
    expect(-> SVGIE.textarea(svg())).not.toThrow()
  it "can take the argument (svg: <g>)", ->
    expect(-> SVGIE.textarea(g(svg()))).not.toThrow()
  it "can not take the argument (svg: <text>)", ->
    textElement = document.createElementNS svgNS, "text"
    expect(-> SVGIE.textarea(textElement)).toThrow()
  it "can take the arguments (svg: <svg>, options: Object)", ->
    expect(-> SVGIE.textarea(svg(), "string")).toThrow()
    expect(-> SVGIE.textarea(svg(), {})).not.toThrow()
  it "can take the arguments (svg: Element, options: Object, s: String)", ->
    expect(-> SVGIE.textarea(svg(), {}, {})).toThrow()
    expect(-> SVGIE.textarea(svg(), {}, "string")).not.toThrow()
  it "returns a function", ->
    expect(SVGIE.textarea(svg(), {})).toEqual jasmine.any Function


