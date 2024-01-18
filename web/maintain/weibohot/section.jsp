
<%@ page contentType="text/html;charset=UTF-8" language="java" %>


<!DOCTYPE html>

<html lang="en" class="ie8 no-js">
<html lang="en" class="ie9 no-js">

<html lang="en">

<head>
    <meta charset="utf-8"/>
    <title>Metronic | Page Layouts - Sidebar Fixed Page</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <meta content="" name="description"/>
    <meta content="" name="author"/>
    <%@include file="../../home/frame/frame_style.jsp"%>

</head>

<body class="page-header-fixed page-sidebar-closed-hide-logo page-sidebar-fixed page-sidebar-closed-hide-logo">

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
                    <h1>Api管理<small> 微博热榜表</small></h1>
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

            <%--开始当前自写板块--%>
            <input  type="hidden" id="page_id" name="page_id" value="monitor_list">
            <div class="row">
                <div class="col-md-12">
                    <button type="button" id="ac_select_button" name ="select_button" class="btn default blue-stripe">从api获取微博数据</button>
                    <button type="button" id="ac_add_button" name ="ac_add_button" class="btn default red-stripe">添加记录</button>
                    <button type="button" id="export_button" name ="export_button" class="btn default blue-stripe">导出记录</button>
                    <button type="button" id="importButton" name ="importButton" class="btn default blue-stripe">导入记录</button>
                    <input type="file" id="fileInput" style="display: none;" accept=".xlsx, .xls"/>
                    <button type="button" id="print_button" name="print_button" class="btn default red-stripe">打印</button>
                    <button type="button" id="print_button_for_word" name="print_button_for_word" class="btn default blue-stripe">用word打印</button>
                    <button type="button" id="statistics_button" name="statistics_button" class="btn default blue-stripe">统计</button>
                    <button type="button" id="ac_query_button" name ="query_button" class="btn default blue-stripe">查询</button>

                </div>

            </div>

            <br/>
            <%--datatable数据表--%>
            <div class="row" id="row_db">
                <div class="col-md-12">
                    <div class="portlet box blue-hoki">
                        <div class="portlet-title">
                            <div class="caption">
                                <i class="fa fa-comments"></i>微博热榜表
                            </div>
                            <div class="tools">
                                <a href="javascript:;" class="collapse">
                                </a>
                                <a href="#portlet-config" data-toggle="modal" class="config">
                                </a>
                                <a href="javascript:;" class="reload">
                                </a>
                                <a href="javascript:;" class="remove">
                                </a>
                            </div>
                        </div>
                        <div class="portlet-body">
                            <div class="table-scrollable">
                                <table class="table table-striped table-bordered table-hover datatable" id="sample_1">
                                    <thead>
                                    <tr>
                                        <th class="table-checkbox"><input type="checkbox" class="group-checkable" data-set="#monitor_list .checkboxes" /></th>
                                        <th>序号</th>
                                        <th>热榜名字</th>
                                        <th>热度</th>
                                        <th>热度地址</th>
                                        <th>操作</th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<%@include file="../../home/frame/frame_footer.jsp"%>
<%@include file="../../home/frame/frame_javascript.jsp"%>
</body>
<%@include file="section_add_div.jsp"%>
<%@include file="section_query_div.jsp"%>
<%@include file="section_modify_div.jsp"%>
<%@include file="section_export_div.jsp"%>
<%@include file="section_view_div.jsp"%>
</html>

<script src="section.js" type="text/javascript"></script>
<script type="text/javascript">
    // 当用户点击按钮时触发文件选择
    document.getElementById('importButton').addEventListener('click', function() {
        document.getElementById('fileInput').click();
    });

    // 当用户选择文件时
    document.getElementById('fileInput').addEventListener('change', function() {
        var file = this.files[0]; // 获取选择的文件
        if (file) {
            var formData = new FormData();
            formData.append('file', file); // 将文件添加到 form data
         var type=0;
            $.ajax({
                url: 'http://localhost:8080/uploadExcel?type=' +type , // Servlet URL
                type: 'POST',
                data: formData,
                processData: false, // 告诉 jQuery 不要处理发送的数据
                contentType: false, // 告诉 jQuery 不要设置内容类型
                success: function(response) {
                      alert("上传成功！")
                    location.reload(); // 在这里添加页面刷新
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert("上传失败！")
                }
            });
        }
    });
</script>

