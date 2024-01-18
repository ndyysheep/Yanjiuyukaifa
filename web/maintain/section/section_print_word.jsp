<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML>
<html>

<head>
    <meta http-equiv=Content-Type content="text/html; charset=utf-8">
    <meta name=Generator content="Microsoft Word 15 (filtered)">
    <title>My_pro:web|Word打印|</title>


    <style>
        <!--
        /* Font Definitions */
        @font-face
        {font-family:"Cambria Math";
            panose-1:2 4 5 3 5 4 6 3 2 4;}
        @font-face
        {font-family:微软雅黑;
            panose-1:2 11 5 3 2 2 4 2 2 4;}
        @font-face
        {font-family:"\@微软雅黑";}
        /* Style Definitions */
        p.MsoNormal, li.MsoNormal, div.MsoNormal
        {margin:0cm;
            text-align:justify;
            text-justify:inter-ideograph;
            font-size:10.5pt;
            font-family:等线;}
        /* Page Definitions */
        @page WordSection1
        {size:595.3pt 841.9pt;
            margin:72.0pt 90.0pt 72.0pt 90.0pt;
            layout-grid:15.6pt;}
        div.WordSection1
        {page:WordSection1;}
        -->
    </style>

</head>

<body lang=ZH-CN style='word-wrap:break-word;text-justify-trim:punctuation'>



<div class=WordSection1 style='layout-grid:15.6pt'>
    <input type="hidden" id="page_id" name="page_id" value="section_print_word">
    <table class=MsoTable15Grid3Accent3 border=1 cellspacing=0 cellpadding=0
           style='border-collapse:collapse;border:none'>
        <tr style='height:28.05pt'>
            <td width=546 colspan=8 valign=top style='width:409.25pt;border:none;
  border-bottom:solid #C9C9C9 1.0pt;background:white;padding:0cm 5.4pt 0cm 5.4pt;
  height:28.05pt'>
                <p class=MsoNormal align=center style='text-align:center'><b><i><span
                        style='font-family:"微软雅黑",sans-serif;color:black'>违法路段信息表</span></i></b></p>
            </td>
        </tr>
        <tr style='height:26.95pt' >
            <td width=63 valign=top style='width:46.95pt;border:none;border-right:solid #C9C9C9 1.0pt;
  background:white;padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt' class="hidden-xs">
                <p class=MsoNormal  align=center style='text-align:center'><i><span
                        lang=EN-US style='font-family:"微软雅黑",sans-serif;color:black'>id</span></i></p>
            </td>

            <td width=106 valign=top style='width:79.4pt;border-top:none;border-left:
  none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>
                <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US
                                                                                style='font-family:"微软雅黑",sans-serif'>道路名称</span></p>
            </td>
            <td width=63 valign=top style='width:47.05pt;border-top:none;border-left:
  none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>
                <p class=MsoNormal align=center style='text-align:center'><span
                        style='font-family:"微软雅黑",sans-serif'>速度限制</span></p>
            </td>
            <td width=63 valign=top style='width:47.05pt;border-top:none;border-left:
  none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>
                <p class=MsoNormal align=center style='text-align:center'><span
                        style='font-family:"微软雅黑",sans-serif'>车速限制</span></p>
            </td>
            <td width=63 valign=top style='width:47.05pt;border-top:none;border-left:
  none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>
                <p class=MsoNormal align=center style='text-align:center'><span
                        style='font-family:"微软雅黑",sans-serif'>是否禁停</span></p>
            </td>
        </tr>
        <tbody class="row" id="print_list_for_word">

        </tbody>
        <!-- 添加Word打印按钮 -->
        <button type="button" class="btn btn-primary" id="printButton">
            <i class="fa fa-print"></i> 打印
        </button>
    </table>

    <p class=MsoNormal><span lang=EN-US style='font-family:"微软雅黑",sans-serif'>&nbsp;</span></p>

</div>
<%@include file="../../home/frame/frame_javascript.jsp"%>
<script src="section.js" type="text/javascript"></script>
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
