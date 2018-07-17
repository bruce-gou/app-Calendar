(function($){
	$.Calendar = function(obj){
		init(obj);
	};
	//初始化
	function init(obj){
		initFillStyle(obj);
		dom(obj);
	}
	//获取年份天数
	function year(y){
		var allDay = 0;
		for(var i = 1970;i < y;i++){
			if(i % 4 == 0 && i % 100 != 0 || i % 400 == 0){
				allDay += 366;
			}else{
				allDay += 365; 
			} 
		}
		return allDay;
	}
	//计算月份的天数
	function month(y,m){
		var allDay = 0;
		switch(m - 1){
			case 11:allDay += 30;
			case 10:allDay += 31;
			case 9:allDay += 30;
			case 8:allDay += 31;
			case 7:allDay += 31;
			case 6:allDay += 30;
			case 5:allDay += 31;
			case 4:allDay += 30;
			case 3:allDay += 31;
			case 2:
					if(y % 4 == 0 && y % 100 != 0 || y % 400 == 0){
						allDay += 29;
						
					}else{
						allDay += 28;
					}
			case 1:allDay += 31;
		
		}
		allDay += 1;//这里加1可以得出当前月第一天是星期几，不加1是上月最后一天是星期几
		return allDay;
	}
	//计算当月天数
	function currentMonth(y,m){
		var monthDay  = 0;
		switch(m){
			case 1:
			case 3:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:monthDay = 31;break;
			case 4:
			case 6:
			case 9:
			case 11:monthDay = 30;break;
			case 2:
				if(y % 4 == 0 && y % 100 != 0 || y % 400 == 0){
						monthDay = 29;
						
					}else{
						monthDay = 28;
				}	
		}
	   	return monthDay;
	}
	//计算给定的总天数是星期几,当前月第一天是星期几
	function dayofweek(day){
		//1970 1月1日 星期四
		var week = (day+3) % 7;
		return week == 0?7:week;
	}
	//拼接日历
	function mosaic(y,m,obj){
		var yDay = year(y);//年份天数
		var mDay = month(y,m);//月份天数
		var monthDay = currentMonth(y,m);//当月天数
		var week = dayofweek(yDay + mDay);//当月第一天是周几
		
		var time = new Date();
		var yy = time.getFullYear();
		var mm = time.getMonth() + 1;
		var d = time.getDate();
		var info = '';
		for(var j = 0;j<week;j++){
			info += '<li></li>';
		}
		for(var i = 1;i<=monthDay;i++){
			var data = y + '-' + m + '-' + i;
			if(mm == m && i == d && yy == y){
				info += '<li><span class="calendar-Day active" data-y="'+y+'" data-m="'+m+'" data-w="'+week+'">'+i+'</span></li>';
			}else{
				info += '<li><span class="calendar-Day" data-y="'+y+'" data-m="'+m+'" data-w="'+week+'">'+i+'</span></li>';
			}
		}
		return info;
	}
	function initFillStyle(obj){
		var y,m,d,time = null;
		time = new Date();
		y = Number(time.getFullYear());
		m = Number(time.getMonth() + 1);
		var msg = '';
		msg +='<ul class="swiper-slide" data-y="'+y+'" data-m="'+ (m-1) +'">' + mosaic(y,m-1,obj) + '</ul>';
		msg += '<ul class="swiper-slide" data-y="'+y+'" data-m="'+ m +'">' + mosaic(y,m,obj) + '</ul>';
		msg += '<ul class="swiper-slide" data-y="'+y+'" data-m="'+ (m+1) +'">' + mosaic(y,m+1,obj) + '</ul>';
		var html = '<div class="calendar"><div class="top"><div class="head1">2017年11月</div><div class="head2">'+
			   '<span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>'+
			   '</div></div><div class="bottom swiper-container"><div class="swiper-wrapper">'+msg+'</div></div>';
		var $this = document.querySelector(obj.el);
		$this.innerHTML = html;
	}
	//dom 操作
	function dom(obj){
		//点击每日方法
		//这里在pc端要换成click事件，原生js 不支持tap事件
		document.querySelector('#calendar').addEventListener('click',function(e){
			if((e.target.tagName == 'span' || e.target.tagName == 'SPAN') && e.target.className == 'calendar-Day'){
				var y = e.target.getAttribute('data-y');
		    		var m = e.target.getAttribute('data-m');
		    		var w = e.target.getAttribute('data-w');
				var d = e.target.innerHTML;
				var list = document.querySelectorAll('.swiper-slide-active .calendar-Day');
				var listLen = list.length;
				for(var i  = 0; i < listLen;i++){
					var item = list[i];
					if(item.className.indexOf('active')>=0){
						item.className = item.className.replace(' active','');
						break;
					}
				}
				e.target.className = e.target.className+' active';
				obj.cBack({'year': y,'month': m,'day': d,'week': w});
			}
		},false);
		var flg1 = true;
		var isChnage = true;
		//swiper
		var swiper = new Swiper('.swiper-container',{
			loop: true,
   		 	initialSlide:1, //初始化显示索引
   		 	on:{
   		 		slideChange: function(){
			      	isChnage = false;
			    },
   		 		//上一页
			    slidePrevTransitionEnd:function(){
			    		if(isChnage){
			    			return;
			    		}else{
			    			var $this = document.querySelector('.swiper-slide-active');
			    			var year = Number($this.getAttribute('data-y'));
			    			var month = Number($this.getAttribute('data-m'));
			    			document.querySelector('.head1').innerHTML = year + '年' + month +'月';
			    			month -= 1;
				    		calculation(year,month,false);
			    		}
			    },
			    //下一页
			    slideNextTransitionEnd:function(){
			    		if(isChnage){
			    			return;
			    		}else{
			    			var $this = document.querySelector('.swiper-slide-active');
			    			var year = Number($this.getAttribute('data-y'));
			    			var month = Number($this.getAttribute('data-m'));
			    			document.querySelector('.head1').innerHTML = year + '年' + month +'月';
			    			month += 1;
				    		calculation(year,month,true);
			    		}
			    }
   		 	}
   		});
   		//计算月份年份
   		function calculation(y,m,flg){
   			if(m>12){
   				m = 1;
   				y += 1;
   			}else if(m < 1){
   				m = 12;
   				y -= 1;
   			}
   			switchM(y,m,flg);
   		}
   		// 切换月份 flg -- true 加  false -- 减
   		function switchM(y,m,flg){
   			var $this = document.querySelector('.swiper-slide-active');
   			if(flg){//下一页
   				next($this,y,m);
   			}else{//上一页
   				prev($this,y,m);
   			}
   			try{
   				//因为滑动效果使用的是swiper 的无限滑动，所以要判断 当前是否是位于中间，然后刷新全部,否则会出现日期断层
   				if($this.nextSibling.nextSibling && $this.previousSibling.previousSibling){
   					var year = Number($this.getAttribute('data-y'));
   					var month = Number($this.getAttribute('data-m'));
   					if(flg){
   						month -= 1;
   						if(month < 1){
   							month = 12;
   							year -= 1;
   						}
   						prev($this,year,month);
   					}else{
   						month += 1;
   						if(month > 12){
   							month = 1;
   							year += 1;
   						}
   						next($this,year,month);
   					}
	   			}
   			}catch(e){
   				//TODO handle the exception
   				console.log(e);
   			}
   			isChnage = true;
   		}
   		//上一月的提前更新
   		function prev($this,y,m){
   			var msg = mosaic(y,m);
   			if($this.previousSibling){
   				$this.previousSibling.innerHTML = msg;
   				$this.previousSibling.setAttribute('data-y',y);
				$this.previousSibling.setAttribute('data-m',m);
   			}else{
   				//当上一月走到第一个，的时候再下一月，会直接跳到第5个dom节点
   				//但是只是滑动一下，不翻月，会直接跳到第4个节点
   				var first = $this.parentNode.firstChild.nextSibling.nextSibling;
   				first.innerHTML = msg;
   				first.setAttribute('data-y',y);
				first.setAttribute('data-m',m);
				//无限循环切换的 过渡切换设置
				//滑动一下的隐形翻页
				m = m + 1;
				if(m > 12){
					y += 1;
					m = 1;
				}
				var msg1 = mosaic(y,m);
				var four = $this.parentNode.firstChild.nextSibling.nextSibling.nextSibling;
				four.innerHTML = msg1;
   				four.setAttribute('data-y',y);
				four.setAttribute('data-m',m);
				//正常翻页的下一页
				//滑动一下的隐形翻页
				m = m + 1;
				if(m > 12){
					y += 1;
					m = 1;
				}
				var msg1 = mosaic(y,m);
				var four = $this.parentNode.firstChild.nextSibling.nextSibling.nextSibling.nextSibling;
				four.innerHTML = msg1;
   				four.setAttribute('data-y',y);
				four.setAttribute('data-m',m);
				
   			}
   		}
   		//下一月的提前更新
   		function next($this,y,m){
   			var msg = mosaic(y,m);
   			if($this.nextSibling){
   				$this.nextSibling.innerHTML = msg;
   				$this.nextSibling.setAttribute('data-y',y);
				$this.nextSibling.setAttribute('data-m',m);
   			}else{
   				//当下一月走到最后1个，的时候再上一月，会直接跳到第1个dom节点
   				//但是只是滑动一下，不翻月，会直接跳到第2个节点
   				var first = $this.parentNode.firstChild.nextSibling.nextSibling;
   				first.innerHTML = msg;
   				first.setAttribute('data-y',y);
				first.setAttribute('data-m',m);
				//无限循环切换的 过渡切换设置
				//隐形的上一页
				m = m-1;
				if(m < 1){
					y -= 1;
					m = 12;
				}
				var msg1 = mosaic(y,m);
				var two = $this.parentNode.firstChild.nextSibling;
   				two.innerHTML = msg1;
   				two.setAttribute('data-y',y);
				two.setAttribute('data-m',m);
				//正常翻页的上一页
				m = m-1;
				if(m < 1){
					y -= 1;
					m = 12;
				}
				var msg1 = mosaic(y,m);
				var two = $this.parentNode.firstChild;
   				two.innerHTML = msg1;
   				two.setAttribute('data-y',y);
				two.setAttribute('data-m',m);
   			}
   		}
	}
})(window);