svgNS = 'http://www.w3.org/2000/svg'
xlinkNS = 'http://www.w3.org/1999/xlink'

describe "The svgieTextarea object", ->
	textarea = null
	textarea2 = null
	beforeEach ->
		textarea = svgInputElements()
		textarea2 = svgInputElements()

	it "has a g element", ->
		expect(textarea.gElement).toBeDefined()
	it "has its own textarea", ->
		expect(textarea.gElement).toBe textarea.gElement
		expect(textarea.gElement).not.toBe textarea2.gElement

	describe "has a text parser which", ->
		it "is a function called parse", ->
			expect(textarea.parse).toEqual jasmine.any Function
		it "takes a string as input and creates a text element", ->
			numberOfTextElements = textarea.gElement.getElementsByTagNameNS(svgNS, "text").length
			textarea.parse "string"
			newNumberOfTextElements = textarea.gElement.getElementsByTagNameNS(svgNS, "text").length
			expect(newNumberOfTextElements).toEqual numberOfTextElements + 1
		it "puts each word into a tspan element, treating single whitespace characters as a separate word", ->
			textarea.parse("  a regular string! ")
			text = textarea.gElement.getElementsByTagNameNS(svgNS, "text")[0]
			tspans = text.getElementsByTagNameNS(svgNS, "tspan")
			expect(tspans.length).toBe 8