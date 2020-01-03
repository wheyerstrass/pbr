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

void main() {
  vec3 pos = texture(tex_pos,v_uv).xyz;
  vec3 nor = texture(tex_nor,v_uv).xyz;
  vec3 alb = texture(tex_alb,v_uv).xyz;

  float li = phong(vec3(0.2,0.5,0.1), vec3(10.), pos, nor);
  vec3 col = li*alb;
  col = (col-0.5) * 1.5 + 0.5 + 0.;
  //col = col / (col+1.);
  //col = pow(col, vec3(1./2.2));
  color = vec4(col,1);
}
`
}
