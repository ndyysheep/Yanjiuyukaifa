var module="flow";
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
        if(pageId==="flow_list"){
            $(".sub-menu #flow_list").addClass("active");
            //设备列表页面
            initFlowList();
        }

        if(pageId==="flow_print"){
            //打印页面
            initFlowPrint();
        }

    };
    /*----------------------------------------入口函数  结束----------------------------------------*/
    //全局变量数组
    var resultList=[];

    var illegalInput = [];
    /*----------------------------------------业务函数  开始----------------------------------------*/
    /*------------------------------针对各个页面的入口  开始------------------------------*/
    var initFlowList=function(){

        onPageListenerForFlowList();
        initFlowListControlEvent();
        initFlowRecordList();
    }

    var initFlowAdd=function(){
        initFlowAddControlEvent();
    }

    var initFlowQuery=function(){
        initMonitorQueryControlEvent();
    }


    var initFlowPrint = function(){
        initFlowRecordForPrint();
    }

    var initMonitorPrint_Word = function(){
        initFlowRecordForPrint_Word();
    }



    /*------------------------------针对各个页面的入口 结束------------------------------*/

    //事件处理初始化--开始
    var initFlowListControlEvent=function(){
        //添加信息
        $('#ac_add_button').click(function() {onAddRecord(),initFlowAdd();});
        //查询信息
        $('#ac_query_button').click(function() {onQueryRecord(),initFlowQuery();});
        //修改信息
        $('#record_modify_div #submit_button').click(function() {myFlowModifySubmit();});
        //导出信息
        $('#export_button').click(function() {myExportAPI();});
        //打印信息
        $('#print_button').click(function() {myPrintAPI()});
        $('#print_button_for_word').click(function() {myPrintAPI_Word()});
        //统计细心
        $('#statistics_button').click(function() {myStatisticsAPI()});

    }

    var initFlowAddControlEvent=function(){
        $('#record_add_div #submit_button').click(function() {submitAddRecord();});
    }

    var initMonitorQueryControlEvent=function(){
        $('#record_query_div #query_button').click(function() {myQuerySubmit();});
    }

    //事件处理初始化--结束

    //数据获取初始化--开始
    var initFlowRecordList=function(){
        //使用Datatable的数据表,统计总数据
        getFlowRecordDatatable();
    }

    var initFlowRecordForPrint=function(){
        getFlowRecordPrint();
    }

    var initFlowRecordForPrint_Word=function(){
        getFlowRecordPrint_Word();
    }


    //数据获取初始化--结束



    //页面监听函数--开始
    var onPageListenerForFlowList= function() {

        var inputListener = $(".form-group input");
        var colorContainer=inputListener.css("borderColor");
        console.log(colorContainer);
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

    //页面监听函数--结束


    //数据获取函数--开始
    var getFlowRecordDatatable =function(data){

        var servletRequest ="../../flow_data_servlet_action";
        resultList=[];

        if(data==undefined)
        {
            data={};
            data.action="get_flow_record";
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
                    sReturn = '<div>'+full.lane_name+'</div>';
                    return sReturn;
                },"orderable": true
            },{
                "mRender": function(data, type, full) {

                    sReturn = '<div>'+full.start_time+'</div>';
                    return sReturn;
                },"orderable":true
            },{
                "mRender": function(data, type, full) {

                    sReturn = '<div>'+full.end_time+'</div>';
                    return sReturn;
                },"orderable":true
            },{
                "mRender": function(data, type, full) {

                    sReturn = '<div>'+full.total_num+'</div>';
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

    var  getFlowRecordPrint = function(){
        var url = "../../flow_data_servlet_action";
        var data={};
        data.action="flow_print";
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
                        myhtml+="<td>" +record.lane_name+" </td>"
                        myhtml+="<td>"+record.start_time +"</td>";
                        myhtml+="<td class=\"highlight\">"+record.end_time+"</td>";
                        myhtml+="<td>"+record.total_num+"</td>";
                        myhtml+="</tr>";
                    }
                }
            }
            $("#print_list").html(myhtml);
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
                var url="../../flow_data_servlet_action";
                var data={};
                data.action="delete_flow_record";
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
                $("#record_modify_div #lane_name").val(resultList[i].lane_name);

                var date="";
                var time ="";
                date =resultList[i].start_time.slice(0,11);
                time=resultList[i].start_time.slice(11,19);
                $("#record_modify_div #capture_time_begin").val(date);
                $("#record_modify_div #capture_time_begin_sec").val(time);

                date =resultList[i].end_time.slice(0,11);
                time=resultList[i].end_time.slice(11,19);
                $("#record_modify_div #capture_time_end").val(date);
                $("#record_modify_div #capture_time_end_sec").val(time);

                $("#record_modify_div #total_num").val(resultList[i].total_num);
            }
        }


        //window.location.href="device_modify.jsp?id="+id;
        $("#record_modify_div").modal("show");
    }

    var onViewRecord = function(id){
        window.location.href = "flow_view.jsp?id="+id;
    }

    //on-functions end

    //submit functions begin
    var submitAddRecord=function(){

        var url="../../flow_data_servlet_action";
        var data={};
        data.action="add_flow_record";

        var check = false;
        var checkCol = [];

        data.lane_name=$("#record_add_div #lane_name").val();
        data.start_time=$("#record_add_div #capture_time_begin").val()+" "
            +$("#record_add_div #capture_time_sec_begin").val();
        data.end_time=$("#record_add_div #capture_time_end").val()+" "
            +$("#record_add_div #capture_time_sec_end").val();
        data.total_num=$("#record_add_div #total_num").val();


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

    var myFlowModifySubmit = function(id){
        if(confirm("您确定要修改该记录吗？")){
            var id=$("#record_modify_div #_id").text();
            var url="../../flow_data_servlet_action";
            var data={};
            data.action="modify_flow_record";
            data.id=id;
            var time_from = $("#record_modify_div #capture_time_begin").val();
            var time_to = $("#record_modify_div #capture_time_end").val();

            if(time_from!=="")
            {
                time_from+=$("#record_modify_div #capture_time_sec_begin").val();
            }

            if(time_to!=="")
            {
                time_to+=$("#record_modify_div #capture_time_sec_end").val();
            }

            data.start_time = time_from;
            data.end_time = time_to;

            data.total_num=$("#record_modify_div #total_num").val();
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

        var url = "../../flow_data_servlet_action";
        var data={};
        var time_from = $("#record_query_div #capture_time_begin").val();
        var time_to = $("#record_query_div #capture_time_end").val();
        data.action="query_flow_record";

        data.id=$("#record_query_div #id").val();

        data.time_from = time_from;
        data.time_to = time_to;
        if(time_from!=="")
        {
            data.time_from+=" "+$("#record_query_div #capture_time_sec_begin").val();
        }

        if(time_to!=="")
        {
            data.time_to+=" " +$("#record_query_div #capture_time_sec_end").val();
        }

        data.lane_name=$("#record_query_div #lane_name").val();
        data.total_num=$("#record_query_div #total_num").val();

        if(checkValid($("#record_query_div")))
        {
            $("#record_query_div").modal("hide");

            getFlowRecordDatatable(data);
        }
        else
        {
            alert("请按照合法格式输入内容!");
        }

    }

    var myExportAPI = function(){
        var url = "../../flow_data_servlet_action";
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
        window.open("flow_print_default.jsp");
    }

    var myPrintAPI_Word = function(){
        window.open("flow_print_word.jsp");

    }

    var myStatisticsAPI = function() {

        window.open("flow_statistics.jsp");
    }


    //submit functions end

    var returnBack = function(){
        history.go(-1);
    }


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
        var checkTimeArray = ["capture_time_begin","capture_time_sec_begin"
            ,"capture_time_end","capture_time_sec_end"]

        var start_time;
        var end_time;

        //判断总车流量是不是数字
        var totalNum = element.find("#total_num");
        var totalIsNum =totalNum.val();
        for(var i =0;i<totalIsNum.length;i++)
        {
            if(isNaN(parseInt(totalIsNum[i])))
            {
                check = false;
                illegalInput.push(totalNum);
            }
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


        })

        //判断是否出现结束时间>开始时间的情况
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
        inValidManager();
        return check;
    }
    //输入判断函数--结束

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
