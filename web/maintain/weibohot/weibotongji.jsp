<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>Metronic | Page Layouts - Sidebar Fixed Page</title>
    <script src="echarts.min.js" type="text/javascript"></script>
    <%@include file="../../home/frame/frame_style.jsp"%>
</head>

<body style="height: 100%; margin: 0">

<div class="page-header navbar navbar-fixed-top">

    <div class="page-header-inner">

        <div class="page-logo">
            <a href="index.html">
                <img src="../../assets/admin/layout4/img/logo-light.png" alt="logo" class="logo-default"/>
            </a>
            <div class="menu-toggler sidebar-toggler">

            </div>
        </div>

        <a href="javascript:;" class="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">
        </a>

        <div class="page-actions">
            <div class="btn-group">
                <button type="button" class="btn red-haze btn-sm dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <span class="hidden-sm hidden-xs">Actions&nbsp;</span><i class="fa fa-angle-down"></i>
                </button>
                <ul class="dropdown-menu" role="menu">
                    <li>
                        <a href="javascript:;">
                            <i class="icon-docs"></i> New Post </a>
                    </li>
                    <li>
                        <a href="javascript:;">
                            <i class="icon-tag"></i> New Comment </a>
                    </li>
                    <li>
                        <a href="javascript:;">
                            <i class="icon-share"></i> Share </a>
                    </li>
                    <li class="divider">
                    </li>
                    <li>
                        <a href="javascript:;">
                            <i class="icon-flag"></i> Comments <span class="badge badge-success">4</span>
                        </a>
                    </li>
                    <li>
                        <a href="javascript:;">
                            <i class="icon-users"></i> Feedbacks <span class="badge badge-danger">2</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="page-top">

            <form class="search-form" action="extra_search.html" method="GET">
                <div class="input-group">
                    <input type="text" class="form-control input-sm" placeholder="Search..." name="query">
                    <span class="input-group-btn">
					<a href="javascript:;" class="btn submit"><i class="icon-magnifier"></i></a>
					</span>
                </div>
            </form>
            <%@include file="../../home/frame/top_menu.jsp"%>
        </div>
    </div>

</div>
<div class="clearfix">
</div>
<div class="page-container">
    <%@include file="../../home/frame/page_sidebar.jsp"%>
    <div class="page-content-wrapper">
        <div class="page-content">
            <div class="page-head">
                <div class="page-title">
                    <h1>热榜统计<small> </small></h1>
                </div>
                <%@include file="../../home/frame/frame_tool_bar.jsp"%>
            </div>

            <div class="page-bar">
                <ul class="page-breadcrumb breadcrumb">
                    <li>
                        <a href="section.jsp">Home</a>
                        <i class="fa fa-circle"></i>
                    </li>
                </ul>
            </div>
        <hr />
            <div id="main" style="height: 570px"></div>
        </div>
    </div>

</div>
</body>
</html>
<script src="jquery.js" type="text/javascript"></script>
<script type="text/javascript">
    var url = "../../weibohot_data_servlet_action";
    var data = { action: "get_weibo_record" };

    $.post(url, data, function(json) {
        var titles = [];
        var hots = [];
        var data1 = json.aaData;

        data1.forEach(function(item) {
            titles.push(item.title);
            var hotValue = item.hot.replace("万", "0000").replace("千", "000");
            hots.push(parseInt(hotValue));
        });

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '微博热搜热度'
            },
            tooltip: {},
            legend: {
                data: ['热度']
            },
            grid: {
                bottom: '10%',
            },
            xAxis: {
                data: titles,
                axisLabel: {
                    rotate: 60,
                    interval: 0,
                    fontSize: 10
                }
            },
            yAxis: {},
            series: [{
                name: '热度',
                type: 'bar',
                data: hots
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }, 'json'); // 确保指定 'json' 以预期 JSON 响应
</script>

