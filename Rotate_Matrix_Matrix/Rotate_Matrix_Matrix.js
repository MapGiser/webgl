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
//全局变量的旋转角度
var angle_step=45.0;
function main(){

  //当前角度
  var currantangle=0.0;
  //创建Matrix（矩阵）对象  一个专门用来做旋转平移的矩阵库，包含在cuon-matrix.js中
  var x_formMatrix=new Matrix4();
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

  // 设置背景色
  gl.clearColor(0.0,0.0,0.0,1.0);
  // 清空canvas元素
  gl.clear(gl.COLOR_BUFFER_BIT);
  // 绘制三角形，其中n=3
  gl.drawArrays(gl.TRIANGLES,0,n);
  //定义调用函数
  var tick=function () {
      //获取实时的角度
      currantangle=animate(currantangle);
      //将gl对象，要绘制的顶点个数，以及旋转矩阵和定义的4x4旋转矩阵进行定义
      draw(gl,n,currantangle,x_formMatrix,u_Translation);
      //浏览器请求调用tick函数
      requestAnimationFrame(tick);


  }
    tick();
}
// 创建缓冲区并写入数据
function initVertexBuffers(gl){
  // 设置数据
  var vertics=new Float32Array([
    0.0,0.5,0.5,-0.5,-0.5,-0.5
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
//定义函数将变量和传给旋转矩阵，同时实时变换角度
function draw(gl,n,currantangle,modelMatrix,u_ModelMatrix) {
    //设置旋转角度和旋转轴
    modelMatrix.setRotate(currantangle,0,0,1);
    modelMatrix.translate(0.35,0,0);
    //给旋转矩阵赋值
    gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);
    //清空背景色
    gl.clear(gl.COLOR_BUFFER_BIT);
    //绘制三角形
    gl.drawArrays(gl.TRIANGLES,0,n);
}
//获取旋转之前的时间
var g_last=Date.now();
//用于计算旋转角度的函数
function animate(angle){
  var now=Date.now();
  var elpaped=now-g_last;
  g_last=now;

  var newAngle=angle+(angle_step*elpaped)/1000.0;
  return newAngle %= 360;
}