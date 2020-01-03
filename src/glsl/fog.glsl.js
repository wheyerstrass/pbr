export default
`vec3 fog(in vec3 col, in vec3 fcol, in float dist, in float dens) {
  float d = 1.0 - exp(-dist*dens);
  return mix(col, fcol, d);
}
`
