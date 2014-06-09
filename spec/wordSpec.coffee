svgNS = 'http://www.w3.org/2000/svg'
xlinkNS = 'http://www.w3.org/1999/xlink'

describe "The svgieWord object", ->
	beforeEach ->
		svgFixture = fixture.load("svg.html")[0]
		gElements = svgFixture.getElementsByTagNameNS svgNS, "g"
		lineObject = svgieLine(gElements[0], "")
		this.svgieWords = [
			svgieWord(null, null, null, "three"),
			svgieWord(null, null, null, " "),
			svgieWord(null, null, null, "strings.")
		]
		this.svgieWords[0].next = this.svgieWords[1]
		this.svgieWords[1].prev = this.svgieWords[0]
		this.svgieWords[1].next = this.svgieWords[2]
		this.svgieWords[2].prev = this.svgieWords[1]
	afterEach ->
		delete this.svgieWords

	it "takes a string as a parameter and returns an object", ->
		for w in this.svgieWords
			do (w) ->
				expect(w).toEqual jasmine.any Object
	it "has the property width() which returns the tspan width", ->
		for w in this.svgieWords
			do (w) ->
				expect(w.width).toEqual jasmine.any Function
				expect(w.width()).toEqual jasmine.any Number
	it "has the property chars() which returns the word length", ->
		for w in this.svgieWords
			do (w) ->
				expect(w.chars).toEqual jasmine.any Function
				expect(w.chars()).toEqual jasmine.any Number
	it "has the properties next and prev which reference other words, or contains the value null", ->
		for w in this.svgieWords
			do (w) ->
				expect(w.next).toBeDefined()
				if w.next? 
					expect(w.next).toEqual jasmine.any Object
				expect(w.prev).toBeDefined()
				if w.prev? 
					expect(w.prev).toEqual jasmine.any Object
