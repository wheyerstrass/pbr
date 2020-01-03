import fog from "./fog.glsl.js"
import phong from "./phong.glsl.js"
import triplanar from "./triplanar.glsl.js"
import misc from "./misc.glsl.js"
import pbr from "./pbr.glsl.js"

const merge = (...fs) => fs.reduce((all,f) => all.concat(f, " "), "")

export default merge(
  fog, phong, triplanar, misc, pbr
)

