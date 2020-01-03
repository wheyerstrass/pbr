export default {

  lerp(from, to, alpha, threshold) {
    return this.lint(from, to, alpha, threshold)
  },

  lint(from, to, alpha, threshold) {
    const diff = to - from
    return (Math.abs(diff) > threshold) ? alpha*diff : 0
  },

  rad(deg) {
    return deg*Math.PI/180
  },

  polar3(dist, phi, theta) {
    return [
      dist * Math.sin(theta) * Math.sin(phi), // x
      dist * Math.cos(theta),                 // y
      dist * Math.sin(theta) * Math.cos(phi), // z
    ]
  }

}
