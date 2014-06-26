svgNS = 'http://www.w3.org/2000/svg'
xlinkNS = 'http://www.w3.org/1999/xlink'

svg = ->
  svgElement = document.createElementNS svgNS, "svg"
  svgElement.setAttributeNS null, "version", "1.1"
  svgElement.setAttributeNS null, "width", "100px"
  svgElement.setAttributeNS null, "height", "100px"
  svgElement

describe "The SVGIE.word function", ->
  textarea = null
  word = null
  beforeEach ->
    textarea = SVGIE.textarea svg(), { width: 200 }, "string"
    word = textarea "words"

  it "takes three arguments (textarea: Function, prev: Function|null, s: String)", ->
    expect(-> SVGIE.word(textarea, null, "string")).not.toThrow()
  it "returns a word controller function if 's' was a non-empty string", ->
    expect(SVGIE.word(textarea, null, "string")).toEqual jasmine.any Function
    expect(SVGIE.word(textarea, word, "string")).toEqual jasmine.any Function
  it "returns null if 's' was an empty string", ->
    expect(SVGIE.word(textarea, null, "")).toBe null
    expect(SVGIE.word(textarea, word, "")).toBe null
  it "can span new words, which can be referenced through the controllers 'next' action", ->
    expect(SVGIE.word(textarea, null, "many words")("val")).toBe "many"
    expect(SVGIE.word(textarea, null, "many words")("next")("next")("val")).toBe "words"

describe "The word controller", ->
  textarea = null
  word = null
  beforeEach ->
    textarea = SVGIE.textarea svg(), { width: 200 }, "string"
    word = textarea "words"

  it "has an action 'val' which returns a string", ->
    expect(word "val").toBe "string"
    word = SVGIE.word textarea, null, ""
    expect(word).toBe null
  it "has the action 'width' which returns a number", ->
    expect(word "width").toEqual jasmine.any Number
  it "has the action 'prev' which returns or another word function", ->
    expect(word "prev").toEqual jasmine.any Function
  it "has the action 'line' which returns a positive integer", ->
    expect(word "line").toBeGreaterThan 0
  it "has the action 'textarea' which returns a reference to the textarea controller", ->
    expect(word "textarea").toBe textarea
  it "has the action 'dx' which returns a number", ->
    expect(word "dx").toEqual jasmine.any Number
  it "has an action 'insert' which inserts a character 's' at position 'pos' of the current string'", ->
    word("insert", "X", 0)
    expect(word "val").toBe "Xstring"
    word("insert", "X", 2)
    expect(word "val").toBe "XsXtring"
  it "has an action 'insert' that returns the new string", ->
    expect(word "insert", "X", 0).toBe "Xstring"
  it "has an action 'insert' which can insert a string", ->
    expect(word "insert", "ABC", 1).toBe "sABCtring"
  it "has an action 'insert' that ends the word if a whitespace is inserted", ->
    expect(word "insert", " ", 1).toBe "s"
  it "has an action 'insert' that creates new words if it encounters whitespace", ->
    word "insert", " ", 0
    expect(word "val").toBe " "
    expect(word("next")("val")).toBe "string"