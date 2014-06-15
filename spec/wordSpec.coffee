svgNS = 'http://www.w3.org/2000/svg'
xlinkNS = 'http://www.w3.org/1999/xlink'

svg = ->
	svgElement = document.createElementNS svgNS, "svg"
	svgElement.setAttributeNS null, "version", "1.1"
	svgElement.setAttributeNS null, "width", "100px"
	svgElement.setAttributeNS null, "height", "100px"
	svgElement

describe "The word function", ->
	textarea = null
	word = null
	beforeEach ->
		textarea = SVGIE.textarea svg(), { width: 200 }, "string"
		word = textarea.words
	it "takes a first argument 'textarea' which is a referenc to an SVGIE.textarea", ->
		expect(textarea).toEqual jasmine.any Object
		expect(-> SVGIE.word(textarea, null, "string")).not.toThrow()
	it "takes a second argument 'prev' which is null or an object, and a third argument 's' which is a string", ->
		expect(-> SVGIE.word(textarea, null, "string")).not.toThrow()
		expect(-> SVGIE.word(textarea, word, "")).not.toThrow()
	it "thrown an exception if the string is the second parameter", ->
		expect(-> SVGIE.word(textarea, "string", word)).toThrow()
	it "throws an exception if 's' is not a string", ->
		expect(-> SVGIE.word(textarea, null, null)).toThrow()
	it "throws an exception if not all arguments are passed", ->
		expect(-> SVGIE.word(textarea, null)).toThrow()
	it "returns an object if 's' was a non-empty string", ->
		expect(SVGIE.word(textarea, null, "string")).toEqual jasmine.any Object
		expect(SVGIE.word(textarea, null, "")).toBe null

describe "The word object", ->
	textarea = null
	word = null
	beforeEach ->
		textarea = SVGIE.textarea svg(), { width: 200 }, "string"
		word = textarea.words

	it "has a property 's' which is a non-empty string", ->
		expect(word).toEqual jasmine.any Object
		expect(word.s).toBe "string"
		word = SVGIE.word textarea, null, ""
		expect(word).toBe null
	it "has the property 'width' which is a number", ->
		expect(word.width).toEqual jasmine.any Number
	it "has the property 'height' which is a number", ->
		expect(word.height).toEqual jasmine.any Number
	it "has the property 'prev' which is null or another word object", ->
		expect(word.prev).toBe null
	it "has the property 'line' which is a positive integer", ->
		expect(word.line).toBeGreaterThan 0
	it "has the property 'textarea' which is a reference to the textarea object", ->
		expect(word.textarea).toBe textarea

	describe "has the method 'dx' which ", ->
		textarea = null
		word = null
		beforeEach ->
			textarea = SVGIE.textarea svg(), { width: 200 }, "string"
			word = textarea.words

		it "returns a number if called with no parameters", ->
			expect(word.dx()).toEqual jasmine.any Number
		it "sets the dx value if called with a parameter", ->
			word.dx(10)
			expect(word.dx()).toBe 10
		it "increases the line number and resets dx if textarea.width < dx + width", ->
			word.dx(0)
			word.line = 1
			word.width = 100
			word.textarea.width = 200
			word.dx(100)
			expect(word.line).toBe 1
			word.dx(101)
			expect(word.line).toBe 2

