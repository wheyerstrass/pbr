import alb from "./assets/hull2/alb.png"
import nor from "./assets/hull2/nor.png"
import met from "./assets/hull2/met.png"
import ao from "./assets/hull2/ao.png"
import ruff from "./assets/hull2/ruff.png"

import pbr from "./src/engine.js"
import camera from "./src/cam.js"

import matrix from "./src/math/matrix.js"

/* 
 * create context */
const w = 1024
const h = 576

const canvas = document.getElementById("canvas")
canvas.width = w
canvas.height = h

const gl = canvas.getContext("webgl2", {premultipliedAlpha: false})
if(!gl) {
  console.error("Keine WebGL 2 Unterstützung")
  return
}

/*
 * gl settings */
//gl.enable(gl.DITHER)
gl.enable(gl.DEPTH_TEST)
gl.enable(gl.CULL_FACE)
gl.clearColor(0.2,0.2,0.2,1)

/*
 * cam */
let cam = camera(gl, w/h)
cam.fpsControls()
cam.pos[2] = 3

/*
 * init engine */
const engine = pbr(gl, w, h, cam)

/*
 * load assets */
//const {img,key} = engine.assets
//img("hull.alb", "./assets/hull/alb.png")

/*
 * load meshes */
engine.obj(
  engine.mesh.quad(3),
  matrix.translate([0,0,0]),
  {
    alb: alb,
    nor: nor,
    met: met,
    ao: ao,
    ruff: ruff,
  }
)

/*
 * start */
engine.start()
