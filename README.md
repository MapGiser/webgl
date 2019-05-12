# webgl
练习使用
添加扩展<br>
一、绘制圆形点（RoundPaoint）<br>    
1、使用内置变量gl_PointCoord,该变量表示片元在被绘制的片元内的坐标，被归一化为0---1，有个这个坐标值，便可以计算在每个坐标距离被绘制的片元左边的距离，
而中心点的坐标表示为vec2(0.5,0.5),如果计算距离中心点的距离则表示计算半径，有了半径就可以在片元着色器中进行计算了。<br>   
2、一个没用到的变量gl_FragCoord:表示片元在窗口的坐标，也即为上面1中的被绘制的片元的坐标。<br>     
3、当判断的距离距离中心点的距离大于0.5时，利用内置行数discard，不执行绘制操作，设置此语句与不设置的对比<br>
![Image text](http://raw.github.com/MapGiser/webgl/master/images/b.jpg)
![Image text](http://raw.github.com/MapGiser/webgl/master/images/a.jpg)
<br>
二、<H3>动态变化点的大小<H3>
1、随时间变化的圆点的半斤大小，根据时间变量，动态变化圆形点的半径<br>
![image](http://raw.github.com/MapGiser/webgl/master/images//pointScale.gif)
