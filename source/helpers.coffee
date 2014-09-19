window.addEventListener "click", (e) ->
  paintPoint(e.clientX, e.clientY)
paintPoint = (x, y) ->
  div = document.createElement("div")
  div.style.position = "absolute"
  div.style.width = "2px"
  div.style.height = "2px"
  div.style.left = x + "px"
  div.style.top = y + "px"
  div.style.backgroundColor = "red"
  document.body.appendChild(div)
