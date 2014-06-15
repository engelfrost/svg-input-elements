svgNS = 'http://www.w3.org/2000/svg'
xlinkNS = 'http://www.w3.org/1999/xlink'

describe "The SVGIE.textarea function", ->
	svg = ->
		svgElement = document.createElementNS svgNS, "svg"
		svgElement.setAttributeNS null, "version", "1.1"
		svgElement.setAttributeNS null, "width", "100px"
		svgElement.setAttributeNS null, "height", "100px"
		svgElement
	g = (svgElement) ->
		gElement = document.createElementNS svgNS, "g"
		if svgElement? 
			svgElement.appendChild gElement
		gElement

	it "can take an <svg> element as a first parameter", ->
		svgElement1 = svg()
		svgElement2 = svg()

		expect(-> SVGIE.textarea()).toThrow()
		expect(-> SVGIE.textarea(svgElement1)).not.toThrow()

		textarea1 = SVGIE.textarea svgElement1
		textarea2a = SVGIE.textarea svgElement2
		textarea2b = SVGIE.textarea svgElement2

		expect(textarea1.view.parentNode).not.toBe textarea2a.view.parentNode
		expect(textarea2a.view.parentNode).toBe textarea2b.view.parentNode
	it "can also take a <g> element as the first parameter", ->
		gElement = g svg()

		expect(-> SVGIE.textarea(gElement)).not.toThrow()
	it "takes an optional 'options' argument", ->
		expect(-> SVGIE.textarea(svg(), {})).not.toThrow()
	it "takes an optional 'string' argument", ->
		expect(-> SVGIE.textarea(svg(), "string")).not.toThrow()
		expect(-> SVGIE.textarea(svg(), {}, "string")).not.toThrow()
		expect(-> SVGIE.textarea(svg(), "string", {})).toThrow()


