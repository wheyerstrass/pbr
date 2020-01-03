export default
`float phong(in vec3 ads, in vec3 light, in vec3 vpos, in vec3 vnorm) {

  vec3 nl = normalize(light-vpos);
  vec3 nn = normalize(vnorm);
  vec3 np = normalize(-vpos);

  // ambient
  float Ia = ads.x;

  // diffuse (lambert)
  float Id = ads.y * max( dot(nl, nn), 0.0 );

  // specular (blinn-phong)
  float rv = dot(nn, normalize(nl+np));
  float Is = ads.z * pow(rv, 4.);

  return (Ia+Id+Is);
}
`
