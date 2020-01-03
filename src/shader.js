const dummy = new Uint8Array([
  200, 200, 200, 255,
  100, 100, 100, 255,
  200, 200, 200, 255,
  100, 100, 100, 255,
])

export default {

  prog: function(gl, vertSrc, fragSrc, uniforms) {

    const _shader = function(type, src) {
      let s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (gl.getShaderParameter(s, gl.COMPILE_STATUS))
        return s
      console.error(gl.getShaderInfoLog(s))
      gl.deleteShader(s)
    }

    let p = gl.createProgram()
    gl.attachShader(p, _shader(gl.VERTEX_SHADER, vertSrc))
    gl.attachShader(p, _shader(gl.FRAGMENT_SHADER, fragSrc))
    gl.linkProgram(p)

    if (gl.getProgramParameter(p, gl.LINK_STATUS)) {
      let locs = {}
      uniforms.forEach(u => locs[u] = gl.getUniformLocation(p, u))
      return {
        id: p,
        locs,
        objs: [],
        models: [],
        mats: [],
        preDraw: ()=>{},
        postDraw: ()=>{},
      }
    }
    console.error(gl.getProgramInfoLog(p))
    gl.deleteProgram(p)
  },

  tex2d: function(gl, progId, texunit, loc, img) {
    gl.useProgram(progId)
    gl.uniform1i(loc, texunit)
    let id = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0+texunit)
    gl.bindTexture(gl.TEXTURE_2D, id)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    gl.generateMipmap(gl.TEXTURE_2D)
    return {id}
  },

  tex2d_async: function(gl, progId, texunit, loc, img) {
    gl.useProgram(progId)
    gl.uniform1i(loc, texunit)
    let id = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0+texunit)
    gl.bindTexture(gl.TEXTURE_2D, id)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0,
      gl.RGBA, gl.UNSIGNED_BYTE, dummy)
    gl.generateMipmap(gl.TEXTURE_2D)
    const _img = new Image()
    _img.src = img
    _img.addEventListener("load", function() {
      gl.activeTexture(gl.TEXTURE0+texunit)
      gl.bindTexture(gl.TEXTURE_2D, id)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _img)
      gl.generateMipmap(gl.TEXTURE_2D)
    })
    return {id}
  },

  cubemap: function(gl, progId, texunit, loc, {px,nx,py,ny,pz,nz}) {
    const targets = [
      {face: gl.TEXTURE_CUBE_MAP_POSITIVE_X, img: px},
      {face: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, img: nx},
      {face: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, img: py},
      {face: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, img: ny},
      {face: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, img: pz},
      {face: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, img: nz}
    ]
    gl.useProgram(progId)
    gl.uniform1i(loc, texunit)
    const id = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0+texunit)
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, id)
    targets.forEach(
      t => gl.texImage2D(t.face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, t.img)
    )
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP)
    gl.texParameteri(gl.TEXTURE_CUBE_MAP,
      gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR
    )
    gl.texParameteri(gl.TEXTURE_CUBE_MAP,
      gl.TEXTURE_MAG_FILTER, gl.LINEAR
    )
    return {id}
  },
}

