var module="monitor";
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
		if(pageId==="monitor_list"){
			$(".sub-menu #monitor_list").addClass("active");
			//设备列表页面
			initMonitorList();
		}
		if(pageId==="monitor_file"){
			//文件
			initDeviceFile();
		}

		if(pageId==="monitor_print"){
			//打印页面
			initMonitorPrint();
		}
		if(pageId==="monitor_print_word"){
			//Word打印页面
			initMonitorPrint_Word();
		}

		if(pageId==="monitor_statistics"){
			$(".sub-menu #monitor_statistics").addClass("active");
			//打印页面
			initMonitorStatisticsControlEvent();
			initMonitorStatistics();
		}
	};
	/*----------------------------------------入口函数  结束----------------------------------------*/
	//全局变量数组
	var chartData=[];
	var recordData = [];
	var resultList=[];
	var illegalInput = [];

	var pageLength = 0;
	/*----------------------------------------业务函数  开始----------------------------------------*/
	/*------------------------------针对各个页面的入口  开始------------------------------*/
	var initMonitorList=function(){

		onPageListenerForMonitorList();
		initMonitorListControlEvent();
		initMonitorRecordList();
		initDeviceFile();
	}

	var initMonitorAdd=function(){
		initMonitorAddControlEvent();
	}

	var initDeviceQuery=function(){
		initMonitorQueryControlEvent();
	}

	var initDeviceFile=function(){
		console.log("[initDeviceFile]");
		initDeviceFileControlEvent();
	}

	var initMonitorPrint = function(){
		initMonitorRecordForPrint();
	}

	var initMonitorPrint_Word = function(){
		initMonitorRecordForPrint_Word();
	}

	var initMonitorStatistics = function(time_from,time_to){
		$.ajaxSettings.async=false;
		initMonitorRecordForStatistics(time_from,time_to);
		$.ajaxSettings.async=true;
		initChartSets();
		initChartSample7();
	}


	/*------------------------------针对各个页面的入口 结束------------------------------*/

	//事件处理初始化--开始
	var initMonitorListControlEvent=function(){
		//添加信息
		$('#ac_add_button').click(function() {onAddRecord(),initMonitorAdd();});
		//查询信息
		$('#ac_query_button').click(function() {onQueryRecord(),initDeviceQuery();});
		//修改信息
		$('#record_modify_div #submit_button').click(function() {myModifySubmit();});
		//导出信息
		$('#export_button').click(function() {myExportAPI();});
		//打印信息
		$('#print_button').click(function() {myPrintAPI()});
		$('#print_button_for_word').click(function() {myPrintAPI_Word()});
		//统计细心
		$('#statistics_button').click(function() {myStatisticsAPI()});
       //获取api信息
		$('#ac_select_button').click(function() {myAllSubmit(),initDeviceQuery();});


	}

	var initMonitorAddControlEvent=function(){
		$('#record_add_div #submit_button').click(function() {submitAddRecord();});
	}

	var initMonitorQueryControlEvent=function(){
		$("#help_button").click(function() {help();});
		$('#record_query_div #query_button').click(function() {myQuerySubmit();});
	}

	var initMonitorStatisticsControlEvent = function(){
		onPageListenerForStatisitcs();
		$("#time_submit_button").click(function(){onTimeLimitSubmit()})
	}





	//事件处理初始化--结束

	//数据获取初始化--开始
	var initMonitorRecordList=function(){
		//使用Datatable的数据表,统计总数据
		getMonitorRecordDatatable();
	}

	var initMonitorRecordForPrint=function(){
		getMonitorRecordPrint();
	}

	var initMonitorRecordForPrint_Word=function(){
		getMonitorRecordPrint_Word();
	}

	var initMonitorRecordForStatistics =function(time_from,time_to){
		var url = "../../monitor_data_servlet_action";
		var data={};
		data.action="monitor_statistics";
		if(time_from!=undefined&&time_to!=undefined)
		{
			data.time_from = time_from;
			data.time_to=time_to;
		}

		$.post(url,data,function(json){
			if(json.result_code==0){


				var list = json.my_aaData;
				var type_list = json.aaData;

				if(list!=undefined&&list.length>0)
				{
					changeResultDataToChartForHours(list);
				}
				if(type_list!=undefined&&type_list.length>0)
				{
					changeResultDataToChartForTypes(type_list);
				}

			}else{
				alert("与后端交互错误!"+json.result_Msg);
			}

		});


	}

	//init-monitor_file functions begin
	var initDeviceFileControlEvent=function(id){
		$('#jump_div #upload_button').click(function() {onJumpUploadFile();});
		$('#upload_button').click(function() {onAjaxUploadFile();});
		console.log("[initDeviceFileControlEvent]");
	}
	//init-monitor_file functions end

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
				"title": "legalCars",
				"type": "column",
				"valueField": "legalCars"
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
				"title": "legalCars",
				"valueField": "legalCars"
			},{
				"alphaField": "alpha",
				"balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
				"dashLengthField": "dashLengthColumn",
				"fillAlphas": 1,
				"title": "illegalCars",
				"type": "column",
				"valueField": "illegalCars"
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
				"title": "illegalCars",
				"valueField": "illegalCars"
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

	var initChartSample7 = function() {
		var chart = AmCharts.makeChart("chart_7", {
			"type": "pie",
			"theme": "light",

			"fontFamily": 'Open Sans',

			"color":    '#888',

			"dataProvider":recordData,
			"valueField": "num",
			"titleField": "vehicle_type",
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
	//数据获取初始化--结束



	//页面监听函数--开始
	var onPageListenerForMonitorList= function() {

		var inputListener = $(".form-group input");
		var colorContainer=inputListener.css("borderColor");
		inputListener.click(function(event){

			var element = $(event.target);
			element.keypress(function(leafEvent){
				var value=leafEvent.key;
				console.log(value.toString());
				if(!checkInputValid(value))
				{

					element.css({
						"border-color" : "#a94442"
					})
					alert("不允许输入特殊字符");
				}
				else
				{
					element.css({
						"border-color" : colorContainer
					})
				}

			})

		})

	}

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
	//页面监听函数--结束


	//数据获取函数--开始
	var getMonitorRecordDatatable =function(data){
		var servletRequest ="../../weibohot_data_servlet_action";
		resultList=[];
		if(data==undefined)
		{
			data={};
			data.action="get_weibo_record";
		}
		var table =$('.datatable').DataTable();
		table.destroy();
		table =$('.datatable').DataTable( {
			"paging":true,
			"searching":false,
			"oLanguage": {
				"aria": {
					"sortAscending": ": activate to sort column ascending",
					"sortDescending": ": activate to sort column descending"
				},
				"sProcessing":   "处理中...",
				"sLengthMenu":   "_MENU_ 记录/页",
				"sZeroRecords":  "没有匹配的记录",
				"sInfo":         "显示第 _START_ 至 _END_ 项记录，共 _TOTAL_ 项",
				"sInfoEmpty":    "显示第 0 至 0 项记录，共 0 项",
				"sInfoFiltered": "(由 _MAX_ 项记录过滤)",
				"sInfoPostFix":  "",
				"sSearch":       "过滤:",
				"oPaginate": {
					"sFirst":    "首页",
					"sPrevious": "上页",
					"sNext":     "下页",
					"sLast":     "末页"
				}
			},
			"aoColumns": [{"mRender": function(data, type, full) {

					sReturn = '<input type="checkbox" class="checkboxes" value="'+full.id+'"/>';
					return sReturn;
				},"orderable": false
			},{
				"mRender": function(data, type, full) {
					sReturn = '<div>'+full.index+'</div>';
					return sReturn;
				},"orderable": true
			},
				{
				"mRender": function(data, type, full) {
					sReturn = '<div>'+full.title+'</div>';
					return sReturn;
				},"orderable": true
			},{
				"mRender": function(data, type, full) {

					sReturn = '<div>'+full.hot+'</div>';
					return sReturn;
				},"orderable": true
			},{
				"mRender": function(data, type, full) {
					// 使用 HTML a 标签来创建超链接
					var sReturn = '<div><a href="' + full.url + '" target="_blank">' + full.url + '</a></div>';

					return sReturn;
				},
				"orderable": true
			}
				,{
				"mRender": function(data, type, full) {

					sReturn = '<a href=\"javascript:Page.onModifyRecord('+full.index+')\"'
						+'class=\"btn default btn-xs red\"> <i class=\"fa fa-wrench\"></i>'
						+'修改</a>';
					sReturn += '<a href=\"javascript:Page.onDeleteRecord('+full.index+')\"'
						+'class=\"btn default btn-xs black\"> <i class=\"fa fa-trash-o\"></i>'
						+'删除</a>';
					sReturn += '<a href=\"javascript:Page.onModifyRecord1('+full.index+')\"'
						+"class=\"btn default btn-xs purple\"> <i class=\"fa fa-camera\"></i>"
						+'查看</a>';
					return sReturn;
				},"orderable": false
			}],

			"aLengthMenu": [[5,10,15,20,25,40,50],[5,10,15,20,25,40,50]],
			"fnDrawCallback": function(){$(".checkboxes").uniform();$(".group-checkable").uniform();},
			"ajax": {
				"url": servletRequest,
				"type": "POST",
				"data":data,
				"dataSrc": function(json) {
					console.log(json.aaData);
					console.log(JSON.stringify(json.aaData))
					resultList = json.aaData;
					return json.aaData; // 返回的 JSON 数据中的数据源位置
				}

			}
		});

		$('.datatable').find('.group-checkable').change(function () {
			var set = jQuery(this).attr("data-set");
			var checked = jQuery(this).is(":checked");
			jQuery(set).each(function () {
				if (checked) {
					$(this).attr("checked", true);
					$(this).parents('tr').addClass("active");
				} else {
					$(this).attr("checked", false);
					$(this).parents('tr').removeClass("active");
				}
			});
			jQuery.uniform.update(set);
		});
		$('.datatable').on('change', 'tbody tr .checkboxes', function () {
			$(this).parents('tr').toggleClass("active");
		});

		var tableWrapper = $('#sample_1_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper

		tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown



	}

	var  getMonitorRecordPrint = function(){
		var url = "../../weibohot_data_servlet_action";
		var data={};
		data.action="section_print";
		$.post(url,data,function(json){
			if(json.result_code==0){
				var list = json.aaData;
				var myhtml="";
				if(list!=undefined && list.length>0)
				{
					for(var i=0;i<list.length;i++) {
						var record=list[i];
						myhtml+="<tr><td class=\"highlight\">" +record.index+"</td>";
						myhtml+="<td>" +record.title+" </td>"
						myhtml+="<td>"+record.hot +"</td>";
						myhtml+="<td class=\"highlight\">"+record.url+"</td>";
						myhtml+="</tr>";
					}
				}
			}
			$("#print_list").html(myhtml);
		});
	}

	//word打印
	var  getMonitorRecordPrint_Word = function(){

		var url = "../../weibohot_data_servlet_action";
		var data={};
		data.action="section_print";
		$.post(url,data,function(json){
			if(json.result_code==0){
				console.log(JSON.stringify(json));

				var list = json.aaData;
				var html="";
				if(list!=undefined && list.length>0)
				{
					for(var i=0;i<list.length;i++) {

						var record=list[i];
						html=html+"<tr style='height:26.95pt'>";
						html=html+" <td width=63 valign=top style='width:46.95pt;border:none;border-right:solid #C9C9C9 1.0pt;";
						html=html+"  background:white;padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
						html=html+" <p class=MsoNormal align=center style='text-align:center'><i><span";
						html=html+" lang=EN-US style='font-family:\"微软雅黑\",sans-serif'>"+record.index+"</span></i></p>";
						html=html+" </td>";
						html=html+" <td width=63 valign=top style='width:47.05pt;border-top:none;border-left:";
						html=html+" none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;";
						html=html+" padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
						html=html+" <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US";
						html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+record.title+"</span></p>";
						html=html+" </td>";
						html=html+" <td width=106 valign=top style='width:79.4pt;border-top:none;border-left:";
						html=html+"  none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;";
						html=html+"  padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
						html=html+" <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US";
						html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+record.hot+"</span></p>";
						html=html+" </td>";
						html=html+" <td width=63 valign=top style='width:47.05pt;border-top:none;border-left:";
						html=html+"  none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;";
						html=html+"  padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
						html=html+" <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US";
						html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+record.url+"</span></p>";
						html=html+" </td>";
						html=html+" </tr>";
					}
				}
			}
			$("#print_list_for_word").html(html);
		});


	}
	//数据获取函数--结束

	//on-functions begin
	var onAddRecord=function(){
		$("#record_add_div").modal("show");
	}

	var onQueryRecord=function(){
		$("#record_query_div").modal("show");
	}

	var onDeleteRecord = function(id){
		if(confirm("您确定要删除这条记录吗？")){
			if(id>-1){
				var url="../../weibohot_data_servlet_action";
				var data={};
				data.action="delete_section_record";
				data.id=id;
				$.post(url,data,function(json){
					if(json.result_code==0){
						alert("删除成功!");
						window.location.reload();
					}
				})
			}
		}
	}

	var onModifyRecord=function(id){
		for(var i=0;i<resultList.length;i++)
		{
			if(resultList[i].index==id){
				$("#_id").text(resultList[i].index);
				$("#record_modify_div #title").val(resultList[i].title);
				$("#record_modify_div #hot").val(resultList[i].hot);
				$("#record_modify_div #url").val(resultList[i].url);

			}
		}
		$("#record_modify_div").modal("show");
	}

	var onModifyRecord1=function(id){
		//查看回显

		for(var i=0;i<resultList.length;i++)
		{
			if(resultList[i].index==id){

				$("#_id").text(resultList[i].index);
				$("#record_view_div #title").val(resultList[i].title);
				$("#record_view_div #hot").val(resultList[i].hot);
				$("#record_view_div #url").val(resultList[i].url);

			}
		}
		$("#record_view_div").modal("show");
	}


	//on-functions end

	//添加热度
	var submitAddRecord=function(){

		var url="../../weibohot_data_servlet_action";
		var data={};
		data.action="add_section_record";
		data.title=$("#record_add_div #title").val();

		data.hot=$("#record_add_div #hot").val();
		data.url=$("#record_add_div #url").val();

		if(checkValid($("#record_add_div")))
		{

			$.post(url,data,function(json){
				if(json.result_code===0){
					alert("已经完成热榜添加。");
					window.location.reload();
				}
			});
		}
		else
		{
			alert("请按照合法格式输入内容!");
		}


	}

	var myModifySubmit = function(id){
		if(confirm("您确定要修改该记录吗？")){
			var id=$("#record_modify_div #_id").text();
			var url="../../weibohot_data_servlet_action";
			var data={};
			data.action="modify_section_record";
			data.index=id;
			data.title=$("#record_modify_div #title").val(); //道路名称
			data.hot=$("#record_modify_div #hot").val();//速度限制
			data.url=$("#record_modify_div #url").val(); //车速限制

				$.post(url,data,function(json){
					if(json.result_code==0){
						alert("已经完成道路修改。");
						window.location.reload();
					}
				});



		}

	}
	//获取
   var myAllSubmit=function(){
	   var url = "../../weibohot_data_servlet_action";
	   var data={};
	   data.action="get_api_record";
	   $.get(url, data, function(json){
		   location.reload(); // 在这里添加页面刷新
	   });

   }



	var myQuerySubmit = function(){

		var url = "../../weibohot_data_servlet_action";
		var data={};
		data.action="query_section_record";
		data.title=$("#record_query_div #title").val();

		if(checkValid($("#record_query_div")))
		{
			$("#record_query_div").modal("hide");

			getMonitorRecordDatatable(data);
		}
		else
		{
			alert("请按照合法格式输入内容!");
		}

	}

	var myExportAPI = function(){
		var url = "../../weibohot_data_servlet_action";
		var data = {};
		data.action = "export_record";

		$.post(url, data, function(json){
			if(json.result_code_for_export == 0){
				$("#record_export_div #download_url").attr("data-download_url", "http://localhost:8080" + json.download_url);
				$("#record_export_div").modal("show");
			}
		});
	}

// 在页面加载完成后，为下载链接添加点击事件处理程序
	$(document).ready(function(){
		$("#download_url").on("click", function(e){
			// 阻止默认行为，防止链接直接打开
			e.preventDefault();

			// 获取下载链接
			var downloadUrl = $("#download_url").attr("data-download_url");
			// 创建一个隐藏的 <a> 元素
			var downloadLink = document.createElement("a");
			downloadLink.href = downloadUrl;
			downloadLink.download = "exported_weibo.xls";

			// 将 <a> 元素添加到页面并触发点击
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
			setTimeout(function() {
				$("#record_export_div").modal("hide");
			}, 1000);
		});
	});

	var myPrintAPI = function(){
		window.open("section_print_default.jsp");
	}

	var myPrintAPI_Word = function(){
		window.open("section_print_word.jsp");

	}

	var myStatisticsAPI = function() {
		window.open("weibotongji.jsp");
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

			barContainer.style.display="none";
			beginMinuteContainer.style.borderColor="#d6e9c6";
			endMinuteContainer.style.borderColor="#d6e9c6";
			initMonitorStatistics(time_from,time_to);
		}


	}
	//submit functions end

	var returnBack = function(){
		history.go(-1);
	}

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

		for(var j = 0;j<24;j++)
		{
			if(checkHour[j]===true)
			{

				var hour = parseInt(list[myIndex].time_interval);

				var hourStr="";
				if(hour<10)
				{
					hourStr ="0"+ hour.toString()
				}
				else
				{
					hourStr = hour.toString();
				}
				var json={"hour":hourStr,"legalCars":list[myIndex].legal_total,"illegalCars":list[myIndex].illegal_total};
				chartData.push(json);
				myIndex++;
			}
			else
			{
				var my_json ="";
				if(j<10)
				{
					hourStr ="0"+j.toString();
					my_json = {"hour": hourStr,"legalCars":0,"illegalCars":0};
				}
				else
				{
					hourStr =j.toString();
					my_json = {"hour": hourStr,"legalCars":0,"illegalCars":0};
				}
				chartData.push(my_json);
			}


		}

	}

	var changeResultDataToChartForTypes = function(list) {
		var json = "";
		recordData = [];
		for (var i = 0; i < list.length; i++)
		{
			json = {"vehicle_type":list[i].vehicle_type,"num":parseInt(list[i].num)};
			recordData.push(json);
		}

	}

	//解析函数--开始
	var explainIllegalCode = function(code) {
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
			console.log(code);
			return "数据错误";
		}


	}


	var explainIllegalCode_Contrary1 = function(code) {
		//alert(code)
		if(code === "是")
		{
			return 1;
		}
		else if(code === "否")
		{
			return "2";
		}


	}


	var explainIllegalCode_Contrary = function(code) {
		//alert(code)
		if(code === "1")
		{
			return "是";
		}
		else if(code === "2")
		{
			return "否";
		}


	}

	//进行路程解析
	var routeAnalysis = function(start_x,start_y,end_x,end_y) {
		if(start_x!=null&&start_y!=null&&end_x!=null&&end_y!=null)
		{
			var num = (end_x-start_x)*(end_x-start_x)+(end_y-start_y)*(end_y-start_y);
			num = Math.sqrt(num);



			return num;
		}
		else
		{
			console.log("route analysis error!");
			return 0;
		}
	}

	//进行速度解析
	var speedAnalysis = function(start_x,start_y,end_x,end_y,start_time,end_time) {
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

			return speed;
		}
		else
		{
			console.log("error!");
			return 0;
		}

	}

	//解析函数--结束

	//输入判断函数--开始
	var checkInputValid = function(key) {
		var invalidKeys=['=','+','{','}','\'','/',',',
			'\\','"',';','?','!','%','&','*','#','$','^','(',')']

		for(var i = 0;i<invalidKeys.length;i++)
		for(var i = 0;i<invalidKeys.length;i++)
		{
			if(key===invalidKeys[i])
			{
				return false;
			}
		}

		return true;

	}

	var checkValid = function(element) {

		resetInputCss();
		illegalInput = [];
		var inputElements = element.find("input");
		var timeAddCheck = element.find("timeAddCheck");
		var check =  true;
		var str = "";

		var elementArray = [];
		var checkTimeArray = ["capture_time_from","capture_time_sec_from"
			,"capture_time_to","capture_time_sec_to"]

		var start_time;
		var end_time;

		inputElements.each(function(){

			var recentElem = $(this);
			str = recentElem.val();
			for(var i = 0;i<str.length;i++)
			{
				var myCh = str[i];
				if(!checkInputValid(myCh))
				{
					check = false;
					illegalInput.push($(this));
				}
			}

			//取timepicker中每个不为空的输入栏
			for(var i = 0;i<4;i++)
			{
				if(recentElem.attr("id")===checkTimeArray[i])
				{
					elementArray[i] = recentElem;
				}
			}


		})


		//判断是否出现结束时间>开始时间的情况
		console.log(elementArray);
		if(elementArray.length!==0)
		{
			if(elementArray[0].val()!==""&&elementArray[1].val()!==""
				&&elementArray[2].val()!==""&&elementArray[3].val()!=="")
			{
				console.log(111);
				start_time = elementArray[0].val()+elementArray[1].val();
				end_time = elementArray[2].val()+elementArray[3].val();

				if(start_time>end_time)
				{
					check = false;
					for(var i = 0;i<elementArray.length;i++)
					{
						illegalInput.push(elementArray[i]);
					}
				}
			}
		}
		inValidManager();
		return check;
	}


	var inValidManager = function(){
		for(var i = 0;i<illegalInput.length;i++)
		{
			illegalInput[i].css({
				"border-color" : "#a94442"
			});
		}
	}

	var resetInputCss = function()
	{
		for(var i = 0;i<illegalInput.length;i++)
		{
			illegalInput[i].css({
				"border-color" : "#cccccc"
			});
		}
	}
	//输入判断函数--结束



	//Page return 开始
	return {
		init: function() {
			initPageControl();
		},
		onDeleteRecord:function(id){
			onDeleteRecord(id);
		},
		onModifyRecord:function(id) {
			onModifyRecord(id);
		},
		onModifyRecord1:function(id) {
			onModifyRecord1(id);
		},

	}
}();
