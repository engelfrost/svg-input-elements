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
	it "takes an optional SVG element as a parameter", ->
		expect(svgInputElements(svgFixture)).toEqual jasmine.any Object 
	it "returns an object with the textareas g element in the property .gElement", ->
		g = svgInputElements(svgFixture).gElement
		expect(g).toEqual svgFixture.getElementsByTagNameNS(svgNS, "g")[0]
	it "returns a g element within a new SVG element if no svg parameter was passed", ->
		expect(svgInputElements().gElement.parentNode.nodeName).toEqual "svg"
		expect(svgInputElements().gElement.parentNode.namespaceURI).toEqual svgNS


