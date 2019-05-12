// 顶点着色器
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform  float u_TimeIndex;\n' +
    'void main() {\n' +
    '   gl_Position = a_Position;\n' +
    '   gl_PointSize = 5.0+u_TimeIndex*0.5;\n' +
    '}\n';

// 片源着色器
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'void main() {\n' +
    '  float d = distance(gl_PointCoord, vec2(0.5, 0.5));\n' + // 中心点(0.5, 0.5)
    '  if(d < 0.3) {\n' +  // 
    '    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '  } else if(d < 0.5){\n' +
    '    gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);\n' +
    '  } else { discard; }\n' +
    '}\n';

    var currentIndex = 0.0;
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

  var u_TimeIndex=gl.getUniformLocation(gl.program,'u_TimeIndex');

  //获取定义的变量（矩阵分量）
  if(u_TimeIndex<0){
    console.log('Failed to get the unform location');
    return u_TimeIndex;
  }
  
  // 设置背景色
  gl.clearColor(0.0,0.0,0.0,1.0);
  // 清空canvas元素
  gl.clear(gl.COLOR_BUFFER_BIT);
  // 绘制三角形，其中n=3
  //gl.drawArrays(gl.POINTS,0,n);

  var tick = function () {

    currentIndex += 1.0;//刷新一次就改变索引一次

    if (currentIndex >= 60.0) {
        currentIndex = 0.0;
    }

    draw(gl, n, u_TimeIndex, currentIndex);
    requestAnimationFrame(tick);//网页刷新时调用
};
tick();

}

function draw(gl, n, u_TimeIndex, currentIndex){
 
 //给矩阵变量赋值（之前设置的值）
 gl.uniform1f(u_TimeIndex,currentIndex);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.POINTS,0,n);
}

// 创建缓冲区并写入数据
function initVertexBuffers(gl){
  // 设置数据
  var vertics=new Float32Array([
    0.5, 0.0, -0.4, 
    -0.5, 0.0, -0.4, 
    0.0, 0.5, -0.4, 
    0.5, 0.5, -0.3, 
    -0.6, -0.0, -0.3,
    -0.1, 0.5, -0.3, 
    0.7, 0.0, 0.0, 
    -0.7, -0.0, 0.0, 
    -0.3, 0.5, 0.0
  ]);
  // 设置点的数目
  var n=9;
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

  var FSIZE = vertics.BYTES_PER_ELEMENT;
  // 将数据写入缓冲区对象中
  gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false, FSIZE * 3, 0);
  // 开启缓冲区对象
  gl.enableVertexAttribArray(a_Position)
  // 返回顶点数目
  return n;
}
