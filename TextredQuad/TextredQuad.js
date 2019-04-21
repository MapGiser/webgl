// 顶点着色器
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +//定义顶点的位置 vec4类型
    'attribute vec2 a_TextCoord;\n' +//定义vec2类型的attribute变量
    'varying vec2 v_TextCoord;\n' +//定义vec2类型的varying变量----用于给片元着色器传值
    'void main() {\n' +
    '   gl_Position = a_Position;\n' +//将定点数据传给缓冲区变量
    '   v_TextCoord = a_TextCoord;\n' +//将纹理坐标传给缓冲区纹理对象
    '}\n';
// 片源着色器
var FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform sampler2D u_Sample;\n' +//定义uniform类型变量
    'varying vec2 v_TextCoord;\n' +//定义vec2类型的varying变量----用于接受顶点着色器的值
    'void main() {\n' +
    '  gl_FragColor = texture2D(u_Sample, v_TextCoord);\n' +//将变量值传给片元着色器
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
  //初始化纹理
  if (!initTextures(gl, n)) {
    console.log('Failed to intialize the texture.');
    return;
  }
}
// 创建缓冲区并写入数据
function initVertexBuffers(gl){
  // 设置数据------包括定点坐标和纹理坐标
  var vertics=new Float32Array([
    -0.5, 0.5, -0.3, 1.2,
    -1.0, -1.0, 0.0, 0.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, -1.0, 1.0, 0.0
  ]);
  // 设置点的数目
  var n=4;
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
  //坐标中每个数据值的大小
  var FSIZE=vertics.BYTES_PER_ELEMENT;
   //在缓冲区对象中获取变量的地址
  var a_Position=gl.getAttribLocation(gl.program,'a_Position');
  if(a_Position<0){
    console.log('Failed to get the storage location of a position');
    return -1;
  }
  //设置定点数据
  gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,FSIZE*4,0);
  // 开启缓冲区对象----定点数据
  gl.enableVertexAttribArray(a_Position);
  //在缓冲区对象中获取变量的地址
  var a_TextCoord=gl.getAttribLocation(gl.program, 'a_TextCoord');
  if(a_TextCoord<0){
    console.log('Failed to get the storage location of the a_TextCoord');
    return -1;
  }
  //设置纹理坐标
  gl.vertexAttribPointer(a_TextCoord,2,gl.FLOAT,false,FSIZE*4,FSIZE*2);
  // 开启缓冲区对象----纹理坐标
  gl.enableVertexAttribArray(a_TextCoord);
  // 返回顶点数目
  return n;
}

function initTextures(gl,n){
  // 创建纹理对象
  var textture=gl.createTexture();
  if (!textture) {
    console.log('Failed to create the texture object');
    return false;
  }
  //获取纹理的位置
  var u_Sample=gl.getUniformLocation(gl.program,'u_Sample');
  if(!u_Sample){
    console.log('Failed to get the storage location of the a_TextCoord');
    return false;
  }
  var image=new Image();

  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // 加载图像-----加载完成之后加载纹理
  image.onload = function () { loadTexture(gl, n, textture, u_Sample, image);};

  image.src='111.jpg';
  return true
}
  //加载纹理
function loadTexture(gl,n,textture,u_Sample,image){
  // 对纹理图像进行Y轴反转
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
  // 开启0号纹理单元
  gl.activeTexture(gl.TEXTURE0);
  // 向缓冲区绑定纹理对象
  gl.bindTexture(gl.TEXTURE_2D,textture);
  // 配置纹理参数
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  // 配置纹理图像
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);
  // 将0号纹理传给片元着色器
  gl.uniform1i(u_Sample,0);
  // 清空canvas
  gl.clear(gl.COLOR_BUFFER_BIT);
  // 绘制矩形
  gl.drawArrays(gl.TRIANGLE_STRIP,0,n);
}

