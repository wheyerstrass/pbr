import vec3 from "./vec.js"

function rad(deg) {
  return deg*Math.PI/180
}

export default {

  identity: [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ],

  transpose: function([
    m00, m01, m02, m03,
    m10, m11, m12, m13,
    m20, m21, m22, m23,
    m30, m31, m32, m33,
  ]) {
    return [
      m00, m10, m20, m30,
      m01, m11, m21, m31,
      m02, m12, m22, m32,
      m03, m13, m23, m33,
    ]
  },

  scale: function([x,y,z]) {
    return [
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1
    ]
  },

  translate: function(vec) {
    const [x,y,z] = vec
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1
    ])
  },

  rotate: function(axis_angle) {
    let [x_,y_,z_,a] = axis_angle
    a = -rad(a)
    const [x,y,z] = vec3.norm([x_,y_,z_])
    const sina = Math.sin(a)
    const cosa = Math.cos(a)
    return [
      x*x+(1-x*x)*cosa, x*y*(1-cosa)-z*sina, x*z*(1-cosa)+y*sina, 0,
      x*y*(1-cosa)+z*sina, y*y+(1-y*y)*cosa, y*z*(1-cosa)-x*sina, 0,
      x*z*(1-cosa)-y*sina, y*z*(1-cosa)+x*sina, z*z+(1-z*z)*cosa, 0,
      0, 0, 0, 1
    ]
  },

  lookat: function(from, at, upvec) {
    const f = vec3.norm(vec3.diff(at, from))
    const U = vec3.norm(upvec)
    const s = vec3.norm(vec3.cross(f, U))
    const u = vec3.norm(vec3.cross(s, f))
    return [
      s[0], u[0], -f[0], 0,
      s[1], u[1], -f[1], 0,
      s[2], u[2], -f[2], 0,
      0, 0, 0, 1
    ]
  },

  perspective: function(ar, nc, fc) {
    ar = 1./ar
    const fov = 67.5/ar
    const range = Math.tan(0.5*fov)*nc

    return [
      nc/range*ar, 0, 0, 0,
      0, nc/range, 0, 0,
      0, 0, (fc+nc)/(nc-fc), -1,
      0, 0, 2*nc*fc/(nc-fc), 0
    ]
  },
  perspectiveInf: function(ar, nc) {
    ar = 1./ar
    const fov = 67.5/ar
    const range = Math.tan(0.5*fov)*nc

    return [
      nc/range*ar, 0, 0, 0,
      0, nc/range, 0, 0,
      0, 0, -1, -1,
      0, 0, -2*nc, 0
    ]
  },

  ortho: function(l, r, t, b, nc, fc) {
    return [
      2/(r-l), 0, 0, -(r+l)/(r-l),
      0, 2/(t-b), 0, -(t+b)/(t-b),
      0, 0, -2/(fc-nc), -(fc+nc)/(fc-nc),
      0, 0, 0, 1
    ]
  },

  // always 4x4 matrix and 1x4 vector
  mult: function([
    m00, m01, m02, m03,
    m10, m11, m12, m13,
    m20, m21, m22, m23,
    m30, m31, m32, m33
  ], [x,y,z,w]) {
    return [
      m00*x + m01*y + m02*z + m03*w,
      m10*x + m11*y + m12*z + m13*w,
      m20*x + m21*y + m22*z + m23*w,
      m30*x + m31*y + m32*z + m33*w,
    ]
  },

  mult3: function([
    m00, m01, m02, ,
    m10, m11, m12, ,
    m20, m21, m22, ,
    ,    ,    , ,
  ], [x,y,z, ]) {
    return [
      m00*x + m01*y + m02*z,
      m10*x + m11*y + m12*z,
      m20*x + m21*y + m22*z,
    ]
  },

  prod: function([
    a00, a01, a02, a03,
    a10, a11, a12, a13,
    a20, a21, a22, a23,
    a30, a31, a32, a33
  ], [
    b00, b01, b02, b03,
    b10, b11, b12, b13,
    b20, b21, b22, b23,
    b30, b31, b32, b33
  ]) {
    return [
      // 1. row
      a00*b00 + a01*b10 + a02*b20 + a03*b30,
      a00*b01 + a01*b11 + a02*b21 + a03*b31,
      a00*b02 + a01*b12 + a02*b22 + a03*b32,
      a00*b03 + a01*b13 + a02*b23 + a03*b33,
      // 2. row
      a10*b00 + a11*b10 + a12*b20 + a13*b30,
      a10*b01 + a11*b11 + a12*b21 + a13*b31,
      a10*b02 + a11*b12 + a12*b22 + a13*b32,
      a10*b03 + a11*b13 + a12*b23 + a13*b33,
      // 3. row
      a20*b00 + a21*b10 + a22*b20 + a23*b30,
      a20*b01 + a21*b11 + a22*b21 + a23*b31,
      a20*b02 + a21*b12 + a22*b22 + a23*b32,
      a20*b03 + a21*b13 + a22*b23 + a23*b33,
      // 4. row
      a30*b00 + a31*b10 + a32*b20 + a33*b30,
      a30*b01 + a31*b11 + a32*b21 + a33*b31,
      a30*b02 + a31*b12 + a32*b22 + a33*b32,
      a30*b03 + a31*b13 + a32*b23 + a33*b33,
    ]
  },

  multiprod: function(...M) {
    return M.reduce((all,m) => this.prod(all,m))
  }
}
