export default {
  length([x,y,z]) {
    return Math.sqrt(x*x + y*y + z*z)
  },

  sum([x1,y1,z1], [x2,y2,z2]) {
    return [x1+x2, y1+y2, z1+z2]
  },

  diff([x1,y1,z1], [x2,y2,z2]) {
    return [x1-x2, y1-y2, z1-z2]
  },

  scale(f, [x,y,z]) {
    return [f*x, f*y, f*z]
  },

  norm([x,y,z]) {
    const f = Math.sqrt(x*x + y*y + z*z)
    return [x/f, y/f, z/f]
  },

  cross([x1,y1,z1], [x2,y2,z2]) {
    return [
      y1*z2 - z1*y2,
      z1*x2 - x1*z2,
      x1*y2 - y1*x2
    ]
  },

  dot([x1,y1,z1], [x2,y2,z2]) {
    return x1*x2 + y1*y2 + z1*z2
  }
}
