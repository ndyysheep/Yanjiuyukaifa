<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>上传文件</title>
    <link rel="stylesheet" type="text/css" href="../../assets/css/bootstrap.min.css"/>
    <link rel="stylesheet" type="text/css" href="../../assets/css/bootstrap-fileinput.css"/>
</head>

<body>
<h2>文件上传</h2>
<input type="hidden" id="page_id" name="page_id" value="monitor_file"/>
设备ID（唯一索引）：<input type="text" id="device_id" name="device_id" value=""/>
设备名称：<input type="text" id="device_name" name="device_name" value=""/>
<hr>
<form id="jump_form" name="jump_form" method="post" enctype="multipart/form-data">
    第1种方式：【跳转方式上传文件】
    <div id="jump_div" name="jump_div">
        <div id="record_list_div" name="record_list_div"></div>
        <input type="hidden" id="action" name="action" value="upload_file">
        <input type="file" id="upload_file" name="upload_file">
        <input type="file" id="upload_file1" name="upload_file1">
        <input type="file" id="upload_file2" name="upload_file2">
        <input type="hidden" id="device_id" name="device_id">
        <input type="hidden" id="device_name" name="device_name">
        <button type="button" id="upload_button" name="upload_button">页面跳转方式上传文件</button>
    </div>
</form>
<hr>

    <div id="current_attachment_name" name="current_attachment_name" value=""></div>
    <input type="hidden" id="current_attachment_object_id" name="current_attachment_object_id" value="">
    <form id="ajax_form" name="ajax_form" class="form-horizontal" method="post" enctype="multipart/form-data">
        第2种方式：【ajax方式上传文件】
        <div id="ajax_div" name="ajax_div">
            <div id="record_list_div" name="record_list_div"></div>
            <input type="file" id="upload_file" name="upload_file">
            <input type="file" id="upload_file" name="upload_file">
            <input type="file" id="upload_file" name="upload_file">
            <button type="button" id="upload_button" name="upload_button">局部刷新方式上传文件</button>
        </div>
    </form>
<hr>
<h4>
    1.源代码里指定了存放上传文件的地方，例如是：D:\upload，要预先建好这个目录或者修改源代码指定其他目录；<br>
    2.本页面展示了两种方式上传文件，用的都是同一个后台Servlet接收保存；<br>
    3.form要传输文件到后端，必须设置enctype成multipart/form-data方式<br>
    4.在form的enctype类型为multipart/form-data的时候，附带信息字段的传递，后台不能通过request.getParameter()的方式获取；<br>
    5.ajax方式上传文件时，后端保存了文件后，把流水号回传给前端，前端页面可以把这个流水号放入页面变量，或者js变量，作为上传文件唯一对应的标识，在页面提交保存的时候连同其他信息一起post到后端取保存；<br>
    6.前端页面发送文件到后端，后端用DiskFileItemFactory和ServletFileUpload接收文件数据，如果要观察原始的文件格式，可用TCP工具接收<a href="../../assets/img/TCP工具接收文件数据观察.jpg">【点击查看工具设置】</a>，前端的js里用第一种跳转方式，jump_form里的action设置成TCP工具监听的IP和端口，TCP工具设置接收数据转向文件，就可以源源不断地接收原始的文件数据下来观察；<br>
</h4>
</body>
</html>
<script src="../../assets/js/jquery.min.js"></script>
<script src="../../assets/js/bootstrap-fileinput.js"></script>
<script src="../../assets/js/jquery.form.js"></script>

<script src="../../assets/js/device.js"></script>
