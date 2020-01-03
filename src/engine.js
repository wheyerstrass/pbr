import assets from "./assets.js"
import shader from "./shader.js"
import meshes from "./mesh.js"

import geopass from "./geo-pass.glsl.js"
import lightpass from "./light-pass.glsl.js"

import glsl_funcs from "./glsl"

const shader_template = (uniforms, usercode) =>
`#version 300 es
precision mediump float;

${glsl_funcs}

${uniforms}

${usercode}
`

function _pass(gl, shader_prog, uniforms) {
  const _uninames = uniforms.map(u => u.split(" ")[1])
  const _unis = uniforms.reduce((all,u) => `${all}\nuniform ${u};`, "")
  let vert_shader = shader_template(_unis, shader_prog.vert)
  let frag_shader = shader_template(_unis, shader_prog.frag)
  return shader.prog(gl, vert_shader, frag_shader, _uninames)
}

export default function(gl, w, h, cam) {

  console.log("started pbr engine")
  // list extensions
  //console.log(gl.getSupportedExtensions())

  /*
   * add extensions */
  gl.getExtension("EXT_color_buffer_float")

  /*
   * gbuffer */
  const gbuffer = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, gbuffer)
  /* 
   * position attachment */
  const pos_tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, pos_tex)
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA16F, w,h,0, gl.RGBA, gl.HALF_FLOAT,null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  gl.framebufferTexture2D(gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, pos_tex, 0)
  /*
   * normal attachment */
  const nor_tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, nor_tex)
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA16F, w,h,0, gl.RGBA, gl.HALF_FLOAT,null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  gl.framebufferTexture2D(gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, nor_tex, 0)
  /*
   * albedo attachment */
  const alb_tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, alb_tex)
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB, w,h, 0, gl.RGB,gl.UNSIGNED_BYTE, null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  gl.framebufferTexture2D(gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT2, gl.TEXTURE_2D, alb_tex, 0)

  /* set which buffers to draw/render to */
  gl.drawBuffers([
    gl.COLOR_ATTACHMENT0,
    gl.COLOR_ATTACHMENT1,
    gl.COLOR_ATTACHMENT2
  ])

  /*
   * depth attachment */
  const depth_tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, depth_tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, w, h, 0,
    gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  gl.framebufferTexture2D(gl.FRAMEBUFFER,
    gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depth_tex, 0)

  if(!gl.checkFramebufferStatus(gl.FRAMEBUFFER)) {
    console.error("framebuffer setup failed")
  }

  const {
    id: g_id, locs: g_locs, objs: g_objs, models: g_models, mats: g_mats
  } = _pass(gl, geopass, [
    "mat4 P", "mat4 view",
    "mat4 model",
  ])

  const _mat_to_texarr = ({alb, nor, met, ao, ruff}) => ({
    alb: shader.tex2d(gl, g_id, 0, g_locs["tex_alb"], alb),
    nor: shader.tex2d(gl, g_id, 1, g_locs["tex_nor"], nor),
    met: shader.tex2d(gl, g_id, 2, g_locs["tex_met"], met),
    ao: shader.tex2d(gl, g_id, 3, g_locs["tex_ao"], ao),
    ruff: shader.tex2d(gl, g_id, 4, g_locs["tex_ruff"], ruff),
  })

  const obj = (mesh, model, mat) => {
    g_objs.push(mesh)
    g_models.push(model)
    g_mats.push(_mat_to_texarr(mat))
  }

  const { id: l_id, locs: l_locs } =_pass(gl, lightpass, [
    "mat4 P", "mat4 view",
    "mat4 model",

    "sampler2D tex_pos",
    "sampler2D tex_nor",
    "sampler2D tex_alb",
    "sampler2D tex_depth",
  ])
  const _lightpass_quad = meshes.quad(gl, l_id)

  const render = (ts) => {
    // geopass
    gl.bindFramebuffer(gl.FRAMEBUFFER, gbuffer)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(g_id)
    gl.uniformMatrix4fv(g_locs["P"], false, cam.perspective())
    gl.uniformMatrix4fv(g_locs["view"], false, cam.view())
    for(let i=0; i<g_objs.length; ++i) {
      gl.uniformMatrix4fv(g_locs["model"], false, g_models[i])
      g_objs[i].draw()
    }

    // lighting pass
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(l_id)

    // bind position
    gl.activeTexture(gl.TEXTURE0+0)
    gl.uniform1i(l_locs["tex_pos"], 0)
    gl.bindTexture(gl.TEXTURE_2D, pos_tex)
    // bind normal
    gl.activeTexture(gl.TEXTURE0+1)
    gl.uniform1i(l_locs["tex_nor"], 1)
    gl.bindTexture(gl.TEXTURE_2D, nor_tex)
    // bind albedo
    gl.activeTexture(gl.TEXTURE0+2)
    gl.uniform1i(l_locs["tex_alb"], 2)
    gl.bindTexture(gl.TEXTURE_2D, alb_tex)
    // bind depth
    gl.activeTexture(gl.TEXTURE0+3)
    gl.uniform1i(l_locs["tex_depth"], 3)
    gl.bindTexture(gl.TEXTURE_2D, depth_tex)
    // draw
    _lightpass_quad.draw()

    // render next frame
    requestAnimationFrame(render)
  }

  const start = () => {
    if(assets.ready())
      return start()
    return requestAnimationFrame(render)
  }

  return {
    //gbuffer,
    obj,
    assets,
    mesh: {
      sphereOut: (res) => meshes.sphereOut(gl, g_id, res)
    },
    start
  }
}
