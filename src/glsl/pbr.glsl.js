export default
`
vec3 fresnel_schlick(float cosTheta, vec3 F0) {
  return F0 + (1.-F0) * pow(1.-cosTheta, 5.);
}

const float _pi = 3.141592653589793;
float distrib_ggx(in vec3 N, in vec3 H, in float ruff) {
  float a = ruff*ruff;
  float a2 = a*a;
  float NdotH = max(dot(N,H), 0.);
  float NdotH2 = NdotH*NdotH;

  float num = a2;
  float denom = (NdotH2 * (a2-1.) + 1.);
  denom = _pi * denom * denom;
  
  return (num / denom);
}

float geom_schlick_ggx(float NdotV, float ruff) {
  float r = (ruff+1.);
  float k = (r*r) / 8.;

  float num = NdotV;
  float denom = NdotV * (1.-k) + k;

  return (num / denom);
}

float geom_smith(vec3 N, vec3 V, vec3 L, float ruff) {
  float NdotV = max(dot(N,V), 0.);
  float NdotL = max(dot(N,L), 0.);
  float ggx2 = geom_schlick_ggx(NdotV, ruff);
  float ggx1 = geom_schlick_ggx(NdotL, ruff);

  return (ggx1 * ggx2);
}

vec3 pbr(vec3 light_pos, vec3 light_col, vec3 cam, vec3 pos,
          vec3 nor, vec3 alb, float ao, float ruff, float met) {

  vec3 N = normalize(2.*nor-1.);
  vec3 V = normalize(cam-pos);
  vec3 F0 = vec3(0.04);
  F0 = mix(F0, alb, met);

  //// reflectence
  vec3 Lo = vec3(0);
  // radiance
  vec3 L = normalize(light_pos-pos);
  vec3 H = normalize(V+L);
  float dist = length(L);
  float atte = 1. / (dist*dist);
  vec3 radi = light_col * atte;
  // cook-torrance brdf
  float NDF = distrib_ggx(N,H,ruff);
  float G = geom_smith(N,V,L,ruff);
  vec3 F = fresnel_schlick(max(dot(H,V), 0.), F0);

  vec3 kS = F;
  vec3 kD = vec3(1) - kS;
  kD *= 1.-met;

  vec3 num = NDF * G * F;
  float denom = 4. * max(dot(N,V), 0.) * max(dot(N,L), 0.);
  vec3 spec = num / max(denom, 0.001);

  float NdotL = max(dot(N,L), 0.);
  Lo += (kD*alb/_pi + spec) * radi * NdotL;

  vec3 amb = vec3(0.03) * alb * ao;
  vec3 col = amb + Lo;

  col = col / (col+vec3(1));
  col = pow(col, vec3(1./2.2));

  return col;
}
`
