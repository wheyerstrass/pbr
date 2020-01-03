export default {

  keydown(config, target=window) {
    target.addEventListener("keydown", function({key}) {
      if(config.hasOwnProperty(key)) config[key]()
    })
  },

  keyup(config, target=window) {
    target.addEventListener("keyup", function({key}) {
      if(config.hasOwnProperty(key)) config[key]()
    })
  },

  wheel(callback, target=window) {
    target.addEventListener("wheel", function({deltaY}) {
      callback(deltaY)
    })
  },

  mousemove(callback, target=window) {
    target.addEventListener("mousemove",
      function({buttons, movementX, movementY}) {
        if(buttons === 1)
          callback(movementX, movementY)
      }
    )
  }

}
