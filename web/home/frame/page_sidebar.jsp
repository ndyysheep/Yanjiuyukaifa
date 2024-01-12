<%--
  Created by IntelliJ IDEA.
  User: CornerGjr
  Date: 2023/11/27
  Time: 23:46
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<div class="page-sidebar-wrapper">
    <!-- DOC: Set data-auto-scroll="false" to disable the sidebar from auto scrolling/focusing -->
    <!-- DOC: Change data-auto-speed="200" to adjust the sub menu slide up/down speed -->
    <div class="page-sidebar navbar-collapse collapse">
        <!-- BEGIN SIDEBAR MENU -->
        <!-- DOC: Apply "page-sidebar-menu-light" class right after "page-sidebar-menu" to enable light sidebar menu style(without borders) -->
        <!-- DOC: Apply "page-sidebar-menu-hover-submenu" class right after "page-sidebar-menu" to enable hoverable(hover vs accordion) sub menu mode -->
        <!-- DOC: Apply "page-sidebar-menu-closed" class right after "page-sidebar-menu" to collapse("page-sidebar-closed" class must be applied to the body element) the sidebar sub menu mode -->
        <!-- DOC: Set data-auto-scroll="false" to disable the sidebar from auto scrolling/focusing -->
        <!-- DOC: Set data-keep-expand="true" to keep the submenues expanded -->
        <!-- DOC: Set data-auto-speed="200" to adjust the sub menu slide up/down speed -->
        <ul class="page-sidebar-menu " data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200">
            <li class="start ">
                <a href="index.html">
                    <i class="icon-home"></i>
                    <span class="title">Dashboard</span>
                </a>
            </li>
            <li>
                <ul class="sub-menu">
                    <li>
                        <a href="ecommerce_index.html">
                            <i class="icon-home"></i>
                            Dashboard</a>
                    </li>
                    <li>
                        <a href="ecommerce_orders.html">
                            <i class="icon-basket"></i>
                            Orders</a>
                    </li>
                    <li>
                        <a href="ecommerce_orders_view.html">
                            <i class="icon-tag"></i>
                            Order View</a>
                    </li>
                    <li>
                        <a href="ecommerce_products.html">
                            <i class="icon-handbag"></i>
                            Products</a>
                    </li>
                    <li>
                        <a href="ecommerce_products_edit.html">
                            <i class="icon-pencil"></i>
                            Product Edit</a>
                    </li>
                </ul>
            </li>
            <li id="monitor_lists">
                <a href="javascript:;">
                    <i class="icon-rocket"></i>
                    <span class="title">车辆检测数据</span>
                    <span class="arrow open"></span>
                </a>
                <ul class="sub-menu">
                    <li id ="monitor_list">
                        <a href="../../maintain/monitor/monitor_list.jsp">
                            <span class="badge badge-warning">new</span>车辆数据监控</a>
                    </li>
                    <li id ="monitor_statistics">
                        <a href="../../maintain/monitor/monitor_statistics.jsp">
                            车辆数据统计</a>
                    </li>
                    <li id ="illegal_data_list">
                        <a href="../../maintain/illegal_data/illegal_data_list.jsp">
                            违法数据监控</a>
                    </li >
                    <li id ="illegal_data_statistics">
                        <a href="../../maintain/illegal_data/illegal_data_statistics.jsp">
                            违法数据统计</a>
                    </li>
                    <li id="flow_list">
                        <a href="../../maintain/count_of_lane/flow_list.jsp">
                            车流量监控</a>
                    </li>
                    <li id="flow_data_statistics">
                        <a href="../../maintain/count_of_lane/flow_statistics.jsp">
                            车流量统计</a>
                    </li>
                </ul>
            </li>
            <li id="reports">
                <a href="javascript:;">
                    <i class="icon-diamond"></i>
                    <span class="title">流量统计分析</span>
                    <span class="arrow "></span>
                </a>
                <ul class="sub-menu">
                    <li id="daily_report">
                        <a href="../../maintain/comprehensive_statistics/daily_statistics.jsp">
                            监测数据日报表</a>
                    </li>
                    <li id="weekly_report">
                        <a href="../../maintain/comprehensive_statistics/weekly_statistics.jsp">
                            监测数据周报表</a>
                    </li>
                    <li id="monthly_report">
                        <a href="../../maintain/comprehensive_statistics/monthly_statistics.jsp">
                            监测数据月报表</a>
                    </li>
                    <li id="yearly_report">
                        <a href="../../maintain/comprehensive_statistics/yearly_statistics.jsp">
                            监测数据年报表</a>
                    </li>
                </ul>
            </li>
            <!-- BEGIN ANGULARJS LINK -->
            <!-- END ANGULARJS LINK -->
            <li>
                <a href="../../main/userManage/extra_profile_account.jsp">
                    <i class="icon-user-following"></i>
                    <span class="title">用户信息</span>
                </a>
            </li>
            <li>
                <a href="../../main/WeatherReport/WeatherReporter.jsp">
                    <i class="icon-pointer"></i>
                    <span class="title">天气预报</span>
                </a>
            </li>
        </ul>
        <!-- END SIDEBAR MENU -->
    </div>
</div>