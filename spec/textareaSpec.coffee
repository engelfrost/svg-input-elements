svgNS = 'http://www.w3.org/2000/svg'
xlinkNS = 'http://www.w3.org/1999/xlink'

describe "The textarea model", ->
	textarea = null
	svg = ->
		svgElement = document.createElementNS svgNS, "svg"
		svgElement.setAttributeNS null, "version", "1.1"
		svgElement.setAttributeNS null, "width", "100px"
		svgElement.setAttributeNS null, "height", "100px"
		svgElement
	beforeEach ->
		textarea = SVGIE.textarea svg(), {}, ""

	it "has a 'width' method which returns null if no width was set", ->
		expect(textarea "width").toBe null
	it "has a 'width' method which returns a numer if a width was set", ->
		textarea2 = SVGIE.textarea svg(), { width: 100 }, ""
		expect(textarea2 "width").toBe 100
	# it "has a 'width' method which sets the width to the number specified", ->
	# 	textarea.width(200)
	# 	expect(textarea.width()).toBe 200
	it "has a 'height' method which is null if no height was set", ->
		expect(textarea "height").toBe null
	it "has a 'height' property which is a numer if a height was set", ->
		textarea2 = SVGIE.textarea svg(), { height: 100 }, ""
		expect(textarea2 "height").toBe 100
	it "has the property 'lineheight' which is a number", ->
		expect(textarea "lineheight").toEqual jasmine.any Number
	it "has a 'words' property which is null if no string was passed to SVGIE.textarea", ->
		expect(textarea "words").toBe null
	it "has a 'words' property which is a function if a string was passed to SVGIE.textarea", ->
		textarea2 = SVGIE.textarea svg(), {}, "string"
		expect(textarea2 "words").toEqual jasmine.any Function

	describe "has a 'view' property which", ->
		it "is a <g> element", ->
			expect(textarea("view").nodeName).toBe "g"
		it "is appended to the <svg> element", ->
			svgElement = svg()
			textarea = SVGIE.textarea svgElement, {}, ""
			expect(textarea("view").parentNode).toBe svgElement

	describe "has a 'val' method which", ->
		it "takes a string argument and replaces the value of the textarea with new content", ->
			numberOfTextElements = textarea("view").getElementsByTagNameNS(svgNS, "text").length
			textarea("val", "string")
			setTimeout ->

				newNumberOfTextElements = textarea("view").getElementsByTagNameNS(svgNS, "text").length
				test = -> expect(newNumberOfTextElements).toEqual numberOfTextElements + 1
				setTimeout test, 100
				, 
				100