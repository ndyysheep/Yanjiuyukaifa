var module="illegal";
var sub="data";
var check = 0;
document.domain="localhost";
/*================================================================================*/
jQuery(document).ready(function() {
	// initiate layout and plugins
	Metronic.init(); // init metronic core components
	Layout.init(); // init current layout
	Demo.init(); // init demo features
	ComponentsPickers.init();//选择时间
	Page.init();//页面初始化

});
/* ================================================================================ */


//关于页面的控件生成等操作都放在Page里
var Page = function() {
	/*----------------------------------------入口函数  开始----------------------------------------*/
	var initPageControl=function(){
		pageId = $("#page_id").val();

		if(pageId==="illegal_data_statistics"){
			//打印页面,进程图表初始化
			initIllegalStatistics();
			//设置页面监听
			initIllegalStatisticsControl();

		}
	};
	/*----------------------------------------入口函数  结束----------------------------------------*/

	var chartData=[ {
		"year": 2010,
		"income": 26.2,
		"expenses": 22.8
	}];
	/*----------------------------------------业务函数  开始----------------------------------------*/
	/*------------------------------针对各个页面的入口  开始------------------------------*/


	/*------------------------------针对各个页面的入口 结束------------------------------*/


	//页面初始化模块
	var initIllegalStatistics = function(time_from,time_to){

		$.ajaxSettings.async=false;
		initIllegalRecordForStatistics(time_from,time_to);
		$.ajaxSettings.async=true;
		initChartSets();
	}

	var initIllegalStatisticsControl = function(){
		pageListener();
		$("#time_submit_button").click(function(){onTimeLimitSubmit()})
	}

	//页面监听操作函数
	var pageListener = function(){

		//自定义变量,用于获取元素并改变元素的样式
		var barContainer = document.getElementById("warning");
		var beginContainer = document.getElementById("time_from");
		var endContainer = document.getElementById("time_to");


		//自定义变量,用于获取元素并监听
		var beginListener = undefined;
		var endListener =  undefined;



		//监听开始年月日
		$("#time_from").change(function(){
			beginListener=$("#time_from").val();
			console.log(beginListener);
			if(endListener!==undefined)
			{
				if(beginListener>endListener)
				{
					barContainer.style.display="block";
					beginContainer.style.borderColor="#a94442";
				}
				else
				{
					barContainer.style.display="none";
					beginContainer.style.borderColor="#d6e9c6";
				}
			}
		});

		//监听结束年月日
		$("#time_to").change(function(){
			endListener=($("#time_to").val());
			console.log(beginListener);
			console.log(endListener);
			console.log(beginListener>endListener);
			if(beginListener!==undefined)
			{
				if(beginListener>endListener)
				{
					barContainer.style.display="block";
					endContainer.style.borderColor="#a94442";
				}
				else
				{
					barContainer.style.display="none";
					endContainer.style.borderColor="#d6e9c6";

				}
			}
		});

	}

	var onTimeLimitSubmit = function(){

		var forTimeCheck=[$("#time_from_minute").val(),$("#time_to_minute").val()];

		for(var i=0;i<forTimeCheck.length;i++)
		{
			if(parseInt(forTimeCheck[i])<10)
			{
				forTimeCheck[i]="0"+forTimeCheck[i];
			}
		}

		var time_from = $("#time_from").val()+" "+forTimeCheck[0];
		var time_to = $("#time_to").val()+" "+forTimeCheck[1];

		//自定义变量,用于获取元素并改变元素的样式
		var barContainer = document.getElementById("warning");
		var beginMinuteContainer = document.getElementById("time_from_minute");
		var endMinuteContainer = document.getElementById("time_to_minute");

		if(time_from>time_to)
		{
			barContainer.style.display="block";
			beginMinuteContainer.style.borderColor="#a94442";
			endMinuteContainer.style.borderColor="#a94442";
		}
		else
		{
			console.log(time_from);
			barContainer.style.display="none";
			beginMinuteContainer.style.borderColor="#d6e9c6";
			endMinuteContainer.style.borderColor="#d6e9c6";
			initIllegalStatistics(time_from,time_to);
		}


	}

	//图表操作模块
	var initIllegalRecordForStatistics =function(time_from,time_to){
		var url = "../../illegal_data_servlet_action";
		var data={};
		data.action="illegal_statistics";
		if(time_from!=undefined&&time_to!=undefined)
		{
			data.time_from = time_from;
			data.time_to=time_to;
		}

		$.post(url,data,function(json){
			if(json.result_code==0){
				console.log(JSON.stringify(json));

				var list = json.aaData;
				if(list!==undefined&&list.length>0){
					changeResultDataToChart(list,chartData);

					console.log(JSON.stringify(chartData));

				}


			}else{
				alert("与后端交互错误!"+json.result_Msg);
			}

		});


	}

	var initChartSets = function(){

		var chart = AmCharts.makeChart("chart_1", {
			"type": "serial",
			"theme": "light",
			"pathToImages": Metronic.getGlobalPluginsPath() + "amcharts/amcharts/images/",
			"autoMargins": false,
			"marginLeft": 30,
			"marginRight": 8,
			"marginTop": 10,
			"marginBottom": 26,

			"fontFamily": 'Open Sans',
			"color":    '#888',

			"dataProvider": chartData,
			"valueAxes": [{
				"axisAlpha": 0,
				"position": "left"
			}],
			"startDuration": 1,
			"graphs": [{
				"alphaField": "alpha",
				"balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
				"dashLengthField": "dashLengthColumn",
				"fillAlphas": 1,
				"title": "Income",
				"type": "column",
				"valueField": "income"
			}, {
				"balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
				"bullet": "round",
				"dashLengthField": "dashLengthLine",
				"lineThickness": 3,
				"bulletSize": 7,
				"bulletBorderAlpha": 1,
				"bulletColor": "#FFFFFF",
				"useLineColorForBulletBorder": true,
				"bulletBorderThickness": 3,
				"fillAlphas": 0,
				"lineAlpha": 1,
				"title": "Expenses",
				"valueField": "expenses"
			}],
			"categoryField": "year",
			"categoryAxis": {
				"gridPosition": "start",
				"axisAlpha": 0,
				"tickLength": 0
			}
		});

		$('#chart_1').closest('.portlet').find('.fullscreen').click(function() {
			chart.invalidateSize();
		});

	}

	var changeResultDataToChart =function(list, chartData){


		for(var i=0;i<list.length;i++){
			var json={"year":list[i].time_interval,"income":list[i].total,"expenses":list[i].total};
			chartData.push(json);
		}

	}

	//数据解析模块
	var explainIllegalCode = function(code)
	{
		if(code == 1)
		{
			return "违停";
		}
		else if(code == 2)
		{
			return "闯红灯";
		}
		else if(code == 3)
		{
			return "压双黄线";
		}
		else if(code == 4)
		{
			return "逆行";
		}
		else if(code == 0)
		{
			return "正常行驶";
		}
		else
		{
			return "数据错误";
		}


	}

	var explainIllegalCode_Contrary = function(code)
	{
		if(code === "违停")
		{
			return 1;
		}
		else if(code === "闯红灯")
		{
			return 2;
		}
		else if(code === "压双黄线")
		{
			return 3;
		}
		else if(code === "逆行")
		{
			return 4;
		}
		else if(code === "正常行驶")
		{
			return 0;
		}
		else
		{
			return 9;
		}


	}

	//进行路程解析
	var routeAnalysis = function(start_x,start_y,end_x,end_y)
	{
		if(start_x!=null&&start_y!=null&&end_x!=null&&end_y!=null)
		{
			var num = (end_x-start_x)*(end_x-start_x)+(end_y-start_y)*(end_y-start_y);
			num = Math.sqrt(num);

			console.log(num);  // 输出：150

			return num;
		}
		else
		{
			console.log("route analysis error!");
			return 0;
		}
	}

	//进行速度解析
	var speedAnalysis = function(start_x,start_y,end_x,end_y,start_time,end_time)
	{
		if(start_time!=null&&end_time!=null)
		{
			var distance= routeAnalysis(start_x,start_y,end_x,end_y);
			start_time = new Date(start_time);  // 开始时间
			end_time = new Date(end_time);    // 结束时间

			var timeDiff = end_time.getTime() - start_time.getTime();  // 时间差（毫秒数）

			// 将时间差转换为秒钟数
			var secondsDiff = Math.floor(timeDiff /1000);

			console.log(secondsDiff);
			var speed =distance/secondsDiff;

			return speed.toFixed(2);
		}
		else
		{
			console.log("error!");
			return 0;
		}

	}



	//Page return 开始
	return {
		init: function() {
			initPageControl();
		}
	}
}();//Page
/*================================================================================*/
