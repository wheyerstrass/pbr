import vec3 from "./math/vec.js"

export default {

  cube: function(gl, prog, size) {
    gl.useProgram(prog)
    /*
     * data */
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    const l = size/2;
    let vb = [
      // front
      l,   l, l,
      -l, -l, l,
      l,  -l, l,
      l,   l, l,
      -l,  l, l,
      -l, -l, l,
      // back
      l,   l, -l,
      l,  -l, -l,
      -l, -l, -l,
      l,   l, -l,
      -l, -l, -l,
      -l,  l, -l,
      // left
      -l,  l, l,
      -l, -l, -l,
      -l, -l, l,
      -l,  l,  l,
      -l,  l, -l,
      -l, -l, -l,
      // right
      l,  l, l,
      l, -l, l,
      l, -l, -l,
      l,  l,  l,
      l, -l, -l,
      l,  l, -l,
      // top
      l,  l, l,
      l,  l, -l,
      -l, l, -l,
      l,  l, l,
      -l, l, -l,
      -l, l, l,
      // bot
      l, -l,  l,
      -l, -l, -l,
      l, -l, -l,
      l, -l,  l,
      -l, -l,  l,
      -l, -l, -l,
      // normals
      // front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      // back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      // left
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      // right
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      // top
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      // bot
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vb), gl.STATIC_DRAW)

    /*
     * vao */
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    /* 
     * pass normal to shader */
    const nor_loc = gl.getAttribLocation(prog, "nor")
    gl.enableVertexAttribArray(nor_loc)
    gl.vertexAttribPointer(nor_loc, 3, gl.FLOAT, false, 0, 3*4*6*6)
    /* 
     * pass position to shader */
    const pos_loc = gl.getAttribLocation(prog, "pos")
    gl.enableVertexAttribArray(pos_loc)
    gl.vertexAttribPointer(pos_loc, 3, gl.FLOAT, false, 0, 0)

    return {
      draw: function() {
        gl.bindVertexArray(vao)
        gl.drawArrays(gl.TRIANGLES, 0, 6*6)
      }
    }
  },

  quad: function(gl, prog) {
    gl.useProgram(prog)
    /*
     * data */
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    let vbuffer = [
      -1, -1, 0, 1,
       1, -1, 0, 1,
       1,  1, 0, 1,
       1,  1, 0, 1,
      -1,  1, 0, 1,
      -1, -1, 0, 1,
      // uv
      0, 0,
      1, 0,
      1, 1,
      1, 1,
      0, 1,
      0, 0,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vbuffer), gl.STATIC_DRAW)

    /*
     * vao */
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    /* 
     * pass position to shader */
    const pos_loc = gl.getAttribLocation(prog, "pos")
    gl.enableVertexAttribArray(pos_loc)
    gl.vertexAttribPointer(pos_loc, 4, gl.FLOAT, false, 0, 0)
    /* 
     * pass uv to shader */
    const uv_loc = gl.getAttribLocation(prog, "uv")
    gl.enableVertexAttribArray(uv_loc)
    gl.vertexAttribPointer(uv_loc, 2, gl.FLOAT, false, 0, 4*4*6)

    return {
      draw: function() {
        gl.bindVertexArray(vao)
        gl.drawArrays(gl.TRIANGLES, 0, 6*1)
      }
    }
  },

  grid: function(gl, prog, res) {
    gl.useProgram(prog)
    /*
     * data */
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    let vb = []
    const size = 1
    let s = size/res
    // positions
    for(let z=0; z<res; ++z) {
      for(let x=0; x<res; ++x) {
        // bottom left triangle
        vb.push(-size/2+x*s, 0, -size/2+z*s) // ul
        vb.push(-size/2+x*s, 0, -size/2+(z+1)*s) // bl
        vb.push(-size/2+(x+1)*s, 0, -size/2+(z+1)*s) // br
        // top right triangle
        vb.push(-size/2+x*s, 0, -size/2+z*s) // ul
        vb.push(-size/2+(x+1)*s, 0, -size/2+(z+1)*s) // br
        vb.push(-size/2+(x+1)*s, 0, -size/2+z*s) // tr
      }
    }
    // texcoords
    s = 1/res
    for(let v=0; v<res; ++v) {
      for(let u=0; u<res; ++u) {
        // bottom left triangle
        vb.push(0+u*s, 0+v*s) // ul
        vb.push(0+u*s, 0+(v+1)*s) // bl
        vb.push(0+(u+1)*s, 0+(v+1)*s) // br
        // top right triangle
        vb.push(0+u*s, 0+v*s) // ul
        vb.push(0+(u+1)*s, 0+(v+1)*s) // br
        vb.push(0+(u+1)*s, 0+v*s) // tr
      }
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vb), gl.STATIC_DRAW)

    /*
     * vao */
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    /* 
     * pass position to shader */
    const pos_loc = gl.getAttribLocation(prog, "pos")
    gl.enableVertexAttribArray(pos_loc)
    gl.vertexAttribPointer(pos_loc, 3, gl.FLOAT, false, 0, 0)
    /* 
     * pass uv to shader */
    const uv_loc = gl.getAttribLocation(prog, "uv")
    gl.enableVertexAttribArray(uv_loc)
    gl.vertexAttribPointer(uv_loc, 2, gl.FLOAT, false, 0, 3*4*6*res*res)

    return {
      draw: function() {
        gl.bindVertexArray(vao)
        gl.drawArrays(gl.TRIANGLES, 0, 6*res*res)
      }
    }
  },

  sphereOut: function(gl, prog, res) {
    gl.useProgram(prog)
    /*
     * data */
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    /*
     *  Icosaeder
     */
    const x = 0.52573111212
    const z = 0.85065080835 
    const v0 = [-x, 0, z]
    const v1 = [x, 0, z]
    const v2 = [-x, 0, -z]
    const v3 = [x, 0, -z]
    const v4 = [0, z, x]
    const v5 = [0, z, -x]
    const v6 = [0, -z, x]
    const v7 = [0, -z, -x]
    const v8 = [z, x, 0]
    const v9 = [-z, x, 0]
    const v10 = [z, -x, 0]
    const v11 = [-z, -x, 0]

    const lvl0 = [
      ...v0,...v1,...v4,
      ...v0,...v4,...v9,
      ...v9,...v4,...v5,
      ...v4,...v8,...v5,
      ...v4,...v1,...v8,
      ...v8,...v1,...v10,
      ...v8,...v10,...v3,
      ...v5,...v8,...v3,
      ...v5,...v3,...v2,
      ...v2,...v3,...v7,
      ...v7,...v3,...v10,
      ...v7,...v10,...v6,
      ...v7,...v6,...v11,
      ...v11,...v6,...v0,
      ...v0,...v6,...v1,
      ...v6,...v10,...v1,
      ...v9,...v11,...v0,
      ...v9,...v2,...v11,
      ...v9,...v5,...v2,
      ...v7,...v11,...v2,
    ]

    /* 1 triangle in -> 4 triangles out */
    const {sum, scale, norm} = vec3
    const tess = function([
      p1, p2, p3,
      p4, p5, p6,
      p7, p8, p9
    ]) {
      const m1p = scale(0.5, sum([p1,p2,p3], [p4,p5,p6]))
      const m2p = scale(0.5, sum([p4,p5,p6], [p7,p8,p9]))
      const m3p = scale(0.5, sum([p7,p8,p9], [p1,p2,p3]))
      return [
        p1,p2,p3, ...m1p, ...m3p,
        ...m1p, p4,p5,p6, ...m2p,
        ...m3p, ...m2p, p7,p8,p9,
        ...m1p, ...m2p, ...m3p
      ]
    }
    let lvli = [...lvl0]
    let lvln = []
    for(let lvl=0; lvl<res; ++lvl) {
      for(let l=0; l<lvli.length; l+=9) {
        lvln.push(...tess([
          lvli[l+0], lvli[l+1], lvli[l+2],
          lvli[l+3], lvli[l+4], lvli[l+5],
          lvli[l+6], lvli[l+7], lvli[l+8]
        ]))
      }
      lvli = [...lvln]
      lvln = []
    }
    let vb = []
    for(let l=0; l<lvli.length; l+=3) {
      vb.push(...scale(1, norm([lvli[l+0], lvli[l+1], lvli[l+2]])))
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vb), gl.STATIC_DRAW)
    /*
     * vao */
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    /* 
     * pass position to shader */
    const pos_loc = gl.getAttribLocation(prog, "pos")
    gl.enableVertexAttribArray(pos_loc)
    gl.vertexAttribPointer(pos_loc, 3, gl.FLOAT, false, 0, 0)
    /* 
     * pass normal to shader */
    const nor_loc = gl.getAttribLocation(prog, "nor")
    gl.enableVertexAttribArray(nor_loc)
    gl.vertexAttribPointer(nor_loc, 3, gl.FLOAT, false, 0, 0)

    return {
      draw: function() {
        gl.bindVertexArray(vao)
        gl.drawArrays(gl.TRIANGLES, 0, vb.length/3)
      }
    }
  },

  sphereIn: function(gl, prog, res) {
    gl.useProgram(prog)
    /*
     * data */
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    /*
     *  Icosaeder
     */
    const x = 0.52573111212
    const z = 0.85065080835 
    const v0 = [-x, 0, z]
    const v1 = [x, 0, z]
    const v2 = [-x, 0, -z]
    const v3 = [x, 0, -z]
    const v4 = [0, z, x]
    const v5 = [0, z, -x]
    const v6 = [0, -z, x]
    const v7 = [0, -z, -x]
    const v8 = [z, x, 0]
    const v9 = [-z, x, 0]
    const v10 = [z, -x, 0]
    const v11 = [-z, -x, 0]

    const lvl0 = [
      ...v0,...v4,...v1,
      ...v0,...v9,...v4,
      ...v9,...v5,...v4,
      ...v4,...v5,...v8,
      ...v4,...v8,...v1,
      ...v8,...v10,...v1,
      ...v8,...v3,...v10,
      ...v5,...v3,...v8,
      ...v5,...v2,...v3,
      ...v2,...v7,...v3,
      ...v7,...v10,...v3,
      ...v7,...v6,...v10,
      ...v7,...v11,...v6,
      ...v11,...v0,...v6,
      ...v0,...v1,...v6,
      ...v6,...v1,...v10,
      ...v9,...v0,...v11,
      ...v9,...v11,...v2,
      ...v9,...v2,...v5,
      ...v7,...v2,...v11,
    ]

    /* 1 triangle in -> 4 triangles out */
    const {sum, scale, norm} = vec3
    const tess = function([
      p1, p2, p3,
      p4, p5, p6,
      p7, p8, p9
    ]) {
      const m1p = scale(0.5, sum([p1,p2,p3], [p4,p5,p6]))
      const m2p = scale(0.5, sum([p4,p5,p6], [p7,p8,p9]))
      const m3p = scale(0.5, sum([p7,p8,p9], [p1,p2,p3]))
      return [
        p1,p2,p3, ...m1p, ...m3p,
        ...m1p, p4,p5,p6, ...m2p,
        ...m3p, ...m2p, p7,p8,p9,
        ...m1p, ...m2p, ...m3p
      ]
    }
    let lvli = [...lvl0]
    let lvln = []
    for(let lvl=0; lvl<res; ++lvl) {
      for(let l=0; l<lvli.length; l+=9) {
        lvln.push(...tess([
          lvli[l+0], lvli[l+1], lvli[l+2],
          lvli[l+3], lvli[l+4], lvli[l+5],
          lvli[l+6], lvli[l+7], lvli[l+8]
        ]))
      }
      lvli = [...lvln]
      lvln = []
    }
    let vb = []
    for(let l=0; l<lvli.length; l+=3) {
      vb.push(...scale(1, norm([lvli[l+0], lvli[l+1], lvli[l+2]])))
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vb), gl.STATIC_DRAW)

    /*
     * vao */
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    /* 
     * pass position to shader */
    const pos_loc = gl.getAttribLocation(prog, "pos")
    gl.enableVertexAttribArray(pos_loc)
    gl.vertexAttribPointer(pos_loc, 3, gl.FLOAT, false, 0, 0)

    return {
      draw: function() {
        gl.bindVertexArray(vao)
        gl.drawArrays(gl.TRIANGLES, 0, vb.length/3)
      }
    }
  },

  tube: function(gl, prog, length, r0, r1, res) {
    gl.useProgram(prog)
    /*
     * data */
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    let verts = []
    const xy = (a,r) => [r*Math.cos(a), r*Math.sin(a)]
    const angle = (i) => (2*Math.PI/res * i)
    const z0 = length/2
    const z1 = -length/2
    for(let i=0; i<res; ++i) {
      // inner coords
      const [x0,y0] = xy(angle(i),r0)
      const [x1,y1] = xy(angle(i+1),r0)
      // outer coords
      const [X0,Y0] = xy(angle(i),r1)
      const [X1,Y1] = xy(angle(i+1),r1)
      // front face
      verts.push(x0, y0, z0)
      verts.push(x1, y1, z0)
      verts.push(X1, Y1, z0)
      //
      verts.push(x0, y0, z0)
      verts.push(X1, Y1, z0)
      verts.push(X0, Y0, z0)
      // inner face
      verts.push(x0, y0, z0)
      verts.push(x0, y0, z1)
      verts.push(x1, y1, z0)
      //
      verts.push(x0, y0, z1)
      verts.push(x1, y1, z1)
      verts.push(x1, y1, z0)
      // outer face
      verts.push(X0, Y0, z0)
      verts.push(X1, Y1, z1)
      verts.push(X0, Y0, z1)
      //
      verts.push(X0, Y0, z0)
      verts.push(X1, Y1, z0)
      verts.push(X1, Y1, z1)
      // back face
      verts.push(x0, y0, z1)
      verts.push(X1, Y1, z1)
      verts.push(x1, y1, z1)
      //
      verts.push(x0, y0, z1)
      verts.push(X0, Y0, z1)
      verts.push(X1, Y1, z1)
    }
    // uv
    for(let i=0; i<res; ++i) {
      // front face
      verts.push(1,1)
      verts.push(0,1)
      verts.push(0,0)
      //
      verts.push(1,1)
      verts.push(0,0)
      verts.push(1,0)
      // inner face
      verts.push(1,1)
      verts.push(0,1)
      verts.push(1,0)
      //
      verts.push(0,1)
      verts.push(0,0)
      verts.push(1,0)
      // outer face
      verts.push(0,1)
      verts.push(1,0)
      verts.push(1,1)
      //
      verts.push(0,1)
      verts.push(0,0)
      verts.push(1,0)
      // back face
      verts.push(0,1)
      verts.push(1,0)
      verts.push(1,1)
      //
      verts.push(0,1)
      verts.push(0,0)
      verts.push(1,0)
    }
    for(let i=0; i<res; ++i) {
      // inner coords
      const [x0,y0] = xy(angle(i),r0)
      const [x1,y1] = xy(angle(i+1),r0)
      // outer coords
      const [X0,Y0] = xy(angle(i),r1)
      const [X1,Y1] = xy(angle(i+1),r1)
      // front face
      verts.push(0,0,1)
      verts.push(0,0,1)
      verts.push(0,0,1)
      //
      verts.push(0,0,1)
      verts.push(0,0,1)
      verts.push(0,0,1)
      // inner face
      verts.push(-x0,-y0,0)
      verts.push(-x0,-y0,0)
      verts.push(-x1,-y1,0)
      //
      verts.push(-x0,-y0,0)
      verts.push(-x1,-y1,0)
      verts.push(-x1,-y1,0)
      // outer face
      verts.push(X0,Y0,0)
      verts.push(X1,Y1,0)
      verts.push(X0,Y0,0)
      //
      verts.push(X0,Y0,0)
      verts.push(X1,Y1,0)
      verts.push(X1,Y1,0)
      // back face
      verts.push(0,0,-1)
      verts.push(0,0,-1)
      verts.push(0,0,-1)
      //
      verts.push(0,0,-1)
      verts.push(0,0,-1)
      verts.push(0,0,-1)
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW)

    /*
     * vao */
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    /* 
     * pass position to shader */
    const pos_loc = gl.getAttribLocation(prog, "pos")
    gl.enableVertexAttribArray(pos_loc)
    gl.vertexAttribPointer(pos_loc, 3, gl.FLOAT, false, 0, 0)
    /* 
     * pass uv to shader */
    const uv_loc = gl.getAttribLocation(prog, "uv")
    gl.enableVertexAttribArray(uv_loc)
    gl.vertexAttribPointer(uv_loc, 2, gl.FLOAT, false, 0, 4*8*9*res)
    /* 
     * pass uv to shader */
    const nor_loc = gl.getAttribLocation(prog, "nor")
    gl.enableVertexAttribArray(nor_loc)
    gl.vertexAttribPointer(nor_loc, 3, gl.FLOAT, false, 0, (6+9)*4*8*res)

    return {
      draw: function() {
        gl.bindVertexArray(vao)
        gl.drawArrays(gl.TRIANGLES, 0, 3*8*res)
      }
    }
  },

  /*
   * buffers [{
   *  name: "pos", data: [...], stride: 3
   * }]
   */
  staticInstanced: function(gl, prog, attribs, verts, insts) {
    gl.useProgram(prog)
    /*
     * vao */
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    /* 
     * updload buffers */
    attribs.forEach(({name,data,stride,div}) => {
      /* vbo */
      const vbo = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
      /* data */
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
      const loc = gl.getAttribLocation(prog, name)
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, stride, gl.FLOAT, false, 0, 0)
      gl.vertexAttribDivisor(loc, div)
    })

    return {
      draw: function() {
        gl.useProgram(prog)
        gl.bindVertexArray(vao)
        gl.drawArraysInstanced(gl.TRIANGLES, 0, verts, insts)
      }
    }
  }
}
