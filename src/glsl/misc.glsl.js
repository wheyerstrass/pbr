export default
`
vec3 cb(in vec3 col, in float contrast, in float brightness) {
  return (col-0.5) * contrast + 0.5 + brightness;
}

vec3 gammac(in vec3 col) {
  return pow(col, vec3(1./2.2));
}

vec3 hdr(in vec3 col) {
  return col/(col+1.);
}
`
