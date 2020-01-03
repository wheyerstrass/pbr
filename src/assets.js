let assets = {}

function get(key) {
  return assets[key]
}

function ready() {
  let _assets = Object.values(assets)
  for(let i=0; i<_assets.length; ++i) {
    if(_assets[i] === false)
      return false
  }
  return true
}

function img(key, url) {
  let _img = new Image()
  _img.src = url
  assets[key] = false
  _img.addEventListener("load", function() {
    assets[key] = _img
  })
}

export default {
  assets,
  ready,
  get,
  img
}
