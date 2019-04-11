// 顶点着色器
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    '   gl_Position = a_Position;\n' +
    '}\n';

// 片源着色器
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' + // uniform变量
    'void main() {\n' +
    '   gl_FragColor=vec4(0.0,1.0,0.1,0.5);\n' +//u_FragColor如果不赋值，默认颜色为白色
    '}\n';
function main(){
  // 获取canvas元素
  var canvas=document.getElementById('webgl');
  // 获取绘图上下文
  var gl=getWebGLContext(canvas);
  // 初始化顶点着色器和片元着色器
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders');
    return;
  }
  // 获取顶点数目
  var n =initVertexBuffers(gl);
  if(n<0){
    console.log('Failed to set the positions of the vertices')
  }
  
  // 设置背景色
  gl.clearColor(0.0,0.0,0.0,1.0);
  // 清空canvas元素
  gl.clear(gl.COLOR_BUFFER_BIT);
  // 绘制三角形，其中n=3
  gl.drawArrays(gl.TRIANGLES,0,n);

}
// 创建缓冲区并写入数据
function initVertexBuffers(gl){
  // 设置数据
  var vertics=new Float32Array([
    0.0,0.5,-0.5,-0.5,0.5,-0.5
  ]);
  // 设置点的数目
  var n=3;
  // 创建缓冲区对象
  var vertexBuffer=gl.createBuffer();
  if(!vertexBuffer){
    console.log('Failed to create the buffer object');
    return -1;
  }
  // 绑定缓冲区对象
  gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
  // 向缓冲区写入数据
  gl.bufferData(gl.ARRAY_BUFFER,vertics,gl.STATIC_DRAW);
  // 在缓冲区对象中获取变量的地址
  var a_Position=gl.getAttribLocation(gl.program,'a_Position');
  if(a_Position<0){
    console.log('Failed to get the storage location of a position');
    return a_Position;
  }
  // 将数据写入缓冲区对象中
  gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
  // 开启缓冲区对象
  gl.enableVertexAttribArray(a_Position)
  // 返回顶点数目
  return n;
}
