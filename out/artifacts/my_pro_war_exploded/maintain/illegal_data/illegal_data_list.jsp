<%--
  Created by IntelliJ IDEA.
  User: CornerGjr
  Date: 2023/11/27
  Time: 21:37
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>


<!DOCTYPE html>

<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en">
<!--<![endif]-->
<!-- BEGIN HEAD -->
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
<!-- BEGIN HEADER -->
<div class="page-header navbar navbar-fixed-top">
    <!-- BEGIN HEADER INNER -->
    <div class="page-header-inner">
        <!-- BEGIN LOGO -->
        <div class="page-logo">
            <a href=../../index.jsp>
                <img src="../../assets/admin/layout4/img/logo-light.png" alt="logo" class="logo-default"/>
            </a>
            <div class="menu-toggler sidebar-toggler">
                <!-- DOC: Remove the above "hide" to enable the sidebar toggler button on header -->
            </div>
        </div>
        <!-- END LOGO -->
        <!-- BEGIN RESPONSIVE MENU TOGGLER -->
        <a href="javascript:;" class="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">
        </a>
        <!-- END RESPONSIVE MENU TOGGLER -->
        <!-- BEGIN PAGE ACTIONS -->
        <!-- DOC: Remove "hide" class to enable the page header actions -->
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
        <!-- END PAGE ACTIONS -->
        <!-- BEGIN PAGE TOP -->
        <div class="page-top">
            <!-- BEGIN HEADER SEARCH BOX -->
            <!-- DOC: Apply "search-form-expanded" right after the "search-form" class to have half expanded search box -->
            <form class="search-form" action="extra_search.html" method="GET">
                <div class="input-group">
                    <input type="text" class="form-control input-sm" placeholder="Search..." name="query">
                    <span class="input-group-btn">
					<a href="javascript:;" class="btn submit"><i class="icon-magnifier"></i></a>
					</span>
                </div>
            </form>
            <!-- END HEADER SEARCH BOX -->
            <!-- BEGIN TOP NAVIGATION MENU -->
            <%@include file="containers/top_menu.jsp"%>
            <!-- END TOP NAVIGATION MENU -->
        </div>
        <!-- END PAGE TOP -->
    </div>
    <!-- END HEADER INNER -->
</div>
<!-- END HEADER -->
<div class="clearfix">
</div>
<!-- BEGIN CONTAINER -->
<div class="page-container">
    <!-- BEGIN SIDEBAR -->
    <%@include file="containers/page_sidebar.jsp"%>
    <!-- END SIDEBAR -->

    <!-- BEGIN CONTENT -->
    <div class="page-content-wrapper">
        <div class="page-content">
            <!-- BEGIN SAMPLE PORTLET CONFIGURATION MODAL FORM-->
            <div class="modal fade" id="portlet-config" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                            <h4 class="modal-title">Modal title</h4>
                        </div>
                        <div class="modal-body">
                            Widget settings form goes here
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn blue">Save changes</button>
                            <button type="button" class="btn default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                    <!-- /.modal-content -->
                </div>
                <!-- /.modal-dialog -->
            </div>
            <!-- /.modal -->
            <!-- END SAMPLE PORTLET CONFIGURATION MODAL FORM-->
            <!-- BEGIN PAGE HEADER-->

            <!-- BEGIN PAGE HEAD -->
            <div class="page-head">
                <!-- BEGIN PAGE TITLE -->
                <div class="page-title">
                    <h1>车辆监控<small>违法数据信息表</small></h1>
                </div>
                <!-- END PAGE TITLE -->

                <!-- BEGIN PAGE TOOLBAR -->
                <%@include file="../../home/frame/frame_tool_bar.jsp"%>
                <!-- END PAGE TOOLBAR -->

            </div>
            <!-- END PAGE HEAD -->

            <!-- BEGIN PAGE BREADCRUMB -->
            <%-- 标题下链接--%>
            <div class="page-bar">
                <ul class="page-breadcrumb breadcrumb">
                    <li>
                        <a href="../../index.jsp">Home</a>
                        <i class="fa fa-circle"></i>
                    </li>
                    <li>
                        <a href="../monitor/monitor_list.jsp">车辆检测数据</a>
                        <i class="fa fa-circle"></i>
                    </li>
                    <li>
                        <a href="#">违法数据监控</a>
                    </li>
                </ul>
            </div>

            <!-- END PAGE BREADCRUMB -->
            <!-- END PAGE HEADER-->
            <!-- BEGIN PAGE CONTENT-->

            <input  type="hidden" id="page_id" name="page_id" value="illegal_list">

            <div class="row">
                <div class="col-md-6">
                    <button type="button" id="export_button" name ="export_button" class="btn red">导出记录</button>
                    <button type="button" id="print_button" name="print_button" class="btn blue">打印</button>
                    <button type="button" id="print_button_for_word" name="print_button_for_word" class="btn blue">用word打印</button>
                    <button type="button" id="statistics_button" name="statistics_button" class="btn blue">统计</button>
                    <button type="button" id="ac_query_button" name ="ac_query_button" class="btn red">查询</button>
                </div>
            </div>

            <br/>

            <%--datatable数据表--%>
            <div class="row" id="row_db">
                <div class="col-md-12">
                    <div class="portlet box blue">
                        <div class="portlet-title">
                            <div class="caption">
                                <i class="fa fa-comments"></i>违法数据列表
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
                                        <th class="table-checkbox"><input type="checkbox" class="group-checkable" data-set="#illegal_list .checkboxes" /></th>
                                        <th>序号</th>
                                        <th>车牌号</th>
                                        <th>车辆类型</th>
                                        <th>违法类型</th>
                                        <th>抓拍时间</th>
                                        <th>车速</th>
                                        <th>抓拍路段</th>
                                        <th>抓拍图片</th>
                                        <th>操作</th>
                                    </tr>
                                    </thead>
                                </table>

                            </div>
                        </div>

                    </div>

                </div>

                <!--上传文件处理-->
                <div class="row">
                    <div class="col-md-12">
                        <div id="current_attachment_name" name="current_attachment_name" value=""></div>
                        <input type="hidden" id="current_attachment_object_id" name="current_attachment_object_id" value="">
                        <form id="ajax_form" name="ajax_form" class="form-horizontal" method="post" enctype="multipart/form-data">
                            <div id="ajax_div" name="ajax_div">
                                <div id="record_list_div" name="record_list_div"></div>
                                <span class="btn green fileinput-button">
                                    <i class="fa fa-plus"></i>
                                    <span>Add files... </span>
                                    <input type="file" id="upload_file" name="upload_file">
                                </span>

                                <button type="button" class="btn red fileinput-button" id="upload_button" name="upload_button">
                                    <i class="fa fa-upload"></i>
                                    <span>Start upload </span>
                                </button>
                            </div>

                        </form>
                        <hr>
                    </div>

                </div>
                <%--上传文件处理结束--%>
                <!-- END PAGE CONTENT-->

            </div>
        </div>
        <!-- END CONTENT -->

    </div>
</div>
<!-- END CONTENT -->
</div>
<!-- END CONTAINER -->

<!-- BEGIN FOOTER -->
<%@include file="../../home/frame/frame_footer.jsp"%>
<!-- END FOOTER -->

<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->


<!-- END JAVASCRIPTS -->
</body>
<!-- END BODY -->

<!--修改数据-->
<%@include file="illegal_data_export_div.jsp"%>
<%@include file="illegal_data_query_div.jsp"%>

</html>
<%@include file="../../home/frame/frame_javascript.jsp"%>
<script src="../../assets/js/illegal.data.js" type="text/javascript"></script>


