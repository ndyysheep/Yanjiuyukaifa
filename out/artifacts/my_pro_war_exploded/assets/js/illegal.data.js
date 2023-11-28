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
	Page.init();//页面初始化

});
/* ================================================================================ */


//关于页面的控件生成等操作都放在Page里
var Page = function() {
	/*----------------------------------------入口函数  开始----------------------------------------*/
	var initPageControl=function(){
		pageId = $("#page_id").val();
		if(pageId==="illegal_list"){
			//设备列表页面
			initIllegalDataList();
		}

		if(pageId==="illegal_data_view"){
			//详情页
			initIllegalDataView();
		}

		if(pageId==="illegal_data_print"){
			//打印页面
			initIllegalDataPrint();
		}
		if(pageId==="illegal_data_print_word"){
			//Word打印页面
			initIllegalDataPrint_Word();
		}

		if(pageId==="illegal_data_statistics"){
			//打印页面
			initIllegalDataStatistics();
		}
	};
	/*----------------------------------------入口函数  结束----------------------------------------*/
	var columnsData=undefined;
	var recordResult=undefined;
	var chartData=[{
		"year": 2009,
		"income": 23.5,
		"expenses": 18.1
	}, {
		"year": 2010,
		"income": 26.2,
		"expenses": 22.8
	}, {
		"year": 2011,
		"income": 30.1,
		"expenses": 23.9
	}, {
		"year": 2012,
		"income": 29.5,
		"expenses": 25.1
	}, {
		"year": 2013,
		"income": 30.6,
		"expenses": 27.2,
		"dashLengthLine": 5
	}, {
		"year": 2014,
		"income": 34.1,
		"expenses": 29.9,
		"dashLengthColumn": 5,
		"alpha": 0.2,
		"additional": "(projection)"
	}];
	/*----------------------------------------业务函数  开始----------------------------------------*/
	/*------------------------------针对各个页面的入口  开始------------------------------*/
	var initIllegalDataList=function(){

		initIllegalDataListControlEvent();
		initIllegalDataRecordList();
		initDeviceFile();

	}

	var initDeviceFile=function(){
		console.log("[initDeviceFile]");
		initDeviceFileControlEvent();
	}

	var initIllegalDataView = function(){
		initDeviceViewControlEvent();
		initDeviceRecordView();
	}

	var initIllegalDataPrint = function(){
		//initDevicePrintControlEvent();
		initDeviceRecordForPrint();
	}

	var initIllegalDataPrint_Word = function(){
		//initDevicePrintControlEvent();
		initDeviceRecordForPrint_Word();
	}

	var initIllegalDataStatistics = function(){
		//initDevicePrintControlEvent();
		$.ajaxSettings.async=false;
		initDeviceRecordForStatistics();
		$.ajaxSettings.async=true;
		initChartSets();
	}
	/*------------------------------针对各个页面的入口 结束------------------------------*/
	var getUrlParam=function(name){
		//获取url中的参数
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg);  //匹配目标参数
		if (r != null) return decodeURI(r[2]); return null; //返回参数值，如果是中文传递，就用decodeURI解决乱码，否则用unescape
	}

	//init-device_list functions begin
	var initIllegalDataListControlEvent=function(){
		$('#ac_query_button').click(function() {onQueryRecord(),initDeviceQuery();});
		$('#export_button').click(function() {myExportAPI();});
		$('#print_button').click(function() {myPrintAPI()});
		$('#print_button_for_word').click(function() {myPrintAPI_Word()});
		$('#statistics_button').click(function() {myStatisticsAPI()});

	}
	var onQueryRecord=function(){
		$("#illegal_record_query_div").modal("show");
	}

	var initDeviceQuery=function(){
		initDeviceQueryControlEvent();
	}
	var initDeviceQueryControlEvent=function(){
		$("#help_button").click(function() {help();});
		$('#illegal_record_query_div #query_button').click(function() {myQuerySubmit();});
	}
	var initDeviceViewControlEvent=function(){

		$('#return_button').click(function() {returnBack();});
	}


	var initIllegalDataRecordList=function(){
		//使用Datatable的数据表,统计总数据
		getDeviceRecordDatatable();

	}

	var initDeviceRecordForPrint=function(){
		getDeviceRecordPrint();
	}

	var initDeviceRecordForPrint_Word=function(){
		getDeviceRecordPrint_Word();
	}

	var  getDeviceRecordPrint = function(){
		var url = "../../illegal_file_servlet_action";
		var data={};
		data.action="illegal_data_print";
		$.post(url,data,function(json){
			if(json.result_code==0){
				console.log(JSON.stringify(json));

				var list = json.aaData;

				var myhtml="";
				if(list!=undefined && list.length>0)
				{
					for(var i=0;i<list.length;i++) {

						var record=list[i];
						myhtml+="<tr><td class=\"hidden-xs\">" +record.id+"</td>";
						myhtml+="<td>" +record.DeviceId+" </td>"
						myhtml+="<td>"+record.GPSTime +"</td>";
						myhtml+="<td class=\"hidden-xs\">"+record.RecvTime +"</td> "
						myhtml+="<td class=\"highlight\">"+record.Longitude+"</td>";
						myhtml+="<td>"+record.Latitude+"</td>";
						myhtml+="<td class=\"highlight\">"+parseInt(record.Speed)+ "</td>";
						myhtml+="<td class=\"highlight\">"+record.Direction+"</td>";
						myhtml+="<td>"+ record.location+"</td> </tr>";
					}
				}
			}
			$("#print_list").html(myhtml);
		});


	}

	var  getDeviceRecordPrint_Word = function(){
		var url = "../../illegal_file_servlet_action";
		var data={};
		data.action="illegal_data_print";
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
						html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+record.DeviceId+"</span></p>";
						html=html+" </td>";
						html=html+" <td width=106 valign=top style='width:79.4pt;border-top:none;border-left:";
						html=html+"  none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;";
						html=html+"  padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
						html=html+" <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US";
						html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+record.GPSTime+"</span></p>";
						html=html+" </td>";
						html=html+" <td width=63 valign=top style='width:47.05pt;border-top:none;border-left:";
						html=html+"  none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;";
						html=html+"  padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
						html=html+" <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US";
						html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+record.Longitude+"</span></p>";
						html=html+" </td>";
						html=html+" <td width=63 valign=top style='width:47.05pt;border-top:none;border-left:";
						html=html+" none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;";
						html=html+" padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
						html=html+" <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US";
						html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+record.Latitude+"</span></p>";
						html=html+" </td>";
						html=html+" <td width=63 valign=top style='width:47.05pt;border-top:none;border-left:";
						html=html+"  none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;";
						html=html+"  padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
						html=html+" <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US";
						html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+parseInt(record.Speed)+"</span></p>";
						html=html+" </td>";
						html=html+" <td width=63 valign=top style='width:47.05pt;border-top:none;border-left:";
						html=html+"  none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;";
						html=html+"  padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
						html=html+" <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US";
						html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+record.Direction+"</span></p>";
						html=html+" </td>";
						html=html+" <td width=63 valign=top style='width:47.4pt;border:none;background:white;";
						html=html+"  padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
						html=html+" <p class=MsoNormal align=center style='text-align:center'><i><span";
						html=html+" lang=EN-US style='font-family:\"微软雅黑\",sans-serif'>"+record.location+"</span></i></p>";
						html=html+" </td>";
						html=html+" </tr>";

					}
				}
			}
			$("#print_list_for_word").html(html);
		});


	}

	var initDeviceRecordForStatistics =function(){
		var url = "../../illegal_file_servlet_action";
		var data={};
		data.action="illegal_data_statistics";
		$.post(url,data,function(json){
			if(json.result_code==0){
				console.log(JSON.stringify(json));

				var list = json.aaData;
				if(list!=undefined&&list.length>0){
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

	var initDeviceRecordView=function(){
		var id=getUrlParam("id");
		console.log("运行");
		var data={};
		data.action="get_illegal_data_record";
		data.id=id;
		$.post("../../"+module+"_"+sub+"_servlet_action",data,function(json){
			console.log(JSON.stringify(json));
			if(json.result_code==0){
				var list=json.aaData;
				if(list!=undefined && list.length>0){
					for(var i=0;i<list.length;i++){
						var record=list[i];
						$("#my_id").text(record.id);
						$("#record_view  #DeviceId").text(record.DeviceId);
						$("#record_view #Longitude").text(record.Longitude);
						$("#record_view  #Latitude").text(record.Latitude);
						$("#record_view  #Speed").text(record.Speed);
						$("#record_view #Direction").text(record.Direction);
						$("#record_view #Location").text(record.location);
						$("#record_view #GPS_Time").text(record.GPSTime);
						$("#record_view #Recv_Time").text(record.RecvTime);


					}
				}


			}
		})
	}

	//get_record functions begin
	var resultList=[];

	var getDeviceRecordDatatable =function(data){

		var servletRequest ="../../illegal_data_servlet_action";
		if(data==undefined)
		{
			data={};
			data.action="get_illegal_record";
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
				},"orderable": false
			},{
				"mRender": function(data, type, full) {
					sReturn = '<div>'+full.car_code+'</div>';
					return sReturn;
				},"orderable": false
			},{
				"mRender": function(data, type, full) {
					sReturn = '<div>'+full.vehicle_type+'</div>';
					return sReturn;
				},"orderable": false
			},{
				"mRender": function(data, type, full) {
					sReturn = '<div>'+explainIllegalCode(full.illegal_status)+'</div>';
					return sReturn;
				},"orderable": false
			},{
				"mRender": function(data, type, full) {
					sReturn = '<div>'+full.capture_time+'</div>';
					return sReturn;
				},"orderable": false
			},{
				"mRender": function(data, type, full) {
					var speed=speedAnalysis(full.start_lines_x1,full.start_lines_y1
						,full.end_lines_x2,full.end_lines_y2,full.time_start,full.time_end)
					sReturn = '<div>'+speed+'</div>';
					return sReturn;
				},"orderable": false
			},{
                "mRender": function(data, type, full) {
                    sReturn = '<div>'+full.lane_name+'</div>';
                    return sReturn;
                },"orderable": false
            },{
				"mRender": function(data, type, full) {

					sReturn = '<div>'+'<a href=\"'+full.image_url+'\"'
						+ "class=\"btn default btn-xs blue\"" +' target=\"_blank\">'
						+"<i class=\"fa fa-share\"></i>"+'查看</a>'+'</div>';
					return sReturn;
				},"orderable": false
			},{
				"mRender": function(data, type, full) {

					sReturn = '<a href=\"javascript:Page.onDeleteRecord('+full.id+')\"'
						+'class=\"btn default btn-xs black\"> <i class=\"fa fa-trash-o\"></i>'
						+'删除记录</a>';
					sReturn += '<a href=\"javascript:Page.onViewRecord('+full.id+')\"'
						+"class=\"btn default btn-xs purple\"> <i class=\"fa fa-camera\"></i>"
						+'查看记录</a>';
					return sReturn;
				},"orderable": false
			}],
			"aLengthMenu": [[5,10,15,20,25,40,50],[5,10,15,20,25,40,50]],
			"fnDrawCallback": function(){$(".checkboxes").uniform();$(".group-checkable").uniform();},
			//"sAjaxSource": "get_record.jsp"
			//"data":data.aaData,			//这个用来显示不从后台交互获取数据的情况下，显示当前页面已经有的json数据
			"ajax": {
				"url": servletRequest,
				"type": "POST",
				"data":data
			}
			//"sAjaxSource": "../../illegal_data_servlet_action?action=get_illegal_record"
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

	//get_record functions end

	//on-functions begin

	var onDeleteRecord = function(id){
		if(confirm("您确定要删除这条记录吗？")){
			if(id>-1){
				var url="../../illegal_data_servlet_action";
				var data={};
				data.action="delete_illegal_record";

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

	var onViewRecord = function(id){
		window.location.href = "illegal_data_view.jsp?id="+id;
	}
	//on-functions end


	//init-illegal_file functions begin
	var initDeviceFileControlEvent=function(id){
		$('#upload_button').click(function() {onAjaxUploadFile();});
		console.log("[initDeviceFileControlEvent]");
	}

	//init-illegal_file functions end




	var onAjaxUploadFile=function(){
		console.log("[onAjaxUploadFile]====");
		var deviceId = $("#device_id").val();
		var deviceName = $("#device_name").val();
		var options = {
			type : 'post', /*设置表单以post方法提交*/
			url : '../../illegal_data_servlet_action?action=upload_file',
			success : function(json) {
				console.log("[onAjaxUploadFile]上传文件返回结果="+JSON.stringify(json));
				if(json.upload_files.length>0){
					var files=json.upload_files;
					var fileUrl = files[0].file_url_name;
					var objectId = files[0].file_object_id;
					$("#current_attachment_name").html("您当前上传的附件是：<span style='color:blue;'><a href='javascript:window.open(\""+fileUrl+"\")'>" + fileUrl + "</a></span>");
					$("#current_attachment_object_id").val(objectId);

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


	//submit functions begin


	var myQuerySubmit = function(){

		var url = "../../illegal_data_servlet_action";
		var data={};

		data.action="query_illegal_data_record";

		data.id=$("#illegal_record_query_div #id").val();
		data.car_code=$("#illegal_record_query_div #car_code").val();
		data.vehicle_type=$("#illegal_record_query_div #vehicle_type").val();
		data.speed=$("#illegal_record_query_div #speed").val();
		data.lane_name=$("#illegal_record_query_div #lane_name").val();

		getDeviceRecordDatatable(data);
	}
	var myExportAPI = function(){
		var url = "../../illegal_file_servlet_action";
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
		window.open("illegal_data_print_default.jsp");
	}
	var myPrintAPI_Word = function(){
		window.open("illegal_data_print_word.jsp");

	}
	var myStatisticsAPI = function() {
		window.open("illegal_data_statistics.jsp");
	}
	//submit functions end

	var returnBack = function(){
		history.go(-1);
	}

	var changeResultDataToChart =function(list, chartData){


		for(var i=0;i<list.length;i++){
			var json={"year":list[i].time_interval,"income":list[i].total,"expenses":list[i].total};
			chartData.push(json);
		}

	}

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
		},
		onDeleteRecord:function(id){
			onDeleteRecord(id);
		},
		onViewRecord:function(id){
			onViewRecord(id);
		}
	}
}();//Page
/*================================================================================*/
