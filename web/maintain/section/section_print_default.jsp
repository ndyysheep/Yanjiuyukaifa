<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html>
 <html lang="en" class="ie8 no-js">
 <html lang="en" class="ie9 no-js">
<html>
<head>
    <meta charset="UTF-8"/>
    <title id="title">My_pro:web|打印|</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="width=monitor-width, initial-scale=1.0" name="viewport"/>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <meta content="" name="description"/>
    <meta content="" name="author"/>
    <%@include file="../../home/frame/frame_style.jsp"%>
    <link rel="shortcut icon" href="containers/favicon.ico"/>
    <link href="containers/css/dataTables.bootstrap.css" rel="stylesheet" type="text/css"/>
</head>
<body class="page-header-fixed">
<div class="clearfix">
</div>
<!-- BEGIN CONTAINER -->
<div>
    <div >
        <div class="page-content">

            <h3 class="page-title" >
                我的数据库表<small>车辆抓拍统计表</small>
            </h3>

            <input  type="hidden" id="page_id" name="page_id" value="monitor_print">

            <div class="row" >
                <div class="col-md-12">
                    <!-- BEGIN SAMPLE TABLE PORTLET-->
                    <div class="portlet">
                        <div class="portlet-title">
                            <div class="caption">
                                    <i class="fa fa-bell-o"></i>车辆抓拍统计
                            </div>
                            <button type="button" class="btn btn-primary" id="printButton">
                                <i class="fa fa-print"></i> 打印
                            </button>
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
                                <table class="table table-striped table-bordered table-advance table-hover">
                                    <thead>
                                    <tr>
                                        <th class="">
                                            <i class="fa fa-briefcase"></i> 道路ID
                                        </th>
                                        <th>
                                            <i class="fa fa-road"></i> 道路名称
                                        </th>
                                        <th>
                                            <i class="fa fa-tachometer"></i> 速度限制
                                        </th>
                                        <th>
                                            <i class="fa fa-car"></i> 车速限制
                                        </th>
                                        <th>
                                            <i class="fa fa-ban"></i> 是否禁停
                                        </th>
                                    </tr>
                                    </thead>

                                    <tbody id ="print_list">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<%@include file="../../home/frame/frame_javascript.jsp"%>
<script src="section.js" type="text/javascript"></script>
<script src="../../assets/js/dataTables.bootstrap.js" type="text/javascript"></script>
<script src="../../assets/js/jquery.dataTables.min.js" type="text/javascript"></script>
<style>
    /* 在媒体类型为 print 时隐藏打印按钮 */
    @media print {
        #printButton {
            display: none;
        }

    }
</style>
<script>

    // 在页面加载完成后执行的 JavaScript
    $(document).ready(function() {
        // 给打印按钮添加点击事件
        $("#printButton").click(function() {
            // 调用浏览器的打印功能
            window.print();
        });
    });
</script>
</body>
</html>
<%@include file="section_add_div.jsp"%>
<%@include file="section_modify_div.jsp"%>
<%@include file="section_export_div.jsp"%>
