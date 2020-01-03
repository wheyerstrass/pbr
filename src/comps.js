import vec from "@/vec.js"
import quat from "@/quat.js"
import matrix from "@/matrix.js"
import math from "@/math.js"

const base_up = [0,1,0]
const base_right = [1,0,0]
const base_forward = [0,0,-1]

const {sign,abs} = Math

export default {

  rigidbody(target) {
    target.pos = [0,0,0]
    target.pos_t = [0,0,0]
    target.vel = [0,0,0]

    target.size = [1,1,1]
    target.size_t = [1,1,1]

    target.rota = [1,0,0,0] // current rotation
    target.rota_t = [1,0,0,0] // target rotation
    target.torq = [0,0,0]

    target.up = [...base_up]
    target.right = [...base_up]
    target.forward = [...base_forward]

    target.addRota = function(angle, [ax,ay,az]) {
      if(angle===0) return
      const s = sign(angle)
      const val = abs(angle)
      target.rota_t = quat.mult(target.rota_t, quat.q(val,s*ax,s*ay,s*az))
    }
    target.update = function(dt, th) {
      /*
       * update size */
      target.size[0] += math.lint(target.size[0], target.size_t[0], dt, th)
      target.size[1] += math.lint(target.size[1], target.size_t[1], dt, th)
      target.size[2] += math.lint(target.size[2], target.size_t[2], dt, th)
      /*
       * update rotation */
      target.addRota(target.torq[0], target.right)
      target.addRota(target.torq[1], target.up)
      target.addRota(target.torq[2], target.forward)
      //
      const _q = quat.slerp(target.rota, target.rota_t, dt)
      target.rota[0] = _q[0]
      target.rota[1] = _q[1]
      target.rota[2] = _q[2]
      target.rota[3] = _q[3]
      //
      const rota_mat = quat.mat(target.rota)
      target.up = vec.norm(matrix.mult3(rota_mat, base_up))
      target.right = vec.norm(matrix.mult3(rota_mat, base_right))
      target.forward = vec.norm(matrix.mult3(rota_mat, base_forward))
      /*
       * update position */
      const {up,right,forward,vel} = target
      target.pos_t[0] += right[0]*vel[0] + up[0]*vel[1] + forward[0]*vel[2]
      target.pos[0] += math.lint(target.pos[0], target.pos_t[0], dt, th)
      //
      target.pos_t[1] += right[1]*vel[0] + up[1]*vel[1] + forward[1]*vel[2]
      target.pos[1] += math.lint(target.pos[1], target.pos_t[1], dt, th)
      //
      target.pos_t[2] += right[2]*vel[0] + up[2]*vel[1] + forward[2]*vel[2]
      target.pos[2] += math.lint(target.pos[2], target.pos_t[2], dt, th)
    }
    target.getTrans = function() {
      return matrix.translate(target.pos)
    }
    target.getRota = function() {
      return quat.mat(quat.inv(target.rota))
    }
    target.getScale = function() {
      return matrix.scale(target.size)
    }
    target.setRotaT = function([x,y,z,w]) {
      target.rota_t[0] = x
      target.rota_t[1] = y
      target.rota_t[2] = z
      target.rota_t[3] = w
    }
  },

  billboard(target, ref) {
    target.pos = [0,0,0]
    target.size = [1,1,1]

    target.update = function() {
    }
    target.getTrans = function() {
      return matrix.translate(target.pos)
    }
    target.getRota = function() {
      return matrix.transpose(matrix.lookat(target.pos, ref.pos, ref.up))
    }
    target.getScale = function() {
      return matrix.scale(target.size)
    }
  },

  dummy(target) {
    target.update = ()=>{}
    target.getTrans = ()=>{}
    target.getRota = ()=>{}
    target.getScale = ()=>{}
  }
}
