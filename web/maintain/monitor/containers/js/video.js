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
		if(pageId==="video_operate"){
			$("#video_lists").addClass("active open")
			$(".sub-menu #video_analysis").addClass("active");
			//设备列表页面
			initVideoControl();
		}

	};
	/*----------------------------------------入口函数  结束----------------------------------------*/
	/*----------------------------------------业务函数  开始----------------------------------------*/
	/*------------------------------针对各个页面的入口  开始------------------------------*/
	var initVideoControl=function(){

		initVideoControlEvent();
	}

	/*------------------------------针对各个页面的入口 结束------------------------------*/

	//事件处理初始化--开始
	var initVideoControlEvent=function(){

		$('#get_back_button').click(function() {getBackRecognition();});
		$('#get_flow_button').click(function() {getFlowRecognition();});
		$('#get_red_button').click(function() {getRedRecognition()});
		$('#get_carId_button').click(function() {getCarIdRecognition()});
		$('#get_double_button').click(function() {getDoubleRecognition()});

	}

	//事件处理初始化--结束


	//分流处理函数--开始

	var getBackRecognition = function()
	{
		var url = "../../video_data_servlet_action"
		var data = {};
		data.action="get_back_record";
		data.file_path_name= $("#video_div video source").attr("src");
		$.post(url,data,function(json){

			console.log(JSON.stringify(json));
			if(json.result_code===0)
			{
				if(json.file_path!==null){

					var fileUrl = json.file_path;
					var html="";
					html+="<video width=\"640\" height=\"360\" controls style=\"width: 100%;height: auto;\">";
					html+="<source src='"+fileUrl+"' type=\"video/mp4\">"+"</video>"
					$("#result_div").html(html);

					console.log("[onAjaxUploadFile]fileUrl="+fileUrl);


				}else{
					alert("[onAjaxUploadFile]没有上传文件结果返回！");
				}
			}
			else
			{
				alert("failed! code="+json.errMsg);
			}
		});
	}

	var getFlowRecognition = function()
	{
		var url = "../../video_data_servlet_action"
		var data = {};
		data.action="get_flow_record";
		data.file_path_name= $("#video_div video source").attr("src");
		$.post(url,data,function(json){

			console.log(JSON.stringify(json));
			if(json.result_code===0)
			{
				console.log(JSON.stringify(json));
				if(json.file_path!==null){
					var fileUrl = json.file_path;
					var html="";
					html+="<video width=\"640\" height=\"360\" controls style=\"width: 100%;height: auto;\">";
					html+="<source src='"+fileUrl+"' type=\"video/mp4\">"+"</video>"
					$("#result_div").html(html);
					console.log("[onAjaxUploadFile]fileUrl="+fileUrl);

					if(json.flowData[0]!=null)
					{
						var record = json.flowData[0];
						var numberHtml = "";
						var beginTime = new Date(record.beginDatetime);
						var endTime = new Date(record.endDatetime);
						var difference = (endTime.getTime() - beginTime.getTime()) / 1000;
						numberHtml+="<div class=\"number-item\">\n" +
							"                            <div class=\"number-title\">\n" ;
						numberHtml+=record.totalNum;
						numberHtml+="                            </div>\n" +
							"                            <div class=\"number-text\">\n" +
							"                                总车流量\n" +
							"                            </div>\n" +
							"                        </div>"

						numberHtml+="<div class=\"number-item\">\n" +
							"                            <div class=\"number-title\">\n" ;
						numberHtml+=difference;
						numberHtml+="                            </div>\n" +
							"                            <div class=\"number-text\">\n" +
							"                                统计时间(秒)\n" +
							"                            </div>\n" +
							"                        </div>"
						$("#center-top-div").html(numberHtml);
						$("#center-top-div").show();
					}
					else{
						alert("[onAjaxUploadFile]没有上传文件结果返回！");
					}

				}else{
					alert("[onAjaxUploadFile]没有上传文件结果返回！");
				}
			}
			else
			{
				alert("failed! code="+json.errMsg);
			}
		});
	}

	var getRedRecognition = function()
	{
		var url = "../../video_data_servlet_action"
		var data = {};
		data.action="get_red_record"
		data.file_path_name= $("#video_div video source").attr("src");
		$.post(url,data,function(json){

			console.log(JSON.stringify(json));
			if(json.result_code===0)
			{
				console.log(JSON.stringify(json));
				if(json.result_code===0)
				{
					console.log(JSON.stringify(json));
					if(json.file_path!==null){
						var fileUrl = json.file_path;
						var html="";
						html+="<video width=\"640\" height=\"360\" controls style=\"width: 100%;height: auto;\">";
						html+="<source src='"+fileUrl+"' type=\"video/mp4\">"+"</video>"
						$("#result_div").html(html);
						console.log("[onAjaxUploadFile]fileUrl="+fileUrl);

						var redNum  = json.redLineData.length;
						var numberHtml = "";

						numberHtml+="<div class=\"number-item\">\n" +
							"                            <div class=\"number-title\">\n" ;
						numberHtml+=redNum;
						numberHtml+="                            </div>\n" +
							"                            <div class=\"number-text\">\n" +
							"                                识别闯红灯数量\n" +
							"                            </div>\n" +
							"                        </div>"

						$("#center-top-div").html(numberHtml);
						$("#center-top-div").show();

						var tableHtml = "";
						tableHtml+="<th>车辆ID</th>\n"+
							"<th>横坐标</th>\n" +
							"<th>纵坐标</th>\n" +
							"<th>记录时间</th>\n" ;
						$("#tableHead").html(tableHtml);
						getRedLightDatatable(json.redLineData);
						$("#row_res").show();
					}else{
						alert("[onAjaxUploadFile]没有上传文件结果返回！");
					}
				}else{
					alert("[onAjaxUploadFile]没有上传文件结果返回！");
				}
			}
			else
			{
				alert("failed! code="+json.errMsg);
			}
		});
	}

	var getCarIdRecognition= function()
	{
		var url = "../../video_data_servlet_action"
		var data = {};
		data.action="get_carId_record";
		data.file_path_name= $("#video_div video source").attr("src");
		$.post(url,data,function(json){

			console.log(JSON.stringify(json));
			if(json.result_code===0)
			{
				console.log(JSON.stringify(json));
				if(json.result_code===0)
				{
					console.log(JSON.stringify(json));
					if(json.file_path!==null){
						var fileUrl = json.file_path;
						var html="";
						html+="<video width=\"640\" height=\"360\" controls style=\"width: 100%;height: auto;\">";
						html+="<source src='"+fileUrl+"' type=\"video/mp4\">"+"</video>"
						$("#result_div").html(html);
						console.log("[onAjaxUploadFile]fileUrl="+fileUrl);

						var carNum  = json.carIDData.length;
						var numberHtml = "";

						numberHtml+="<div class=\"number-item\">\n" +
							"                            <div class=\"number-title\">\n" ;
						numberHtml+=carNum;
						numberHtml+="                            </div>\n" +
							"                            <div class=\"number-text\">\n" +
							"                                识别车牌数量\n" +
							"                            </div>\n" +
							"                        </div>"

						$("#center-top-div").html(numberHtml);
						$("#center-top-div").show();

						var tableHtml = "";
						tableHtml+="<th>车辆序号</th>\n" +
							"<th>车牌号</th>\n" +
							"<th>记录时间</th>\n" ;
						$("#tableHead").html(tableHtml);
						getCarCodeResultDatatable(json.carIDData);
						$("#row_res").show();

					}else{
						alert("[onAjaxUploadFile]没有上传文件结果返回！");
					}
				}else{
					alert("[onAjaxUploadFile]没有上传文件结果返回！");
				}
			}
			else
			{
				alert("failed! code="+json.errMsg);
			}
		});
	}

	var getDoubleRecognition= function()
	{
		var url = "../../video_data_servlet_action"
		var data = {};
		data.action="get_double_record";
		data.file_path_name= $("#video_div video source").attr("src");
		$.post(url,data,function(json){

			console.log(JSON.stringify(json));
			if(json.result_code===0)
			{
				console.log(JSON.stringify(json));
				if(json.result_code===0)
				{
					console.log(JSON.stringify(json));
					if(json.file_path!==null){
						var fileUrl = json.file_path;
						var html="";
						html+="<video width=\"640\" height=\"360\" controls style=\"width: 100%;height: auto;\">";
						html+="<source src='"+fileUrl+"' type=\"video/mp4\">"+"</video>"
						$("#result_div").html(html);
						console.log("[onAjaxUploadFile]fileUrl="+fileUrl);

						var doubleLineNum  = json.doubleLineData.length;
						var numberHtml = "";

						numberHtml+="<div class=\"number-item\">\n" +
							"                            <div class=\"number-title\">\n" ;
						numberHtml+=doubleLineNum;
						numberHtml+="                            </div>\n" +
							"                            <div class=\"number-text\">\n" +
							"                                识别压双黄线数量\n" +
							"                            </div>\n" +
							"                        </div>"

						$("#center-top-div").html(numberHtml);
						$("#center-top-div").show();

						var tableHtml = "";
						tableHtml+=
							"<th>横坐标</th>\n" +
							"<th>纵坐标</th>\n" +
							"<th>记录时间</th>\n" ;
						$("#tableHead").html(tableHtml);
						getDoubleLineDatatable(json.doubleLineData);
						$("#row_res").show();
					}else{
						alert("[onAjaxUploadFile]没有上传文件结果返回！");
					}
				}else{
					alert("[onAjaxUploadFile]没有上传文件结果返回！");
				}
			}
			else
			{
				alert("failed! code="+json.errMsg);
			}
		});
	}


	var getCarCodeResultDatatable =function(full){

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
			"data": full,
			"columns": [
				{
					"data": "carID",
					"render": function(data, type, row, meta) {
						// 在渲染函数中访问完整的行数据
						return '<div>' + row.carID + '</div>';
					},"orderable": true
				},
				{
					"data": "carCode","render": function(data, type, row, meta) {
						// 在渲染函数中访问完整的行数据
						return '<div>' + row.carCode + '</div>';
					},
					"orderable": true
				},
				{
					"data": "recordTime",
					"render": function(data, type, row, meta) {
						// 在渲染函数中访问完整的行数据
						return '<div>' + row.recordTime + '</div>';
					},
					"orderable": true
				}
			],
			"aLengthMenu": [[5,10,15,20,25,40,50],[5,10,15,20,25,40,50]],
			"fnDrawCallback": function(){$(".checkboxes").uniform();$(".group-checkable").uniform();},
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

	var getDoubleLineDatatable =function(full){

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
			"data": full,
			"columns": [
				{
					"data": "locationX", "render": function(data, type, row, meta) {
						// 在渲染函数中访问完整的行数据
						return '<div>' + row.locationX + '</div>';
					},"orderable": true
				},
				{
					"data": "locationY","render": function(data, type, row, meta) {
						// 在渲染函数中访问完整的行数据
						return '<div>' + row.locationY + '</div>';
					},
					"orderable": true
				},
				{
					"data": "recordTime",
					"render": function(data, type, row, meta) {
						// 在渲染函数中访问完整的行数据
						return '<div>' + row.recordTime + '</div>';
					},
					"orderable": true
				}
			],

			"aLengthMenu": [[5,10,15,20,25,40,50],[5,10,15,20,25,40,50]],
			"fnDrawCallback": function(){$(".checkboxes").uniform();$(".group-checkable").uniform();}
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

	var getRedLightDatatable =function(full){

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
			"data": full,
			"columns": [
				{
					"data": "ID",
					"render": function(data, type, row, meta) {
						// 在渲染函数中访问完整的行数据
						return '<div>' + row.ID + '</div>';
					},"orderable": true
				},
				{
					"data": "locationX","render": function(data, type, row, meta) {
						// 在渲染函数中访问完整的行数据
						return '<div>' + row.locationX + '</div>';
					},
					"orderable": true
				},
				{
					"data": "locationY","render": function(data, type, row, meta) {
						// 在渲染函数中访问完整的行数据
						return '<div>' + row.locationY + '</div>';
					},
					"orderable": true
				},
				{
					"data": "recordTime",
					"render": function(data, type, row, meta) {
						// 在渲染函数中访问完整的行数据
						return '<div>' + row.recordTime + '</div>';
					},
					"orderable": true
				}
			],

			"aLengthMenu": [[5,10,15,20,25,40,50],[5,10,15,20,25,40,50]],
			"fnDrawCallback": function(){$(".checkboxes").uniform();$(".group-checkable").uniform();},

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

	var onAjaxUploadFile=function(){
		console.log("[onAjaxUploadFile]====");
		var deviceId = $("#device_id").val();
		var deviceName = $("#device_name").val();
		var options = {
			type : 'post', /*设置表单以post方法提交*/
			url : '../../video_data_servlet_action?action=upload_file&device_id='+deviceId+"&device_name="+deviceName, /*设置post提交到的页面*/
			success : function(json) {
				console.log("[onAjaxUploadFile]上传文件返回结果="+JSON.stringify(json));
				if(json.upload_files.length>0){
					var files=json.upload_files;
					var fileUrl = files[0].file_url_name;
					var objectId = files[0].file_object_id;
					$("#current_attachment_name").html("您当前上传的附件是：<span style='color:blue;'><a href='javascript:window.open(\""+fileUrl+"\")'>" + fileUrl + "</a></span>");
					$("#current_attachment_object_id").val(objectId);

					var html="";
					html+="<video width=\"640\" height=\"360\" controls style=\"width: 100%;height: auto;\">";
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

	//Page return 开始
	return {
		init: function() {
			initPageControl();
		}
	}
}();//Page
/*================================================================================*/
