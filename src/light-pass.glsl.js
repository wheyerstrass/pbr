export default {
  vert:
`
in vec2 uv;
in vec4 pos;

out vec2 v_uv;

void main() {

  v_uv = uv;
  gl_Position = pos;
}
`,

  frag:
`
in vec2 v_uv;

out vec4 color;

const vec3 light = vec3(10,0,10);

void main() {
  vec3 pos = texture(g_pos,v_uv).xyz;
  vec3 nor = texture(g_nor,v_uv).xyz;
  vec3 alb = pow(texture(g_alb,v_uv).xyz, vec3(2.2));
  float ao = texture(g_ao,v_uv).r;
  float ruff = texture(g_ruff,v_uv).r;
  float met = texture(g_met,v_uv).r;

  vec3 col = pbr(light, vec3(1), cam, pos, nor, alb, ao, ruff, met);
  color = vec4(col,1);
}
`
}
