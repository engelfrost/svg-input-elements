svgNS = 'http://www.w3.org/2000/svg'
xlinkNS = 'http://www.w3.org/1999/xlink'

describe "The word model", ->
	wordObjects = null
	beforeEach ->
		lineObject = SVGIE.line(SVGIE.textarea().gElement)
		wordObjects = [
			SVGIE.word(lineObject, null, null, "three"),
			SVGIE.word(lineObject, null, null, " "),
			SVGIE.word(lineObject, null, null, "strings.")
		]
		wordObjects[0].next = wordObjects[1]
		wordObjects[1].prev = wordObjects[0]
		wordObjects[1].next = wordObjects[2]
		wordObjects[2].prev = wordObjects[1]
	afterEach ->
		wordObjects = null

	it "returns an object if the fourtch parameter is a non-empty string", ->
		for w in wordObjects
			do (w) ->
				expect(w).toEqual jasmine.any Object
	it "has the property width() which returns the tspan width", ->
		for w in wordObjects
			do (w) ->
				expect(w.width).toEqual jasmine.any Function
				expect(w.width()).toEqual jasmine.any Number
	it "has the property chars() which returns the word length", ->
		for w in wordObjects
			do (w) ->
				expect(w.chars).toEqual jasmine.any Function
				expect(w.chars()).toEqual jasmine.any Number
	it "has the properties next and prev which reference other words, or contains the value null", ->
		for w in wordObjects
			do (w) ->
				expect(w.next).toBeDefined()
				if w.next? 
					expect(w.next).toEqual jasmine.any Object
				expect(w.prev).toBeDefined()
				if w.prev? 
					expect(w.prev).toEqual jasmine.any Object
