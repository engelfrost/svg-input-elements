svgNS = 'http://www.w3.org/2000/svg'
xlinkNS = 'http://www.w3.org/1999/xlink'

describe "The textarea controller", ->
  textarea = null
  svg = ->
    svgElement = document.createElementNS svgNS, "svg"
    svgElement.setAttributeNS null, "version", "1.1"
    svgElement.setAttributeNS null, "width", "100px"
    svgElement.setAttributeNS null, "height", "100px"
    svgElement
  beforeEach ->
    textarea = SVGIE.textarea svg(), {}, ""

  it "has a 'width' action which returns null if no width was set", ->
    expect(textarea "width").toBe null
  it "has a 'width' action which returns a numer if a width was set", ->
    textarea2 = SVGIE.textarea svg(), { width: 100 }
    expect(textarea2 "width").toBe 100
  it "has a 'width' action which sets the width to the value of the second argument", ->
    textarea "width", 200
    expect(textarea "width").toBe 200
  it "has a 'height' action which returns null if no height was set", ->
    expect(textarea "height").toBe null
  it "has a 'height' action which returns a numer if a height was set", ->
    textarea = SVGIE.textarea svg(), { height: 100 }
    expect(textarea "height").toBe 100
  it "has a 'lineheight' action which returns a number", ->
    expect(textarea "lineheight").toEqual jasmine.any Number
  it "has a 'words' action which returns s word function even if no string was passed to SVGIE.textarea", ->
    expect(textarea "words").not.toBe null
  it "has a 'words' action which returns a word controller if a string was passed to SVGIE.textarea", ->
    textarea = SVGIE.textarea svg(), {}, "string"
    expect(textarea "words").toEqual jasmine.any Function
  it "has a 'val' action which returns the textareas string value", ->
    textarea = SVGIE.textarea svg(), {}, "one two three"
    expect(textarea "val").toBe "one two three"
  it "has a 'val' action which can set the value of the textarea", ->
    textarea "val", "one two three"
    expect(textarea "val").toBe "one two three"