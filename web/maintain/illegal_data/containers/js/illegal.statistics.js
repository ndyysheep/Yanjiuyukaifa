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

	var chartData=[];
	var chartDataExtra = [];
	var chartDataIllegalType = [];
	/*----------------------------------------业务函数  开始----------------------------------------*/
	/*------------------------------针对各个页面的入口  开始------------------------------*/


	/*------------------------------针对各个页面的入口 结束------------------------------*/


	//统计初始化模块-----开始
	var initIllegalStatistics = function(time_from,time_to){

		$.ajaxSettings.async=false;
		initIllegalRecordForStatistics(time_from,time_to);
		$.ajaxSettings.async=true;
		initChartSets();
		initChartSetsExtra();
		initChartSample7();

	}
	//统计初始化模块-----结束

	//页面控制模块-----开始
	var initIllegalStatisticsControl = function(){
		onPageListenerForStatisitcs();
		$("#time_submit_button").click(function(){onTimeLimitSubmit()})
	}
	//页面控制模块-----结束

	//页面监听操作函数-----开始
	var onPageListenerForStatisitcs = function(){

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

		var time_from = $("#time_from").val();
		var time_to = $("#time_to").val();

		if(time_from !== "")
		{
			time_from+=" "+forTimeCheck[0];
		}

		if(time_to !== "")
		{
			time_to+=" "+forTimeCheck[1];
		}


		//自定义变量,用于获取元素并改变元素的样式
		var barContainer = document.getElementById("warning");
		var beginMinuteContainer = document.getElementById("time_from_minute");
		var endMinuteContainer = document.getElementById("time_to_minute");

		if(time_from>time_to||time_from===""||time_to==="")
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
	//页面监听操作函数-----结束

	//图表信息交互模块-----开始
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

				var list = json.hour_aaData;
				if(list!==undefined&&list.length>0){
					changeResultDataToChartForHours(list);
					changeResultDataToChartForIllegalTypes(list);

				}


			}else{
				alert("与后端交互错误!"+json.result_Msg);
			}

		});


	}
	//图表信息交互模块-----结束

	//图表的初始化函数-----开始
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
				"title": "违停",
				"type": "column",
				"valueField": "违停"
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
				"title": "违停",
				"valueField": "违停"
			},{
				"alphaField": "alpha",
				"balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
				"dashLengthField": "dashLengthColumn",
				"fillAlphas": 1,
				"title": "闯红灯",
				"type": "column",
				"valueField": "闯红灯"
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
				"title": "闯红灯",
				"valueField": "闯红灯"
			},{
				"alphaField": "alpha",
				"balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
				"dashLengthField": "dashLengthColumn",
				"fillAlphas": 1,
				"title": "压双黄线",
				"type": "column",
				"valueField": "压双黄线"
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
				"title": "压双黄线",
				"valueField": "压双黄线"
			},{
				"alphaField": "alpha",
				"balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
				"dashLengthField": "dashLengthColumn",
				"fillAlphas": 1,
				"title": "违停",
				"type": "column",
				"valueField": "违停"
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
				"title": "违停",
				"valueField": "违停"
			},{
				"alphaField": "alpha",
				"balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
				"dashLengthField": "dashLengthColumn",
				"fillAlphas": 1,
				"title": "逆行",
				"type": "column",
				"valueField": "逆行"
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
				"title": "逆行",
				"valueField": "逆行"
			}],
			"categoryField": "hour",
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

	var initChartSetsExtra = function(){

		var chart = AmCharts.makeChart("chart_2", {
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

			"dataProvider": chartDataExtra,
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
				"title": "违停",
				"type": "column",
				"valueField": "违停"
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
				"title": "违停",
				"valueField": "违停"
			},{
				"alphaField": "alpha",
				"balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
				"dashLengthField": "dashLengthColumn",
				"fillAlphas": 1,
				"title": "闯红灯",
				"type": "column",
				"valueField": "闯红灯"
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
				"title": "闯红灯",
				"valueField": "闯红灯"
			},{
				"alphaField": "alpha",
				"balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
				"dashLengthField": "dashLengthColumn",
				"fillAlphas": 1,
				"title": "压双黄线",
				"type": "column",
				"valueField": "压双黄线"
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
				"title": "压双黄线",
				"valueField": "压双黄线"
			},{
				"alphaField": "alpha",
				"balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
				"dashLengthField": "dashLengthColumn",
				"fillAlphas": 1,
				"title": "违停",
				"type": "column",
				"valueField": "违停"
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
				"title": "违停",
				"valueField": "违停"
			},{
				"alphaField": "alpha",
				"balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
				"dashLengthField": "dashLengthColumn",
				"fillAlphas": 1,
				"title": "逆行",
				"type": "column",
				"valueField": "逆行"
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
				"title": "逆行",
				"valueField": "逆行"
			}],
			"categoryField": "hour",
			"categoryAxis": {
				"gridPosition": "start",
				"axisAlpha": 0,
				"tickLength": 0
			}
		});

		$('#chart_2').closest('.portlet').find('.fullscreen').click(function() {
			chart.invalidateSize();
		});

	}

	var initChartSample7 = function() {
		var chart = AmCharts.makeChart("chart_7", {
			"type": "pie",
			"theme": "light",

			"fontFamily": 'Open Sans',

			"color":    '#888',

			"dataProvider":chartDataIllegalType,
			"valueField": "num",
			"titleField": "illegal_type",
			"outlineAlpha": 0.4,
			"depth3D": 15,
			"balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
			"angle": 30,
			"exportConfig": {
				menuItems: [{
					icon: '/lib/3/images/export.png',
					format: 'png'
				}]
			}
		});

		jQuery('.chart_7_chart_input').off().on('input change', function() {
			var property = jQuery(this).data('property');
			var target = chart;
			var value = Number(this.value);
			chart.startDuration = 0;

			if (property == 'innerRadius') {
				value += "%";
			}

			target[property] = value;
			chart.validateNow();
		});

		$('#chart_7').closest('.portlet').find('.fullscreen').click(function() {
			chart.invalidateSize();
		});
	}
	//图表的初始化函数-----结束

	//图表处理函数-----开始
	var changeResultDataToChartForHours =function(list){
		var myIndex =0;
		var checkHour =[];
		chartData = [];

		for(var index =0;index<24;index++)
		{
			checkHour.push(false);
		}

		for(var i=0;i<list.length;i++)
		{
			checkHour[parseInt(list[i].time_interval)] = true;
		}

		for(var j = 0;j<12;j++)
		{
			if(checkHour[j]===true)
			{

				var hour = parseInt(list[myIndex].time_interval);
				console.log( parseInt(list[myIndex].time_interval));
				var hourStr="";
				if(hour<10)
				{
					hourStr ="0"+ hour.toString()
				}
				else
				{
					hourStr = hour.toString();
				}
				var json={"hour":hourStr,"违停":list[myIndex].status1,"闯红灯":list[myIndex].status2,
					"压双黄线":list[myIndex].status3,"逆行":list[myIndex].status4};
				chartData.push(json);
				myIndex++;
			}
			else
			{
				var my_json ="";
				if(j<10)
				{
					hourStr ="0"+j.toString();
					my_json = {"hour":hourStr,"违停":0,"闯红灯":0, "压双黄线":0,"逆行":0};
				}
				else
				{
					hourStr =j.toString();
					my_json = {"hour":hourStr,"违停":0,"闯红灯":0, "压双黄线":0,"逆行":0};
				}
				chartData.push(my_json);
			}


		}

		for(var i = 12;i<24;i++)
		{
			if(checkHour[i]===true)
			{

				var hour = parseInt(list[myIndex].time_interval);
				console.log( parseInt(list[myIndex].time_interval));
				var hourStr= hour.toString();

				var json={"hour":hourStr,"违停":list[myIndex].status1,"闯红灯":list[myIndex].status2,
					"压双黄线":list[myIndex].status3,"逆行":list[myIndex].status4};
				chartDataExtra.push(json);
				myIndex++;
			}
			else
			{
				var my_json ="";

					hourStr =i.toString();
					my_json = {"hour":hourStr,"违停":0,"闯红灯":0, "压双黄线":0,"逆行":0};
				chartDataExtra.push(my_json);
			}


		}

	}

	var changeResultDataToChartForIllegalTypes = function(list) {
		chartDataIllegalType=[];
		var statusCounts = [0,0,0,0,0];
		for(var i = 0;i<list.length;i++)
		{
			statusCounts[1]+=parseInt(list[i].status1);
			statusCounts[2]+=parseInt(list[i].status2);
			statusCounts[3]+=parseInt(list[i].status3);
			statusCounts[4]+=parseInt(list[i].status4);
		}

		for(var i =1;i<=4;i++)
		{
			var json = {"illegal_type":explainIllegalCode(i),"num":statusCounts[i]};
			chartDataIllegalType.push(json);
		}

	}
	//图标处理函数-----结束

	//数据解析模块-----开始
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
	//数据解析模块-----结束


	//Page return 开始
	return {
		init: function() {
			initPageControl();
		}
	}
}();//Page
/*================================================================================*/
