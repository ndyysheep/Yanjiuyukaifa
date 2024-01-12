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
var pageId;
//关于页面的控件生成等操作都放在Page里
var Page = function() {
    /*----------------------------------------入口函数  开始----------------------------------------*/
    var initPageControl=function(){
        pageId = $("#page_id").val();
        if(pageId==="daily_report"){
            $(".sub-menu #daily_report").addClass("active");
            //设备列表页面
            initAnalysisList();
        }

        if(pageId ==="weekly_report"){
            $(".sub-menu #weekly_report").addClass("active");
            initAnalysisListForWeekly();
        }

        if(pageId ==="monthly_report"){
            $(".sub-menu #monthly_report").addClass("active");
            initAnalysisListForMonthly();
        }

        if(pageId ==="yearly_report"){
            $(".sub-menu #yearly_report").addClass("active");
            initAnalysisListForYearly();
        }

        if(pageId==="daily_statistics_print"){
            //打印页面
            initDailyAnalysisPrint();
        }

    };
    /*----------------------------------------入口函数  结束----------------------------------------*/
    //全局变量数组
    var resultList=[];

    //统计用--开始
    //用于统计违法类型
    var chartDataIllegalType=[];
    //统计违法总数
    var chartDataIllegalTotal = [];
    //统计近7天各个路段违法情况
    var chartDataExtra = [];
    //储存路段信息
    var laneStore =[];
    //统计用--结束
    var pageData ={};
    /*----------------------------------------业务函数  开始----------------------------------------*/
    /*------------------------------针对各个页面的入口  开始------------------------------*/
    var initAnalysisList=function(){

        initDateInDailyFormat();
        initAnalysisListControlEvent();

    }


    var initAnalysisListForWeekly=function(){

        initDateInWeeklyFormat();
        initAnalysisListControlEventForWeekly();

    }

    var initAnalysisListForMonthly=function(){

        initDateInMonthlyFormat();
        initAnalysisListControlEventForMonthly();
    }

    var initAnalysisListForYearly=function(){

        initDateInYearlyFormat();
        initAnalysisListControlEventForYearly();
    }


    //统计初始化模块-----开始
    /**
     * 初始化统计图
     * @param time_from 开始时间
     * @param time_to   截止时间
     */
    var initAnalysisStatistics = function(time_from,time_to){

        $.ajaxSettings.async=false;
        initAnalysisRecordForCharts(time_from,time_to);
        $.ajaxSettings.async=true;
        initChartSets();
        initChartSetsForIllegalTotal();
        if(pageId==="yearly_report")
        {
            InitChart3ForMulti();
        }
        else
        {
            InitChart3ForALL();
        }



    }
    //统计初始化模块-----结束



    /*------------------------------针对各个页面的入口 结束------------------------------*/

    //事件处理初始化--开始
    var initAnalysisListControlEvent=function(){

        onDailyPageAttachment($("#date_selector"));
        //导出信息
        $('#export_button').click(function() {myExportAPI();});
        //打印信息
        $('#print_button').click(function() {myPrintAPI()});


    }

    var initAnalysisListControlEventForWeekly =function(){

        onWeeklyPageAttachment($("#date_selector"));
        //导出信息
        $('#export_button').click(function() {myExportAPI();});
        //打印信息
        $('#print_button').click(function() {myPrintAPI()});


    }

    var initAnalysisListControlEventForMonthly =function(){

        onMonthlyPageAttachment($("#date_selector"));
        //导出信息
        $('#export_button').click(function() {myExportAPI();});
        //打印信息
        $('#print_button').click(function() {myPrintAPI()});


    }

    var initAnalysisListControlEventForYearly =function(){

        onYearlyPageAttachment($("#date_selector"));
        //导出信息
        $('#export_button').click(function() {myExportAPI();});
        //打印信息
        $('#print_button').click(function() {myPrintAPI()});


    }
    //事件处理初始化--结束

    //数据获取初始化--开始

    var initDateInDailyFormat=function(){
        var url = "../../analysis_data_servlet_action"
        var data = {};
        var weekList = [];
        var currentDate=new Date().toISOString().slice(0, 10);
        var container = $("#date_selector");
        data.action = "get_report_date"
        $.post(url,data,function(json){
            if(json.result_code===0)
            {
                var list = json.aaData;
                var html = "<option>"+currentDate+"</option>";
                for(var i = 0 ;i<list.length;i++)
                {
                    if(list[i].date!==currentDate)
                    html +="<option>"+list[i].date+"</option>"
                }

                container.html(html);
                container.trigger('change');
            }
        })
    }

    var initDateInWeeklyFormat=function(){
        var url = "../../analysis_data_servlet_action"
        var data = {};
        var weekList = [];
        var now = new Date().toISOString().slice(0,10);
        var week = getWeek(now);

        weekList.push(week[0]);

        var currentWeek=week[0]+"~"+week[1];
        var container = $("#date_selector");
        data.action = "get_report_date"
        $.post(url,data,function(json){
            if(json.result_code===0)
            {
                var list = json.aaData;
                var html = "<option>"+currentWeek+"</option>";
                for(var i = 0 ;i<list.length;i++)
                {
                    var thisWeek = getWeek(list[i].date);
                    if(!weekList.includes(thisWeek[0]))
                    {
                        var date=thisWeek[0]+"~"
                            +thisWeek[1];
                        html +="<option>"+date+"</option>"
                        weekList.push(thisWeek[0]);
                    }

                }

                container.html(html);
                container.trigger('change');
            }
        })
    }

    var initDateInMonthlyFormat=function(){
        var url = "../../analysis_data_servlet_action"
        var data = {};
        var monthList = [];
        var now = new Date().toISOString().slice(0,10);
        var month = getMonthList(now);

        monthList.push(month[0]);

        var currentMonth=now.slice(0,4)+"年 "+now.slice(5,7)+"月";
        var container = $("#date_selector");
        data.action = "get_report_date"
        $.post(url,data,function(json){
            if(json.result_code===0)
            {
                var list = json.aaData;
                var html = "<option>"+currentMonth+"</option>";
                for(var i = 0 ;i<list.length;i++)
                {
                    var thisMonth = getMonthList(list[i].date);
                    if(!monthList.includes(thisMonth[0]))
                    {
                        var date=thisMonth[0].slice(0,4)+"年 "
                            +thisMonth[1].slice(5,7)+"月";
                        html +="<option>"+date+"</option>"
                        monthList.push(thisMonth[0]);
                    }

                }

                container.html(html);
                container.trigger('change');
            }
        })
    }

    var initDateInYearlyFormat=function(){
        var url = "../../analysis_data_servlet_action"
        var data = {};
        var yearList = [];
        var now = new Date().toISOString().slice(0,10);
        var year = getYearList(now);

        yearList.push(year[0]);

        var currentYear=now.slice(0,4)+"年";
        var container = $("#date_selector");
        data.action = "get_report_date"
        $.post(url,data,function(json){
            if(json.result_code===0)
            {
                var list = json.aaData;
                var html = "<option>"+currentYear+"</option>";
                for(var i = 0 ;i<list.length;i++)
                {
                    var thisYear = getYearList(list[i].date);
                    if(!yearList.includes(thisYear[0]))
                    {
                        var date=thisYear[0].slice(0,4)+"年 ";
                        html +="<option>"+date+"</option>"
                        yearList.push(thisYear[0]);
                    }

                }

                container.html(html);
                container.trigger('change');
            }
        })
    }

    var initAnalysisRecordForCharts =function(time_from,time_to){

        changeResultDataToChartForIllegalTypes(resultList);
        changeResultDataToChartForIllegalTotal(resultList);

    var url = "../../analysis_data_servlet_action";
    var data = {};
    data.action = "get_report_all";
    data.time_to = time_to;
    data.time_from = time_from;
    data.report_type = pageId;

        $.post(url,data,function(json){
           if(json.result_code==0)
           {
                var list = json.aaData;

                if(pageId==="yearly_report")
                {
                    changeResultDataToChartForYear(list);
                }
                else
                {
                    changeResultDataToChartForAll(list,time_from,time_to);
                }
           }
           else
           {
               alert(json.errMsg);
           }
        });




    }

    //数据获取初始化--结束

    var onDailyPageAttachment = function(element)
    {
        element.change(function(event){
            var date = element.val();
            var time_from = date + " "+"00:00:00"
            var time_to = date + " "+"23:59:59";
            $.ajaxSettings.async=false;
            getAnalysisRecordDatatable(date);
            $.ajaxSettings.async=true;
            initAnalysisStatistics(time_from,time_to)


        })
    }

    var onWeeklyPageAttachment = function(element)
    {
        element.change(function(event){
            var dateStr = element.val();
            var partBegin = dateStr.slice(0,10);
            var partEnd = dateStr.slice(11,21);
            var time_from = partBegin + " "+"00:00:00"
            var time_to =partEnd + " "+"23:59:59";
            $.ajaxSettings.async=false;
            getAnalysisRecordDatatable(partBegin);
            $.ajaxSettings.async=true;
            initAnalysisStatistics(time_from,time_to)

        })
    }

    var onMonthlyPageAttachment = function(element)
    {
        element.change(function(event){
            var dateStr = element.val();
            dateStr = dateStr.slice(0,4)+"-"+dateStr.slice(6,8);
            var partBegin = dateStr+"-"+"01";
            var date = new Date(partBegin);
            partBegin+=" 00:00:00";
            var month = date.getMonth();
            date.setMonth(month + 1,1);
            date.setDate(date.getDate()-1);

            var partEnd = date.toISOString().slice(0,10);
            var time_from = partBegin
            var time_to =partEnd + " "+"23:59:59";
            $.ajaxSettings.async=false;
            getAnalysisRecordDatatable(date);
            $.ajaxSettings.async=true;
            initAnalysisStatistics(time_from,time_to)

        })
    }

    var onYearlyPageAttachment = function(element)
    {
        element.change(function(event){
            var dateStr = element.val();
            dateStr = dateStr.slice(0,4)
            var date = new Date(dateStr);
            var partBegin = new Date(date).toISOString().slice(0,10)+" 00:00:00";

            date.setDate(date.getDate()-1);
            date.setFullYear(date.getFullYear()+1);
            var partEnd = new Date(date).toISOString().slice(0,10)+" 23:59:59";

            var time_from = partBegin
            var time_to =partEnd;
            $.ajaxSettings.async=false;
            getAnalysisRecordDatatable(date);
            $.ajaxSettings.async=true;
            initAnalysisStatistics(time_from,time_to)

        })
    }
    //数据获取函数--开始
    var getAnalysisRecordDatatable =function(date){

        var servletRequest ="../../analysis_data_servlet_action";
        resultList=[];
        var dateList =[];
        var data={};
        data.action="get_report";
        if(pageId==="daily_report")
        {
            if(date==undefined)
            {
                var currentDate = new Date().toISOString().slice(0, 10);
                data.time_from = currentDate + " "+"00:00:00"
                data.time_to = currentDate + " "+"23:59:59";
            }
            else
            {
                data.time_from = date + " "+"00:00:00"
                data.time_to = date + " "+"23:59:59";
            }
        }
        else if(pageId==="weekly_report")
        {

            if(date==undefined)
            {
                dateList = getWeek(new Date());
            }
            else
            {
                dateList = getWeek(new Date(date));
            }

            var thisMonday =  dateList[0];
            var thisSunday =  dateList[1]
            data.time_from = thisMonday + " "+"00:00:00"
            data.time_to = thisSunday + " "+"23:59:59";
        }
        else if(pageId ==="monthly_report")
        {
            if(date==undefined)
            {
                dateList = getMonthList(new Date());
            }
            else
            {
                dateList = getMonthList(new Date(date));
            }

            var thisFirstDay =  dateList[0];
            var thisLastDay =  dateList[1]
            data.time_from = thisFirstDay + " "+"00:00:00"
            data.time_to = thisLastDay + " "+"23:59:59";
        }
        else if(pageId ==="yearly_report")
        {
            if(date==undefined)
            {
                dateList = getYearList(new Date());
            }
            else
            {
                dateList = getYearList(new Date(date));
            }

            var thisFirstDay =  dateList[0];
            var thisLastDay =  dateList[1]
            data.time_from = thisFirstDay + " "+"00:00:00"
            data.time_to = thisLastDay + " "+"23:59:59";
        }
        pageData = data;
        $('.datatable').DataTable().destroy();

        $('.datatable').dataTable( {

            "dom": 'Bfrtip',
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
           "buttons": [
                {
                    extend: 'copyHtml5',
                },
                {
                    extend: 'excelHtml5',
                    title: $("#reportTitle").text(),
                },
                {
                    extend: 'pdfHtml5',
                    title: $("#reportTitle").text()
                },
                {
                    extend: 'csvHtml5',
                    title: $("#reportTitle").text()
                },
                {
                    extend:'print',
                }
            ],
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
                    console.log(json.report_aaData);
                    resultList = json.report_aaData;

                    for(var i = 0;i<resultList.length ;i++)
                    {
                        var total = 0;
                        total += resultList[i].status0+resultList[i].status1+resultList[i].status2
                            +resultList[i].status3+resultList[i].status4;

                        var illegal_total = total - resultList[i].status0;
                        json.report_aaData[i].total = total;
                        json.report_aaData[i].illegal_total = illegal_total;

                    }
                    resultList = json.report_aaData;
                    return json.report_aaData; // 返回的 JSON 数据中的数据源位置
                }

            }


        });
        var container=$(".buttons-copy").text('复制');
        container.addClass("btn default blue-stripe");
        container=$(".buttons-excel").text('导出excel');
        container.addClass("btn default blue-stripe");
        container=$(".buttons-pdf").text('导出pdf');
        container.addClass("btn default blue-stripe");
        container= $(".buttons-csv").text('导出csv');
        container.addClass("btn default red-stripe");
        container=$(".buttons-print").text('打印');
        container.addClass("btn default red-stripe");

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


    //数据获取函数--结束

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

    var changeResultDataToChartForIllegalTotal = function(list) {
        chartDataIllegalTotal = [];
        for (var i = 0; i < list.length; i++) {
            var json = {"lane_name": list[i].lane_name, "违法行驶数量": list[i].illegal_total}
            chartDataIllegalTotal.push(json);
        }
    }

    var changeResultDataToChartForAll = function(list,time_from,time_to)
    {
        var beginDate = new Date(time_from);
        var endDate = new Date(time_to);
        beginDate.setHours(8);
        endDate.setHours(8);
        chartDataExtra = [];
        laneStore = [];
        var tempList = [];

        for (var i = 0; i < list.length; i++) {
            var record =list[i];

            if(!laneStore.includes(record.lane_name))
            {
                if(tempList.length!==0)
                {
                    chartDataExtra.push(tempList);
                }
                tempList = [];
                var j = 0;
                for(var tmp = new Date(beginDate); tmp.toISOString().slice(0,10) <=endDate.toISOString().slice(0,10);
                      tmp.setDate(tmp.getDate()+1))
                {
                    tempList[j] = [new Date(tmp),0];
                    j++;
                }
                laneStore.push(record.lane_name);

            }

            if(laneStore.includes(record.lane_name))
            {
                var count = record.status1+record.status2
                    +record.status3+record.status4;
                var thisDate = new Date(record.date);
                var index = thisDate.getDate() - beginDate.getDate();
                console.log(index);
                tempList[index]=[thisDate,count];
            }
        }
        if(tempList.length!==0)
        {
            chartDataExtra.push(tempList.slice());
            tempList = [];
        }

        console.log(chartDataExtra)
    }

    var changeResultDataToChartForYear = function(list)
    {
        chartDataExtra = [];
        laneStore = [];
        var tempList = [];

        for (var i = 0; i < list.length; i++) {
            var record =list[i];

            if(!laneStore.includes(record.lane_name))
            {
                if(tempList.length!==0)
                {
                    chartDataExtra.push(tempList);
                }
                tempList = [];

                for(var j = 0;j<=12;j++)
                {
                    tempList[j] = [j,0];
                }
                laneStore.push(record.lane_name);

            }

            if(laneStore.includes(record.lane_name))
            {
                var count = record.status1+record.status2
                    +record.status3+record.status4;
                var thisDate = new Date(record.date);
                var index = thisDate.getMonth();
                console.log(index);
                tempList[index]=[index+1,count];
            }
        }
        if(tempList.length!==0)
        {
            chartDataExtra.push(tempList.slice());
            tempList = [];
        }

        console.log(chartDataExtra)
    }


    //图标处理函数-----结束

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
            },{
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
                "dashLengthField": "dashLengthColumn",
                "fillAlphas": 1,
                "title": "违停",
                "type": "column",
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
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
                "dashLengthField": "dashLengthColumn",
                "fillAlphas": 1,
                "title": "压双黄线",
                "type": "column",
                "valueField": "压双黄线"
            },{
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
                "dashLengthField": "dashLengthColumn",
                "fillAlphas": 1,
                "title": "违停",
                "type": "column",
                "valueField": "违停"
            },{
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
                "dashLengthField": "dashLengthColumn",
                "fillAlphas": 1,
                "title": "逆行",
                "type": "column",
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

    var initChartSetsForIllegalTotal = function(){


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

            "dataProvider":  chartDataIllegalTotal,
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
                "title": "违法行驶数量",
                "type": "column",
                "valueField": "违法行驶数量"
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
                "title": "违法行驶数量",
                "valueField": "违法行驶数量"
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

    var InitChart3ForALL=function() {
        if ($('#chart_3').size() != 1) {
            return;
        }

        //对全局变量数据进行处理
        var plotData = [];
        plotData.push({data:0,label:0})
        for(var i = 0;i<chartDataExtra.length;i++)
        {
            var plotItem = {
                data: chartDataExtra[i],
                label: laneStore[i],
                lines: {
                    lineWidth: 1,
                },
                shadowSize: 0

            };

            plotData.push(plotItem);
        }

        var plot = $.plot($("#chart_3"), plotData, {
            series: {
                lines: {
                    show: true,
                    lineWidth: 2,
                    fill: true,
                    fillColor: {
                        colors: [{
                            opacity: 0.05
                        }, {
                            opacity: 0.01
                        }]
                    }
                },
                points: {
                    show: true,
                    radius: 3,
                    lineWidth: 1
                },
                shadowSize: 2
            },
            grid: {
                hoverable: true,
                clickable: true,
                tickColor: "#eee",
                borderColor: "#eee",
                borderWidth: 1
            },
            colors: ["#d12610", "#37b7f3", "#52e136"],
            xaxis: {

                mode: "time",
                TickSize: [1, "day"],  // 设置刻度的最小间隔为一天
                maxTickSize:[1,"day"],
                autoscaleMargin: 0.1,  // 设置自适应边距为 10% （可以根据需要进行调整）
                timeformat: "%Y-%m-%d",
                tickColor: "#eee"
            },
            yaxis: {
                min:0,
                ticks: 11,
                tickDecimals: 0,
                tickColor: "#eee",
            }
        });


        function showTooltip(x, y, contents) {
            $('<div id="tooltip">' + contents + '</div>').css({
                position: 'absolute',
                display: 'none',
                top: y + 5,
                left: x + 15,
                border: '1px solid #333',
                padding: '4px',
                color: '#fff',
                'border-radius': '3px',
                'background-color': '#333',
                opacity: 0.80
            }).appendTo("body").fadeIn(200);
        }

        var previousPoint = null;
        $("#chart_3").bind("plothover", function(event, pos, item) {
            $("#x").text(pos.x.toFixed(2));
            $("#y").text(pos.y.toFixed(2));

            if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;

                    $("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);

                    showTooltip(item.pageX, item.pageY, item.series.label + " of " + item.series.data[item.dataIndex] + " = " + y);
                }
            } else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });
    }

    var InitChart3ForMulti=function() {
        if ($('#chart_3').size() != 1) {
            return;
        }

        //对全局变量数据进行处理
        var plotData = [];
        plotData.push({data:0,label:0})
        for(var i = 0;i<chartDataExtra.length;i++)
        {
            var plotItem = {
                data: chartDataExtra[i],
                label: laneStore[i],
                lines: {
                    lineWidth: 1,
                },
                shadowSize: 0

            };

            plotData.push(plotItem);
        }
        
        console.log(chartDataExtra)

        var plot = $.plot($("#chart_3"), plotData, {
            series: {
                lines: {
                    show: true,
                    lineWidth: 2,
                    fill: true,
                    fillColor: {
                        colors: [{
                            opacity: 0.05
                        }, {
                            opacity: 0.01
                        }]
                    }
                },
                points: {
                    show: true,
                    radius: 3,
                    lineWidth: 1
                },
                shadowSize: 2
            },
            grid: {
                hoverable: true,
                clickable: true,
                tickColor: "#eee",
                borderColor: "#eee",
                borderWidth: 1
            },
            colors: ["#d12610", "#37b7f3", "#52e136"],
            xaxis: {
                minTickSize: [1, 1],  // 设置刻度的最小间隔为一天
                autoscaleMargin: 0.1,  // 设置自适应边距为 10% （可以根据需要进行调整）
                tickColor: "#eee",
                min:1,
                max:12
            },
            yaxis: {
                ticks: 11,
                tickDecimals: 0,
                tickColor: "#eee",
            }
        });


        function showTooltip(x, y, contents) {
            $('<div id="tooltip">' + contents + '</div>').css({
                position: 'absolute',
                display: 'none',
                top: y + 5,
                left: x + 15,
                border: '1px solid #333',
                padding: '4px',
                color: '#fff',
                'border-radius': '3px',
                'background-color': '#333',
                opacity: 0.80
            }).appendTo("body").fadeIn(200);
        }

        var previousPoint = null;
        $("#chart_3").bind("plothover", function(event, pos, item) {
            $("#x").text(pos.x.toFixed(2));
            $("#y").text(pos.y.toFixed(2));

            if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;

                    $("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);

                    showTooltip(item.pageX, item.pageY, item.series.label + " of " + item.series.data[item.dataIndex] + " = " + y);
                }
            } else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });
    }
    //图表的初始化函数-----结束


    var getWeek = function(date) {

        // 创建一个新的日期对象，将其设置为给定的日期
        const target = new Date(date); // 创建目标日期的副本

        const day = target.getDay(); // 获取目标日期的星期几（0-6，其中0表示星期日）

        var weekList = [];

        // 计算目标日期距离所在周一的天数偏移量
        const offset = (day + 6) % 7;


        // 将目标日期的日期部分设置为目标日期减去偏移量得到的周一日期
        target.setDate(target.getDate() - offset);
        weekList.push(target.toISOString().slice(0,10));

        var target2 = new Date(target);
        target2.setDate(target2.getDate()+6);
        weekList.push(target2.toISOString().slice(0,10));


        return weekList; // 返回所在周
    }

    var getMonthList = function(date) {

        // 创建一个新的日期对象，将其设置为给定的日期
        var target1 = new Date(date);
        const target2 = new Date(date); // 创建目标日期的副本

        target1.setDate(1);

        const month = target2.getMonth(); // 获取目标日期的星期几（0-6，其中0表示星期日）
        target2.setMonth(month + 1, 1);
        target2.setDate(target2.getDate()-1);
        var monthList = [];

        monthList.push(target1.toISOString().slice(0,10));
        monthList.push(target2.toISOString().slice(0,10));

        return monthList; // 返回所在月第一天和最后一天
    }

    var getYearList = function(date) {

        date = new Date(date);
        var dateStr = (date).toISOString().slice(0,4);
        // 创建一个新的日期对象，将其设置为给定的日期
        var target1 = new Date(dateStr);
        var target2 = new Date(dateStr); // 创建目标日期的副本
        target2.setDate(date.getDate()-1);
        target2.setFullYear(date.getFullYear()+1);
        var yearList = [];

        yearList.push(target1.toISOString().slice(0,10));
        yearList.push(target2.toISOString().slice(0,10));

        return yearList; // 返回今年第一天和最后一天
    }


    var initDailyAnalysisPrint = function(){
        getDailyAnalysisRecordPrint();
    }





    var  getDailyAnalysisRecordPrint = function(){
        var url = "../../analysis_data_servlet_action";
        var data={};
        data.action="get_report";
        $.post(url,data,function(json){
            if(json.result_code==0){
                console.log(JSON.stringify(json));

                var list = json.report_aaData;

                var myhtml="";
                if(list!=undefined && list.length>0)
                {
                    for(var i=0;i<list.length;i++) {

                        var record=list[i];
                        myhtml+="<tr><td class=\"highlight\">" +record.lane_name+"</td>";
                        myhtml+="<td>" +(record.status0+record.status1
                            +record.status2+record.status3+record.status4)+" </td>"
                        myhtml+="<td>"+record.status0 +"</td>";
                        myhtml+="<td class=\"highlight\">"+record.status1+"</td>";
                        myhtml+="<td>"+record.status2+"</td>";
                        myhtml+="<td>"+record.status3 +"</td>";
                        myhtml+="<td class=\"highlight\">"+record.status4+"</td>";
                        myhtml+="</tr>";
                    }
                }
            }
            $("#print_list").html(myhtml);
        });


    }


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
        window.open("daily_print_default.jsp");
    }



    //submit functions end

    var returnBack = function(){
        history.go(-1);
    }



    //Page return 开始
    return {
        init: function() {
            initPageControl();
        }
    }
}();//Page
/*================================================================================*/
