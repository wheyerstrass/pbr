export default {

  axis_angle(axis, angle) {
    return this.q(angle,...axis)
  },

  q(w,x,y,z) {
    const {PI, cos, sin} = Math
    const t = w * PI/180/2
    const sint = sin(t)
    return [cos(t), sint*x, sint*y, sint*z]
  },

  mult([q0,q1,q2,q3], [r0,r1,r2,r3]) {
    return [
      r0*q0 - r1*q1 - r2*q2 - r3*q3,
      r0*q1 + r1*q0 - r2*q3 + r3*q2,
      r0*q2 + r1*q3 + r2*q0 - r3*q1,
      r0*q3 - r1*q2 + r2*q1 + r3*q0,
    ]
  },

  norm([q0,q1,q2,q3]) {
    const l = Math.abs(q0*q0 + q1*q1 + q2*q2 + q3*q3)
    return [q0/l, q1/l, q2/l, q3/l]
  },

  mat(_q) {
    const [q0,q1,q2,q3] = this.norm(_q)

    const xx = q1*q1
    const yy = q2*q2
    const zz = q3*q3

    const xy = q1*q2
    const xz = q1*q3
    const wx = q0*q1
    const wy = q0*q2
    const wz = q0*q3
    const yz = q2*q3

    return [
      1-2*(yy+zz), 2*(xy+wz), 2*(xz-wy), 0,
      2*(xy-wz), 1-2*(xx+zz), 2*(yz+wx), 0,
      2*(xz+wy), 2*(yz-wx), 1-2*(xx+yy), 0,
      0, 0, 0, 1
    ]
  },

  inv([q0,q1,q2,q3]) {
    return [q0, -q1, -q2, -q3]
  },

  dot([q00,q01,q02,q03], [q10,q11,q12,q13]) {
    return q00*q10 + q01*q11 + q02*q12 + q03*q13
  },

  slerp(q1, q2, t) {
    let dot = this.dot(q1, q2)

    let _q1 = [...q1]
    if(dot < 0) {
      _q1[0] *= -1
      _q1[1] *= -1
      _q1[2] *= -1
      _q1[3] *= -1
      dot = this.dot(q1, q2)
    }

    if(Math.abs(dot) >= 1)
      return _q1

    const sino = Math.sqrt(1-dot*dot)
    if(Math.abs(sino) <= 0.001) {
      return [
        (1-t)*_q1[0] + t*q2[0],
        (1-t)*_q1[1] + t*q2[1],
        (1-t)*_q1[2] + t*q2[2],
        (1-t)*_q1[3] + t*q2[3],
      ]
    }

    const omega = Math.acos(dot)
    const a = Math.sin((1-t)*omega)
    const b = Math.sin(t*omega)
    return [
      (_q1[0]*a + q2[0]*b) / sino,
      (_q1[1]*a + q2[1]*b) / sino,
      (_q1[2]*a + q2[2]*b) / sino,
      (_q1[3]*a + q2[3]*b) / sino,
    ]
  }
}
