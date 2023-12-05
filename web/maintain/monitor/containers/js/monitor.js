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
				console.log(JSON.stringify(json));

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

		var servletRequest ="../../monitor_data_servlet_action";
		resultList=[];

		if(data==undefined)
		{
			data={};
			data.action="get_monitor_record";
		}

		$('.datatable').DataTable().destroy();

		$('.datatable').dataTable( {

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
					sReturn = '<div>'+full.id+'</div>';
					return sReturn;
				},"orderable": true
			},{
				"mRender": function(data, type, full) {
					sReturn = '<div>'+full.car_code+'</div>';
					return sReturn;
				},"orderable": true
			},{
				"mRender": function(data, type, full) {

					sReturn = '<div>'+full.vehicle_type+'</div>';
					return sReturn;
				},"orderable": true
			},{
				"mRender": function(data, type, full) {

					sReturn = '<div>'+explainIllegalCode(full.illegal_status)+'</div>';
					return sReturn;
				},"orderable": true
			},{
				"mRender": function(data, type, full) {

					sReturn = '<div>'+full.capture_time+'</div>';
					return sReturn;
				},"orderable": true
			},{
				"mRender": function(data, type, full) {

					sReturn = '<div>'+full.speed+'</div>';
					return sReturn;
				},"orderable":true
			},{
                "mRender": function(data, type, full) {

                    sReturn = '<div>'+full.lane_name+'</div>';
                    return sReturn;
                },"orderable":true
            },{
				"mRender": function(data, type, full) {

					sReturn = '<a href=\"javascript:Page.onModifyRecord('+full.id+')\"'
						+'class=\"btn default btn-xs red\"> <i class=\"fa fa-wrench\"></i>'
						+'修改</a>';
					sReturn += '<a href=\"javascript:Page.onDeleteRecord('+full.id+')\"'
						+'class=\"btn default btn-xs black\"> <i class=\"fa fa-trash-o\"></i>'
						+'删除</a>';
					sReturn += '<a href=\"javascript:Page.onViewRecord('+full.id+')\"'
						+"class=\"btn default btn-xs purple\"> <i class=\"fa fa-camera\"></i>"
						+'查看</a>';
					return sReturn;
				},"orderable": false
			}],

			"aLengthMenu": [[5,10,15,20,25,40,50],[5,10,15,20,25,40,50]],
			"fnDrawCallback": function(){$(".checkboxes").uniform();$(".group-checkable").uniform();},
			//"sAjaxSource": "get_record.jsp"
			"ajax": {
				"url": servletRequest,
				"type": "POST",
				"data":data,
				"dataSrc": function(json) {
					console.log(json.aaData);
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
		var url = "../../monitor_data_servlet_action";
		var data={};
		data.action="monitor_print";
		$.post(url,data,function(json){
			if(json.result_code==0){
				console.log(JSON.stringify(json));

				var list = json.aaData;

				var myhtml="";
				if(list!=undefined && list.length>0)
				{
					for(var i=0;i<list.length;i++) {

						var record=list[i];
						myhtml+="<tr><td class=\"highlight\">" +record.id+"</td>";
						myhtml+="<td>" +record.car_code+" </td>"
						myhtml+="<td>"+record.vehicle_type +"</td>";
						myhtml+="<td class=\"highlight\">"+explainIllegalCode(record.illegal_status) +"</td> "
						myhtml+="<td class=\"highlight\">"+record.capture_time+"</td>";
						myhtml+="<td>"+record.speed+"</td>";
						myhtml+="<td class=\"highlight\">"+record.lane_name+ "</td>";
						myhtml+="</tr>";
					}
				}
			}
			$("#print_list").html(myhtml);
		});


	}

	var  getMonitorRecordPrint_Word = function(){
		var url = "../../monitor_data_servlet_action";
		var data={};
		data.action="monitor_print";
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
						html=html+" lang=EN-US style='font-family:\"微软雅黑\",sans-serif'>"+record.id+"</span></i></p>";
						html=html+" </td>";
						html=html+" <td width=63 valign=top style='width:47.05pt;border-top:none;border-left:";
						html=html+" none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;";
						html=html+" padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
						html=html+" <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US";
						html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+record.car_code+"</span></p>";
						html=html+" </td>";
						html=html+" <td width=106 valign=top style='width:79.4pt;border-top:none;border-left:";
						html=html+"  none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;";
						html=html+"  padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
						html=html+" <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US";
						html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+record.vehicle_type+"</span></p>";
						html=html+" </td>";
						html=html+" <td width=63 valign=top style='width:47.05pt;border-top:none;border-left:";
						html=html+"  none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;";
						html=html+"  padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
						html=html+" <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US";
						html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+explainIllegalCode(record.illegal_status)+"</span></p>";
						html=html+" </td>";
						html=html+" <td width=63 valign=top style='width:47.05pt;border-top:none;border-left:";
						html=html+" none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;";
						html=html+" padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
						html=html+" <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US";
						html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+record.capture_time+"</span></p>";
						html=html+" </td>";
						html=html+" <td width=63 valign=top style='width:47.05pt;border-top:none;border-left:";
						html=html+"  none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;";
						html=html+"  padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
						html=html+" <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US";
						html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+record.speed+"</span></p>";
						html=html+" </td>";
						html=html+" <td width=63 valign=top style='width:47.05pt;border-top:none;border-left:";
						html=html+"  none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;";
						html=html+"  padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
						html=html+" <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US";
						html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+record.lane_name+"</span></p>";
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
				var url="../../monitor_data_servlet_action";
				var data={};
				data.action="delete_monitor_record";
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

		console.log(id);

		for(var i=0;i<resultList.length;i++)
		{
			if(resultList[i].id==id){
				$("#_id").text(resultList[i].id);
				$("#record_modify_div #car_code").val(resultList[i].car_code);
				$("#record_modify_div #vehicle_type").val(resultList[i].vehicle_type);
				$("#record_modify_div #illegal_status").val(explainIllegalCode(resultList[i].illegal_status));

				$("#record_modify_div #speed").val(resultList[i].speed);
				$("#record_modify_div #lane_name").val(resultList[i].lane_name);
				var date="";
				var time ="";
				date =resultList[i].capture_time.slice(0,11);
				time=resultList[i].capture_time.slice(11,19);
				$("#record_modify_div #capture_time").val(date);
				$("#record_modify_div #capture_time_sec").val(time);
			}
		}


		//window.location.href="device_modify.jsp?id="+id;
		$("#record_modify_div").modal("show");
	}

	var onViewRecord = function(id){
		window.location.href = "monitor_view.jsp?id="+id;
	}

	var onAjaxUploadFile=function(){
		console.log("[onAjaxUploadFile]====");
		var deviceId = $("#device_id").val();
		var deviceName = $("#device_name").val();
		var options = {
			type : 'post', /*设置表单以post方法提交*/
			url : '../../monitor_data_servlet_action?action=upload_file&device_id='+deviceId+"&device_name="+deviceName, /*设置post提交到的页面*/
			success : function(json) {
				console.log("[onAjaxUploadFile]上传文件返回结果="+JSON.stringify(json));
				if(json.upload_files.length>0){
					var files=json.upload_files;
					var fileUrl = files[0].file_url_name;
					var objectId = files[0].file_object_id;
					$("#current_attachment_name").html("您当前上传的附件是：<span style='color:blue;'><a href='javascript:window.open(\""+fileUrl+"\")'>" + fileUrl + "</a></span>");
					$("#current_attachment_object_id").val(objectId);

					var html="";
					html+="<video width=\"640\" height=\"360\" controls>";
					html+="<source src='"+fileUrl+"' type=\"video/mp4\">"+"</video>"

					$("#video_row").html(html);
					console.log("[onAjaxUploadFile]fileUrl="+fileUrl);
					console.log("[onAjaxUploadFile]objectId="+objectId);
				}else{
					alert("[onAjaxUploadFile]没有上传文件结果返回！");
				}
			},
			error : function(error) {
				alert(error);
			},
			dataType : "json" /*设置返回值类型为文本*/
		};
		$("#ajax_form").ajaxSubmit(options);
	}
	//on-functions end

	//submit functions begin
	var submitAddRecord=function(){
		var url="../../monitor_data_servlet_action";
		var data={};
		data.action="add_monitor_record";

		var check = false;
		var checkCol = [];
		data.car_code=$("#record_add_div #car_code").val();
		data.vehicle_type=$("#record_add_div #vehicle_type").val();
		data.illegal_status=explainIllegalCode_Contrary($("#record_add_div #illegal_status").val());
		data.capture_time=$("#record_add_div #capture_time").val()+" "
			+$("#record_add_div #capture_time_sec").val();
		data.speed=$("#record_add_div #speed").val();
		data.lane_name=$("#record_add_div #lane_name").val();

		if(checkValid($("#record_add_div")))
		{
			console.log(data);
			$.post(url,data,function(json){
				if(json.result_code===0){
					alert("已经完成设备添加。");
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
			var url="../../monitor_data_servlet_action";
			var data={};
			data.action="modify_monitor_record";
			data.id=id;
			data.car_code=$("#record_modify_div #car_code").val();
			data.vehicle_type=$("#record_modify_div #vehicle_type").val();
			data.illegal_status=explainIllegalCode_Contrary($("#record_modify_div #illegal_status").val());
			data.capture_time=$("#record_modify_div #capture_time").val()+" "
			+$("#record_modify_div #capture_time_sec").val();
			data.speed=$("#record_modify_div #speed").val();
			data.lane_name=$("#record_modify_div #lane_name").val();


			if(checkValid($("#record_modify_div")))
			{
				$.post(url,data,function(json){
					if(json.result_code==0){
						alert("已经完成设备修改。");
						window.location.reload();
					}
				});
			}
			else
			{
				alert("请按照合法格式输入内容!");
			}


		}

	}

	var myQuerySubmit = function(){

		var url = "../../monitor_data_servlet_action";
		var data={};
		var query = "query_monitor_record";
		var time_from = $("#record_query_div #capture_time_from").val();
		var time_to = $("#record_query_div #capture_time_to").val();
		data.action="query_monitor_record";

		data.id=$("#record_query_div #id").val();
		data.car_code=$("#record_query_div #car_code").val();
		data.vehicle_type=$("#record_query_div #vehicle_type").val();
		data.illegal_status=explainIllegalCode_Contrary($("#record_query_div #illegal_status").val());
		data.time_from = time_from;
		data.time_to = time_to;
		if(time_from!=="")
		{
			data.time_from+=" "+$("#record_query_div #capture_time_sec_from").val();
		}

		if(time_to!=="")
		{
			data.time_to+=" " +$("#record_query_div #capture_time_sec_to").val();
		}

		data.speed=$("#record_query_div #speed").val();
		data.lane_name=$("#record_query_div #lane_name").val();

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
		var url = "../../monitor_data_servlet_action";
		var data={};
		data.action="export_record";
		$.post(url,data,function(json){

			if(json.result_code_for_export==0){
				console.log(JSON.stringify(json));
				console.log(json.download_url);
				$("#record_export_div #download_url").attr("download_url",json.download_url);
				$("#record_export_div").modal("show");
			}
		});
	}

	var myPrintAPI = function(){
		window.open("monitor_print_default.jsp");
	}

	var myPrintAPI_Word = function(){
		window.open("monitor_print_word.jsp");

	}

	var myStatisticsAPI = function() {

		window.open("monitor_statistics.jsp");
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
		console.log(chartData);
		console.log(recordData);
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

	var explainIllegalCode_Contrary = function(code) {
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
		else if(code==="")
		{
			return code;
		}
		else
		{
			return 9;
		}


	}

	//进行路程解析
	var routeAnalysis = function(start_x,start_y,end_x,end_y) {
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
		var invalidKeys=['-','=','+','{','}','\'','/',',',
			'\\','"',':',';','?','!','%','&','*','#','$','^','(',')']

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
		var check =  true;
		var str = "";

		var elementArray = [];
		var checkTimeArray = ["capture_time_begin","capture_time_sec_begin"
			,"capture_time_end","capture_time_sec_end"]

		var start_time;
		var end_time;

		//判断总车流量是不是数字
		if(jQuery.type(element.find("#total_num"))!=="number")
		{
			illegalInput.push($(this));
			check = false;
		}
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

			inValidManager();
		})

		//判断是否出现结束时间>开始时间的情况
		console.log(elementArray);
		if(elementArray.length!==0)
		{
			if(elementArray[0].val()!==""&&elementArray[1].val()!==""
				&&elementArray[2].val()!==""&&elementArray[3].val()!=="")
			{
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

		onViewRecord:function(id){
			onViewRecord(id);
		}
	}
}();//Page
/*================================================================================*/
