export default {
  vert:
`
in vec2 uv;
in vec4 pos;
in vec4 nor;

out vec2 v_uv;
out vec4 v_pos;
out vec4 v_nor;

void main() {

  mat4 VM = view * model;

  v_uv = uv;
  v_pos = VM * pos;
  v_nor = VM * vec4(nor.xyz,0);
  gl_Position = P * v_pos;
}
`,

  frag:
`
in vec2 v_uv;
in vec4 v_pos;
in vec4 v_nor;

layout(location=0) out vec4 g_pos;

layout(location=1) out vec4 g_nor;
layout(location=2) out vec4 g_alb;
layout(location=3) out vec4 g_ao;
layout(location=4) out vec4 g_met;
layout(location=5) out vec4 g_ruff;

void main() {
  g_pos = v_pos;

  g_nor = texture(tex_nor,v_uv);
  g_alb = texture(tex_alb,v_uv);
  g_ao = texture(tex_ao,v_uv);
  g_met = texture(tex_met,v_uv);
  g_ruff = texture(tex_ruff,v_uv);
}
`
}
