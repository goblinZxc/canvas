function platten(canvas,cobj){

	this.canvas = canvas;
	this.cobj = cobj;
	this.style = "stroke";	//决定是描边还是填充
	this.lineWidth = 1;		//描边宽度
	this.type = "line";	//操作类型
	this.history = [];		//存放操作，用于撤销
	this.poly = 5;			//多边形操作默认是几边型
	this.fillStyle = "#000";	//填充颜色
	this.strokeStyle = "#000";	//描边颜色

}
//画线条功能
platten.prototype.line = function(x1,y1,x2,y2){
	this.style = "stroke";
	this.cobj.moveTo(x1,y1);
	this.cobj.lineTo(x2,y2);

}
//画矩形功能
platten.prototype.rect = function(x1,y1,x2,y2){
	this.cobj.rect(x1+0.5,y1+0.5,x2-x1,y2-y1);
}

// 画三角形功能
platten.prototype.triangle = function(x1,y1,x2,y2){
	//获取x,y的值
	this.cobj.moveTo(x1+0.5,y1+0.5);
	this.cobj.lineTo(x1+0.5,y2+0.5);
	this.cobj.lineTo(x2+0.5,y2+0.5);
	this.cobj.lineTo(x1+0.5,y1+0.5);
}

//画圆功能
platten.prototype.arc = function(x1,y1,x2,y2){
	//确定半径
	var r = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
	this.cobj.arc(x1,y1,r,0,2*Math.PI)
}

//铅笔功能
platten.prototype.pencil = function(x1,y1){
	var that = this;
	that.cobj.beginPath();
	this.cobj.moveTo(x1,y1)
	that.cobj.fillStyle = that.fillStyle;
	that.cobj.strokeStyle = that.strokeStyle;
	that.cobj.lineWidth = that.lineWidth;
	that.canvas.onmousemove = function(e){
		//鼠标移动，不停lineTo
		that.cobj.lineTo(e.offsetX,e.offsetY);
		that.cobj.stroke();
	}
	that.cobj.closePath();
}

//画多边形功能
platten.prototype.duobian = function(x1,y1,x2,y2){

	//确定半径
	var r = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
	//确定方向
	var ang = 360/this.poly;	//每一个内角的大小
	var sA = 0;	//默认是y轴开始
	var pos = [];

	var afa = Math.atan2(y2-y1,x2-x1);

	for(var i = 0 ; i < this.poly ;i++){
		var x = r*Math.cos(sA*Math.PI/180+afa);
		var y = r*Math.sin(sA*Math.PI/180+afa);
		pos[i] = {x:x,y:y}
		pos[i].x = x+x1;
		pos[i].y = y+y1;
		sA+=ang;
	}

	this.cobj.beginPath();
	this.cobj.moveTo(pos[0].x,pos[0].y)
	for(var i = 0 ; i < this.poly ; i++){
		this.cobj.lineTo(pos[i].x,pos[i].y);
	}
	this.cobj.closePath();

}



//撤销功能
platten.prototype.undo = function(){
	if(this.history.length != 0){
		this.history.pop();
		if(this.history.length == 0){
			this.cobj.clearRect(0,0,this.canvas.width,this.canvas.height)
		}else{
			this.cobj.putImageData(this.history[this.history.length-1],0,0,0,0,this.canvas.width,this.canvas.height)
		}
	}else{
		alert("无法撤消!")
	}
}

platten.prototype.drawing = function(){
	var that = this;
	that.canvas.onmousedown = function(e){
		//鼠标按下
		var dx = e.offsetX;
		var dy = e.offsetY;
		if(that.type == "pencil"){
			//如果是铅笔功能
			that.pencil(dx,dy);      
		}else{
			that.canvas.onmousemove = function(e){
				//鼠标移动
				var mx = e.offsetX;
				var my = e.offsetY;
				that.cobj.beginPath();
				that.cobj.fillStyle = that.fillStyle;
				that.cobj.strokeStyle = that.strokeStyle;
				that.cobj.lineWidth = that.lineWidth;
				that.cobj.clearRect(0,0,this.width,this.height)

				that[that.type](dx,dy,mx,my);
				//绘制旧图像
				if(that.history.length != 0){
					that.cobj.putImageData(that.history[that.history.length-1],0,0,0,0,this.width,this.height)
				}
				that.cobj.closePath();
				that.cobj[that.style]();
			}
		}
		that.canvas.onmouseup = function(){
			//保存新图像
			that.history.push(that.cobj.getImageData(0,0,this.width,this.height));
			that.canvas.onmousemove = null;
			that.canvas.onmouseup = null;
		}
	}
}
