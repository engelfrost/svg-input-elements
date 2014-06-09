svgNS = 'http://www.w3.org/2000/svg'
xlinkNS = 'http://www.w3.org/1999/xlink'

describe "The svgieLine object", ->
	lineObject = null
	beforeEach ->
		lineObject = svgieLine(svgInputElements().gElement)
	it "has a property maxWidth() which returns a number", ->
		expect(lineObject.maxWidth()).toEqual jasmine.any Number
	it "has a property wordChain which is null or holds a reference to an svgieWord", ->
		if lineObject.wordChain?
			expect(lineObject.wordChain).toEqual jasmine.any Object 
		else
			expect(lineObject.wordChain).toBe null
	it "has a property textElement which holds null or a text node", ->
		if lineObject.textElement? 
			expect(lineObject.textElement.nodeName).toEqual "text"
	it "has one or more tspans", ->
		expect(lineObject.textElement.getElementsByTagNameNS(svgNS, "tspan")).toBeGreaterThan 0
	it "has no empty tspans, unless the prev and next properties are both null, in which case it may have exactly 1 empty tspan and no other tspans", ->
		if lineObject.next == null and lineObject.prev is null
			tspans = lineObject.textElement.getElementsByTagNameNS svgNS, "tspan"
			expect(tspans.length).toBeGreaterThan 0
			if tspans.length > 1
				for tspan in tspans
					do (tspan) ->
						expect(tspan.textContent.length).toBeGreaterThan 0
	describe "has a text element which", ->
		it "is never longer than maxWidth()"
