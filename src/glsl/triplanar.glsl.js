export default
`vec4 triplanar(in vec3 coords, in sampler2D samp, in float weight, in float s) {
  vec3 n = abs(normalize(coords));
  n = normalize(max(n, weight));
  float b = n.x + n.y + n.z;
  n /= vec3(b,b,b);

  vec4 xa = texture(samp, s*n.yz);
  vec4 ya = texture(samp, s*n.xz);
  vec4 za = texture(samp, s*n.xy);
  return xa*n.x + ya*n.y + za*n.z;
}
`
