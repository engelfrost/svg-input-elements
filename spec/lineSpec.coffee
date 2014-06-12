svgNS = 'http://www.w3.org/2000/svg'
xlinkNS = 'http://www.w3.org/1999/xlink'

describe "The line model", ->
	lineObject = null
	beforeEach ->
		lineObject = SVGIE.line(SVGIE.textarea().gElement)
	it "has a property maxWidth() which returns a number", ->
		expect(lineObject.maxWidth()).toEqual jasmine.any Number
	it "has a property words which is null or holds a reference to an wordObject", ->
		if lineObject.words?
			expect(lineObject.words).toEqual jasmine.any Object 
		else
			expect(lineObject.words).toBe null
	it "has a property textElement which holds null or a text node", ->
		if lineObject.textElement? 
			expect(lineObject.textElement.nodeName).toEqual "text"
	it "has one or more tspans", ->
		numberOfTspans = lineObject.textElement.getElementsByTagNameNS(svgNS, "tspan").length
		expect(numberOfTspans).toBeGreaterThan -1
	it "has no empty tspans, unless the prev and next properties are both null, in which case it shall have exactly 1 empty tspan", ->
		if lineObject.next == null and lineObject.prev is null
			tspans = lineObject.textElement.getElementsByTagNameNS svgNS, "tspan"
			expect(tspans.length).toBeGreaterThan -1
			if tspans.length > 1
				for tspan in tspans
					do (tspan) ->
						expect(tspan.textContent.length).toBeGreaterThan 0
	# describe "has a text element which", ->
	# 	it "is never longer than maxWidth()", ->
	# 		expect(true).toBe true
