// 顶点着色器
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_ViewMatrix;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '   gl_Position = u_ViewMatrix*u_ModelMatrix*a_Position;\n' +
    '   v_Color=a_Color;\n'+
    '}\n';

// 片源着色器
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' + // uniform变量
    'void main() {\n' +
    '   gl_FragColor=v_Color;\n' +//u_FragColor如果不赋值，默认颜色为白色
    '}\n';

function main () {
  var canvas = document.getElementById('webgl');

  var gl = getWebGLContext(canvas);

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Fail to initlise shaders');
    return;
  }

  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }
 var u_ModelMatrix=gl.getUniformLocation(gl.program,'u_ModelMatrix');
  //定义模型矩阵并进行赋值
  var modelMatrix=new Matrix4();
  // 绕z轴顺时针旋转10弧度
  modelMatrix.setRotate(-20, 0, 0, 1);
  // 将变量传递给u_ModelMatrix
  gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);
  // 获取视图矩阵的地址
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  // 定义视图矩阵并进行赋值
  var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(-0.2, 0.0, 0.25, 0, 0, -1, 1, 0, 0);
  // 为视图矩阵进行
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

// 创建缓冲区并写入数据
function initVertexBuffers (gl) {
  // 设置数据
  var vertics = new Float32Array([
    0.5, 0.0, -0.4, 0.0,1.0,0.0,//绿色三角形
    -0.5, 0.0, -0.4, 0.0,1.0,0.0,
    0.0, 0.5, -0.4, 0.0,1.0,0.0,

    0.6, 0.0, -0.3, 0.0, 0.0, 1.0,//黄色三角形
    -0.6, -0.0, -0.3, 0.0, 0.0, 1.0,
    -0.1, 0.5, -0.3, 0.0, 0.0, 1.0,

    0.7, 0.0, 0.0, 0.4, 0.0, 0.0,//蓝色三角形
    -0.7, -0.0, 0.0, 0.4, 0.0, 0.0,
    -0.3, 0.5, 0.0, 0.4, 0.0, 0.0
  ])
  // 设置点的数目
  var n = 9;
  // 创建缓冲区对象
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1
  }
  // 绑定缓冲区对象
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // 向缓冲区写入数据
  gl.bufferData(gl.ARRAY_BUFFER, vertics, gl.STATIC_DRAW);

  var FSIZE = vertics.BYTES_PER_ELEMENT;
  // 在缓冲区对象中获取变量的地址
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a position');
  }
  // 将数据写入缓冲区对象中
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
  // 开启缓冲区对象
  gl.enableVertexAttribArray(a_Color);
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Color < 0) {
    console.log('Failed to get the storage location of a position');
  }
  // 将数据写入缓冲区对象中
  gl.vertexAttribPointer(a_Color, 2, gl.FLOAT, false, FSIZE * 3, FSIZE * 3);
  // 开启缓冲区对象
  gl.enableVertexAttribArray(a_Color);
  // 返回顶点数目
  return n
}
