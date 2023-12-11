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

var illegalInput = [];
//关于页面的控件生成等操作都放在Page里
var Page = function() {
	/*----------------------------------------入口函数  开始----------------------------------------*/
	var initPageControl=function(){
		pageId = $("#page_id").val();
		if(pageId==="illegal_list"){
			$(".sub-menu #illegal_data_list").addClass("active");
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

	};
	/*----------------------------------------入口函数  结束----------------------------------------*/
	var resultList=[];
	/*----------------------------------------业务函数  开始----------------------------------------*/
	/*------------------------------针对各个页面的入口  开始------------------------------*/
	var initIllegalDataList=function(){

		onPageListenerForMonitorList();
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
		initDeviceRecordForPrint();
	}

	var initIllegalDataPrint_Word = function(){
		initIllegalRecordForPrint_Word();
	}

	/*------------------------------针对各个页面的入口 结束------------------------------*/
	var getUrlParam=function(name){
		//获取url中的参数
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg);  //匹配目标参数
		if (r != null) return decodeURI(r[2]); return null; //返回参数值，如果是中文传递，就用decodeURI解决乱码，否则用unescape
	}

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

	//init-device_list functions begin
	var initIllegalDataListControlEvent=function(){
		$('#ac_query_button').click(function() {onQueryRecord(),initIllegalDataQuery();});
		$('#export_button').click(function() {myExportAPI();});
		$('#print_button').click(function() {myPrintAPI()});
		$('#print_button_for_word').click(function() {myPrintAPI_Word()});
		$('#statistics_button').click(function() {myStatisticsAPI()});

	}
	var onQueryRecord=function(){
		$("#illegal_record_query_div").modal("show");
	}

	var initIllegalDataQuery=function(){
		initIllegalDataQueryControlEvent();
	}

	var initIllegalDataQueryControlEvent=function(){
		$('#illegal_record_query_div #query_button').click(function() {myQuerySubmit();});
	}
	var initDeviceViewControlEvent=function(){

		$('#return_button').click(function() {returnBack();});
	}


	var initIllegalDataRecordList=function(){
		//使用Datatable的数据表,统计总数据
		getIllegalDataRecordDatatable();

	}

	var initDeviceRecordForPrint=function(){
		getDeviceRecordPrint();
	}

	var initIllegalRecordForPrint_Word=function(){
		getIllegalRecordPrint_Word();
	}

	var  getDeviceRecordPrint = function(){
		var url = "../../illegal_data_servlet_action";
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

	var  getIllegalRecordPrint_Word = function(){
		var url = "../../illegal_data_servlet_action";
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
						$("small_title").text("车辆序号"+record.id);
						$("#record_view_div_div  #car_code").text(record.car_code);
						$("#record_view_div #vehicle_type").text(record.vehicle_type);
						$("#record_view_div  #illegal_status").text(explainIllegalCode(record.illegal_status));
						$("#record_view_div  #capture_time").text(record.capture_time);
						$("#record_view_div #speed").text(record.speed);
						$("#record_view_div #lane_name").text(record.lane_name);


					}
				}


			}
		})
	}

	//get_record functions begin

	var getIllegalDataRecordDatatable =function(data){

		var servletRequest ="../../illegal_data_servlet_action";
		resultList=[];
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
					var speed=full.speed;
					sReturn = '<div>'+speed+'</div>';
					return sReturn;
				},"orderable": true
			},{
                "mRender": function(data, type, full) {
                    sReturn = '<div>'+full.lane_name+'</div>';
                    return sReturn;
                },"orderable": true
            },{
				"mRender": function(data, type, full) {

					if(full.image_url!=null)
					{
						sReturn = '<div>'+'<a href=\"'+full.image_url+'\"'
							+ "class=\"btn default btn-xs blue\"" +' target=\"_blank\">'
							+"<i class=\"fa fa-share\"></i>"+'查看</a>'+'</div>';
					}
					else
					{
						sReturn = '<div>'+"无"+'</div>'
					}

					return sReturn;
				},"orderable": true
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
				"data":data,
				"dataSrc": function(json) {
					console.log(json.aaData);
					resultList = json.aaData;
					return json.aaData; // 返回的 JSON 数据中的数据源位置
				}
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
		var time_from = $("#illegal_record_query_div #capture_time_from").val();
		var time_to = $("#illegal_record_query_div #capture_time_to").val();
		data.action="query_illegal_data_record";

		data.id=$("#illegal_record_query_div #id").val();
		data.car_code=$("#illegal_record_query_div #car_code").val();
		data.vehicle_type=$("#illegal_record_query_div #vehicle_type").val();
		data.illegal_status=explainIllegalCode_Contrary($("#illegal_record_add_div #illegal_status").val());
		data.time_from = time_from;
		data.time_to = time_to;
		if(time_from!=="")
		{
			data.time_from+=" "+$("#illegal_record_query_div #capture_time_sec_from").val();
		}

		if(time_to!=="")
		{
			data.time_to+=" " +$("#illegal_record_query_div #capture_time_sec_to").val();
		}

		data.speed=$("#illegal_record_query_div #speed").val();
		data.lane_name=$("#illegal_record_query_div #lane_name").val();

		if(checkValid($("#illegal_record_query_div")))
		{
			$("#illegal_record_query_div").modal("hide");

			getIllegalDataRecordDatatable(data);
		}
		else
		{
			alert("请按照合法格式输入内容!");
		}

	}

	var myExportAPI = function(){
		var url = "../../illegal_data_servlet_action";
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
		var invalidKeys=['=','+','{','}','\'','/',',',
			'\\','"',';','?','!','%','&','*','#','$','^','(',')']

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
		onViewRecord:function(id){
			onViewRecord(id);
		}
	}
}();//Page
/*================================================================================*/
