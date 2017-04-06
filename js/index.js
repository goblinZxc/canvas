//按钮按下,稍微改变一下样式
var allInput = document.querySelectorAll(".iconfont");

for(var i = 0 ; i < allInput.length ; i++){
	allInput[i].index = i;
	allInput[i].addEventListener("click",function(){
		allInput[this.index].style.background = "rgba(0,0,255,0.6)";
		setTimeout(function(){
			allInput[this.index].style.background = "";
		}.bind(this),60)
	})
}


//新建功能
var news = document.querySelector(".new");
var newBtn = news.querySelector("input");
var newMes = news.querySelector(".new-mes")
var newBtns = newMes.querySelectorAll("input");

newBtn.onclick = function(){
	var flag = true;
	$(newMes).fadeIn(100)
	newBtns[0].focus();
	//添加一个document的点击事件,如果离开了事件源就触发
	$(newMes).hover(function(){
		flag = true;
	},function(){
		flag = false;
	})
	document.onclick = function(){
		if(!flag){
			//隐藏,执行操作
			$(newMes).fadeOut(100);
			//获取画布的宽高
			var w = newBtns[0].value;
			var h = newBtns[1].value;
			//赋值,创建
			var canvas = document.createElement("canvas")
			canvas.setAttribute("id","can");
			canvas.setAttribute("width",w);
			canvas.setAttribute("height",h);
			$(".box")[0].appendChild(canvas);
			houxu();
			document.onclick = null;
		}
	}
}

//暂时的代替
// houxu();

function houxu(){
	//只有成功添加了新画布,才能使用后续功能
	var can = document.querySelector("#can");

	var o = can.getContext("2d");
	var p = new platten(can,o);

	//撤销功能
	var undo = document.querySelector(".undo");
	undo.onclick = function(){
		p.undo();
	}

	//画线条功能
	var line = document.querySelector(".line");
	line.onclick = function(){
		p.style = "stroke";
		p.type = "line";

		var flag = false;
		var flag2 = true;
		//显示
		$(styleMes).fadeIn(100);
		$(styleMes).find("div").click(function(){
			p.lineWidth = $(this).index()*2+1;
			$(styleMes).fadeOut(100);
			flag2 = false;
		})
		//或者点击其他地方也会实现
		$(styleMes).hover(function(){
			flag = false;
		},function(){
			flag = true;
		})
		document.onclick = function(){
			if(flag && flag2){
				p.lineWidth = 1;
				$(styleMes).fadeOut(100);
				document.onclick = null;
			}
		}
	}
	//画矩形功能
	var rect = document.querySelector(".rect");
	rect.onclick = function(){
		p.type = "rect";
	}
	//画直角三角形功能
	var triangle = document.querySelector(".triangle");
	triangle.onclick = function(){
		p.type = "triangle";
	}
	//画圆形功能
	var arc = document.querySelector(".arc");
	arc.onclick = function(){
		p.type = "arc";
	}
	//画多边形功能
	var duobian = document.querySelector(".duobian");
	var duobianMes = document.querySelector(".duobian-mes");
	var duobianInput = duobianMes.querySelector("input");
	duobian.onclick = function(){
		// p.type = "duobian";
		$(duobianMes).fadeIn(100);
		//得到焦点
		duobianInput.focus();
		//失去焦点事件
		duobianInput.onblur = function(){
			//改变
			p.poly = duobianInput.value;
			p.type = "duobian";
			$(duobianMes).fadeOut(100);
		}
	}

	//改变填充颜色
	var fill = document.querySelector(".fill");
	fill.onchange = function(){
		p.fillStyle = fill.value;
	}
	//改变描边颜色
	var stroke = document.querySelector(".stroke");
	stroke.onchange = function(){
		p.strokeStyle = stroke.value;
	}

	//改变线的粗细
	// var style = document.querySelector(".style");
	var styleMes = document.querySelector(".style-mes");
	// line.onclick = function(){
	// 	var flag = false;
	// 	//显示
	// 	$(styleMes).fadeIn(100);
	// 	$(styleMes).find("div").click(function(){
	// 		p.lineWidth = $(this).index()*2+1;
	// 		$(styleMes).fadeOut(100);
	// 	})
	// 	//或者点击其他地方也会实现
	// 	$(styleMes).hover(function(){
	// 		flag = false;
	// 	},function(){
	// 		flag = true;
	// 	})
	// 	document.onclick = function(){
	// 		if(flag){
	// 			p.lineWidth = 1;
	// 			$(styleMes).fadeOut(100);
	// 			document.onclick = null;
	// 		}
	// 	}
	// } 
	//铅笔功能
	var pencil = document.querySelector(".pencil");
	pencil.onclick = function(){
		p.type = "pencil";
		tmInput[0].style.display = "block";
		tmInput[1].style.display = "none";
		p.style = "stroke";
	}
	//填充描边选择功能
	var tm = document.querySelector(".tm");
	var tmInput = tm.querySelectorAll(".tm input");
	tm.onclick = function(){
		if(tmInput[0].style.display == "none"){
			//填充功能
			tmInput[0].style.display = "block";
			tmInput[1].style.display = "none";
			p.style = "stroke";
		}else{
			tmInput[0].style.display = "none";
			tmInput[1].style.display = "block";
			p.style = "fill";
		}
	}

	p.drawing();
}