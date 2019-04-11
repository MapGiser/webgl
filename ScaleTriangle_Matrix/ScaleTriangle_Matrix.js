// 顶点着色器
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_Translation;\n'+//设置旋转矩阵变量4x4
    'void main() {\n' +
    '   gl_Position = u_Translation*a_Position;\n' +
    '}\n';

// 片源着色器
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' + // uniform变量
    'uniform vec4 u_TrsColor;\n' +
    'void main() {\n' +
    '   gl_FragColor=u_FragColor+u_TrsColor;\n' +//u_FragColor如果不赋值，默认颜色为白色
    '}\n';
function main(){
  //设置旋转角度
  var ANGLE=90.0;
  //转为弧度制
  var RADIUS=Math.PI*ANGLE/180.0;
  //正弦
  var SINB=Math.sin(RADIUS);
  //余弦
  var COSB=Math.cos(RADIUS);
  //设置旋转矩阵的参数X=x*COSB-y*SINB+0+0     Y=x*SINB+y*COSB+0+0   webgl中的矩阵为列主序
  var x_Translation=new Float32Array([
      1.5,0.0,0.0,0.0,
      0.0,1.0,0.0,0.0,
      0.0,0.0,1.0,0.0,
      0.0,0.0,0.0,1.0
  ])
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
  //获取定义的变量（矩阵分量）
  var u_Translation=gl.getUniformLocation(gl.program,'u_Translation');
  if(u_Translation<0){
      console.log('Failed to get the unform location');
      return u_Translation;
  }
  //给矩阵变量赋值（之前设置的值）
  gl.uniformMatrix4fv(u_Translation,false,x_Translation);
  
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
    0.5,-0.5,0.0,0.5,-0.5,-0.5
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


  //获取片元着色器变量的位置
  var u_FragColor=gl.getUniformLocation(gl.program,'u_FragColor');
  if(u_FragColor<0){
      console.log('Failed to get the unform location');
      return u_FragColor;
  }
  //赋值
  gl.uniform4f(u_FragColor,0.5,0.5,0.1,1.0);

    //获取片元着色器变量的位置
  var u_TrsColor=gl.getUniformLocation(gl.program,'u_TrsColor');
  if(u_TrsColor<0){
      console.log('Failed to get the unform location');
      return u_FragColor;
  }
  //赋值
  gl.uniform4f(u_TrsColor,0.15,0.3,0.4,0.0);
  // 将数据写入缓冲区对象中
  gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
  // 开启缓冲区对象
  gl.enableVertexAttribArray(a_Position);
  // 返回顶点数目
  return n;
}
