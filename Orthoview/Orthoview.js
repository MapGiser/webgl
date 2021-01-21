//顶点着色器程序
var VSHADER_SOURCE =
  'attribute vec4 a_Position;' +
  'attribute vec4 a_Color;' +
  'uniform mat4 u_ProjMatrix;' +
  'varying vec4 v_Color;' +
  'void main(){' +
  'gl_Position = u_ProjMatrix * a_Position;' +
  'v_Color = a_Color;' +
  '}';

//片元着色器程序
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;' +
  'void main() {' +
  'gl_FragColor = v_Color;' +
  '}';

function main() {
  //获取canvas元素
  var canvas = document.getElementById("webgl");
  if (!canvas) {
    console.log("Failed to retrieve the <canvas> element");
    return;
  }

  //获取 nearFar 元素
  var nf = document.getElementById("nearFar");
  if (!nf) {
    console.log("Failed to retrieve the <nf> element");
    return;
  }

  //获取WebGL绘图上下文
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  //初始化着色器
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to initialize shaders.");
    return;
  }

  //设置顶点位置
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  //指定清空<canvas>颜色
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  //获取 u_ViewMatrix 变量的存储位置
  var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  if (u_ProjMatrix < 0) {
    console.log("Failed to get the storage location of u_ProjMatrix");
    return;
  }

  //设置视点、视线和上方向
  var projMatrix = new Matrix4();
  // 注册键盘事件响应函数
  document.onkeydown = function (ev) {
    keydown(ev, gl, n, u_ProjMatrix, projMatrix, nf);
  };

  draw(gl, n, u_ProjMatrix, projMatrix, nf);

}

function initVertexBuffers(gl) {
  var verticesColors = new Float32Array([
    0.0, 0.6, -0.4, 0.4, 1.0, 0.4,              //绿色三角形在最后面
    -0.5, -0.4, -0.4, 0.4, 1.0, 0.4,
    0.5, -0.4, -0.4, 1.0, 0.4, 0.4,

    0.5, 0.4, -0.2, 1.0, 0.4, 0.4,              //黄色三角形在中间
    -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
    0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

    0.0, 0.5, 0.0, 0.4, 0.4, 1.0,                  //蓝色三角形在最前面
    -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
    0.5, -0.5, 0.0, 1.0, 0.4, 0.4
  ]);
  var n = 9; //点的个数

  //创建缓冲区对象
  var vertexColorBuffer = gl.createBuffer();
  if (!vertexColorBuffer) {
    console.log("Failed to create thie buffer object");
    return -1;
  }

  //将缓冲区对象保存到目标上
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);

  //向缓存对象写入数据
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return -1;
  }

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Color < 0) {
    console.log("Failed to get the storage location of a_Color");
    return -1;
  }

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}

var g_near = 0.0, g_far = 0.5;
function draw(gl, n, u_ProjMatrix, projMatrix, nf) {
  //使用矩阵设置可视空间
  projMatrix.setOrtho(-1, 1, -1, 1, g_near, g_far);

  //将投影矩阵传递给 u_ProjMatrix 变量
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT);

  nf.innerHTML = "near:" + Math.round(g_near * 100) / 100 + ",far:" + Math.round(g_far * 100) / 100;

  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function keydown(ev, gl, n, u_ProjMatrix, projMatrix, nf) {
  switch (ev.keyCode) {
    case 39: g_near += 0.01; break;  //右
    case 37: g_near -= 0.01; break;  //左
    case 38: g_far += 0.01; break;  //上
    case 40: g_far -= 0.01; break;  //下
    default: return;
  }

  draw(gl, n, u_ProjMatrix, projMatrix, nf);
}