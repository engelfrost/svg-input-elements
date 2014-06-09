svgNS = 'http://www.w3.org/2000/svg'
xlinkNS = 'http://www.w3.org/1999/xlink'

describe "The svgInputElements function", ->
	svgFixture = null
	beforeEach ->
		svgFixture = fixture.load('svg.html')[0]
	afterEach ->
		fixture.cleanup()

	it "is a function called svgInputElements", ->
		expect(svgInputElements).toEqual jasmine.any Function 
	it "takes an optional SVG element as a first parameter", ->
		expect(svgInputElements()).toEqual jasmine.any Object
		expect(svgInputElements(svgFixture)).toEqual jasmine.any Object
	it "takes an optional options argument after the optional SVG argument", ->
		options = 
			width: 100,
			height: 100
		expect(svgInputElements(options)).toEqual jasmine.any Object
		expect(svgInputElements(svgFixture, options)).toEqual jasmine.any Object
		#expect(-> svgInputElements(svgFixture, {})).toThrow()
	it "returns an object with the textareas g element in the property .gElement", ->
		g = svgInputElements(svgFixture).gElement
		expect(g.nodeName).toBe "g"
	it "returns a g element within a new SVG element if no svg parameter was passed", ->
		expect(svgInputElements().gElement.parentNode.nodeName).toEqual "svg"
		expect(svgInputElements().gElement.parentNode.namespaceURI).toEqual svgNS


