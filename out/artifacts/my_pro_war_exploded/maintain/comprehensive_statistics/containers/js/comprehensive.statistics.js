var module="analysis";
var sub="data";
var check = 0;
document.domain="localhost";

jQuery(document).ready(function() {
    // initiate layout and plugins
    Metronic.init(); // init metronic core components
    Layout.init(); // init current layout
    Demo.init(); // init demo features
    ComponentsPickers.init();//选择时间
    Page.init();//页面初始化

});
/* ================================================================================ */
var chartDataIllegalType=[];

//关于页面的控件生成等操作都放在Page里
var Page = function() {
    /*----------------------------------------入口函数  开始----------------------------------------*/
    var initPageControl=function(){
        pageId = $("#page_id").val();
        if(pageId==="daily_report"){
            $(".sub-menu #daily_report").addClass("active");
            //设备列表页面
            initAnalysisList();
            initAnalysisStatistics();
        }

        if(pageId==="analysis_print"){
            //打印页面
            initAnalysisPrint();
        }
        if(pageId==="analysis_print_word"){
            //Word打印页面
            initMonitorPrint_Word();
        }

    };
    /*----------------------------------------入口函数  结束----------------------------------------*/
    //全局变量数组
    var resultList=[];

    var illegalInput = [];
    /*----------------------------------------业务函数  开始----------------------------------------*/
    /*------------------------------针对各个页面的入口  开始------------------------------*/
    var initAnalysisList=function(){

        initAnalysisListControlEvent();
        initAnalysisRecordList();
    }

    var initAnalysisPrint = function(){
        initAnalysisRecordForPrint();
    }

    var initMonitorPrint_Word = function(){
        initAnalysisRecordForPrint_Word();
    }
    //统计初始化模块-----开始
    var initAnalysisStatistics = function(time_from,time_to){

        $.ajaxSettings.async=false;
        initAnalysisRecordForStatistics(time_from,time_to);
        $.ajaxSettings.async=true;
        initChartSets();

    }
    //统计初始化模块-----结束



    /*------------------------------针对各个页面的入口 结束------------------------------*/

    //事件处理初始化--开始
    var initAnalysisListControlEvent=function(){

        //导出信息
        $('#export_button').click(function() {myExportAPI();});
        //打印信息
        $('#print_button').click(function() {myPrintAPI()});
        $('#print_button_for_word').click(function() {myPrintAPI_Word()});

    }


    //事件处理初始化--结束

    //数据获取初始化--开始
    var initAnalysisRecordList=function(){
        //使用Datatable的数据表,统计总数据
        getAnalysisRecordDatatable();
    }

    var initAnalysisRecordForPrint=function(){
        getAnalysisRecordPrint();
    }

    var initAnalysisRecordForPrint_Word=function(){
        getAnalysisRecordPrint_Word();
    }

    var initAnalysisRecordForStatistics =function(time_from,time_to){
        var url = "../../analysis_data_servlet_action";
        var data={};
        data.action="daily_report";
        var currentDate = new Date().toISOString().slice(0, 10);
        data.time_from = currentDate + " "+"00:00:00"
        data.time_to = currentDate + " "+"23:59:59";
        console.log(currentDate);
        $.post(url,data,function(json){
            if(json.result_code==0){
                console.log(JSON.stringify(json));

                var list = json.daily_aaData;
                if(list!==undefined&&list.length>0){
                    changeResultDataToChartForIllegalTypes(list);
                }

            }else{
                alert("与后端交互错误!"+json.result_Msg);
            }

        });


    }

    //数据获取初始化--结束

    //数据获取函数--开始
    var getAnalysisRecordDatatable =function(data){

        var servletRequest ="../../analysis_data_servlet_action";
        resultList=[];

        if(data==undefined)
        {
            data={};
            data.action="daily_report";
            var currentDate = new Date().toISOString().slice(0, 10);
            data.time_from = currentDate + " "+"00:00:00"
            data.time_to = currentDate + " "+"23:59:59";
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
            "aoColumns": [{
                "mRender": function(data, type, full) {
                    sReturn = '<div>'+full.lane_name+'</div>';
                    return sReturn;
                },"orderable": true
            },{
                "mRender": function(data, type, full) {
                    sReturn = '<div>'+full.total+'</div>';
                    return sReturn;
                },"orderable": true
            },{
                "mRender": function(data, type, full) {

                    sReturn = '<div>'+full.status0+'</div>';
                    return sReturn;
                },"orderable":true
            },{
                "mRender": function(data, type, full) {

                    sReturn = '<div>'+full.status1+'</div>';
                    return sReturn;
                },"orderable":true
            },{
                "mRender": function(data, type, full) {

                    sReturn = '<div>'+full.status2+'</div>';
                    return sReturn;
                },"orderable":true
            },{
                "mRender": function(data, type, full) {

                    sReturn = '<div>'+full.status3+'</div>';
                    return sReturn;
                },"orderable":true
            },{
                "mRender": function(data, type, full) {

                    sReturn = '<div>'+full.status4+'</div>';
                    return sReturn;
                },"orderable":true
            }],

            "aLengthMenu": [[5,10,15,20,25,40,50],[5,10,15,20,25,40,50]],
            "fnDrawCallback": function(){$(".checkboxes").uniform();$(".group-checkable").uniform();},
            //"sAjaxSource": "get_record.jsp"
            "ajax": {
                "url": servletRequest,
                "type": "POST",
                "data":data,
                "dataSrc": function(json) {
                    console.log(json.daily_aaData);
                    resultList = json.daily_aaData;
                    var total = 0;
                    for(var i = 0;i<resultList.length ;i++)
                    {
                        total += resultList[i].status0+resultList[i].status1+resultList[i].status2
                            +resultList[i].status3+resultList[i].status4;
                    }
                    json.daily_aaData.total = total;
                    return json.daily_aaData; // 返回的 JSON 数据中的数据源位置
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

    var  getAnalysisRecordPrint = function(){
        var url = "../../analysis_data_servlet_action";
        var data={};
        data.action="analysis_print";
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

    var  getAnalysisRecordPrint_Word = function(){
        var url = "../../analysis_data_servlet_action";
        var data={};
        data.action="analysis_print";
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
                        html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+record.lane_name+"</span></p>";
                        html=html+" </td>";
                        html=html+" <td width=106 valign=top style='width:79.4pt;border-top:none;border-left:";
                        html=html+"  none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;";
                        html=html+"  padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
                        html=html+" <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US";
                        html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+record.start_time+"</span></p>";
                        html=html+" </td>";
                        html=html+" <td width=63 valign=top style='width:47.05pt;border-top:none;border-left:";
                        html=html+" none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;";
                        html=html+" padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
                        html=html+" <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US";
                        html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+record.end_time+"</span></p>";
                        html=html+" </td>";
                        html=html+" <td width=63 valign=top style='width:47.05pt;border-top:none;border-left:";
                        html=html+"  none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;";
                        html=html+"  padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
                        html=html+" <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US";
                        html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+record.total_num+"</span></p>";
                        html=html+" </td>";
                        html=html+" </tr>";

                    }
                }
            }
            $("#print_list_for_word").html(html);
        });


    }
    //数据获取函数--结束

    var myExportAPI = function(){
        var url = "../../analysis_data_servlet_action";
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
        window.open("analysis_print_default.jsp");
    }

    var myPrintAPI_Word = function(){
        window.open("analysis_print_word.jsp");

    }


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

            "dataProvider": chartDataIllegalType,
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
                "title": "正常行驶",
                "type": "column",
                "valueField": "正常行驶"
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
                "title": "正常行驶",
                "valueField": "正常行驶"
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
            "categoryField": "lane_name",
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
                "title": "num",
                "type": "column",
                "valueField": "num"
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
                "title": "num",
                "valueField": "num"
            }],
            "categoryField": "lane_name",
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

            "dataProvider":chartDataFlowType,
            "valueField": "num",
            "titleField": "flow_type",
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
    var changeResultDataToChartForIllegalTypes = function(list) {
        chartDataIllegalType=[];
        for(var i = 0;i<list.length;i++)
        {
            var json = {"lane_name":list[i].lane_name,"正常行驶":list[i].status0,"违停":list[i].status1
                ,"闯红灯":list[i].status2,"压双黄线":list[i].status3,"逆行":list[i].status4}

            chartDataIllegalType.push(json);
        }

    }
    //图标处理函数-----结束
    //submit functions end

    var returnBack = function(){
        history.go(-1);
    }


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

    //Page return 开始
    return {
        init: function() {
            initPageControl();
        }
    }
}();//Page
/*================================================================================*/
