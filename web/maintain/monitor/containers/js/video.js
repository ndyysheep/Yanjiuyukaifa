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
			$("#monitor_lists").addClass("active open")
			$(".sub-menu #monitor_list").addClass("active");
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
				if(json.upload_files.length>0){
					var files=json.upload_files;
					var fileUrl = files[0].file_url_name;
					var objectId = files[0].file_object_id;

					var html="";
					html+="<video width=\"640\" height=\"360\" controls>";
					html+="<source src='"+fileUrl+"' type=\"video/mp4\">"+"</video>"
					$("#video_div").html(html);
					console.log("[onAjaxUploadFile]fileUrl="+fileUrl);
					console.log("[onAjaxUploadFile]objectId="+objectId);
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
				if(json.upload_files.length>0){
					var files=json.upload_files;
					var fileUrl = files[0].file_url_name;
					var objectId = files[0].file_object_id;

					var html="";
					html+="<video width=\"640\" height=\"360\" controls>";
					html+="<source src='"+fileUrl+"' type=\"video/mp4\">"+"</video>"
					$("#video_div").html(html);
					console.log("[onAjaxUploadFile]fileUrl="+fileUrl);
					console.log("[onAjaxUploadFile]objectId="+objectId);
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
				if(json.upload_files.length>0){
					var files=json.upload_files;
					var fileUrl = files[0].file_url_name;
					var objectId = files[0].file_object_id;

					var html="";
					html+="<video width=\"640\" height=\"360\" controls>";
					html+="<source src='"+fileUrl+"' type=\"video/mp4\">"+"</video>"
					$("#video_div").html(html);
					console.log("[onAjaxUploadFile]fileUrl="+fileUrl);
					console.log("[onAjaxUploadFile]objectId="+objectId);
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
				if(json.upload_files.length>0){
					var files=json.upload_files;
					var fileUrl = files[0].file_url_name;
					var objectId = files[0].file_object_id;

					var html="";
					html+="<video width=\"640\" height=\"360\" controls>";
					html+="<source src='"+fileUrl+"' type=\"video/mp4\">"+"</video>"
					$("#video_div").html(html);
					console.log("[onAjaxUploadFile]fileUrl="+fileUrl);
					console.log("[onAjaxUploadFile]objectId="+objectId);
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
				if(json.upload_files.length>0){
					var files=json.upload_files;
					var fileUrl = files[0].file_url_name;
					var objectId = files[0].file_object_id;

					var html="";
					html+="<video width=\"640\" height=\"360\" controls>";
					html+="<source src='"+fileUrl+"' type=\"video/mp4\">"+"</video>"
					$("#video_div").html(html);
					console.log("[onAjaxUploadFile]fileUrl="+fileUrl);
					console.log("[onAjaxUploadFile]objectId="+objectId);
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

	//Page return 开始
	return {
		init: function() {
			initPageControl();
		}
	}
}();//Page
/*================================================================================*/
