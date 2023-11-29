<%--
  Created by IntelliJ IDEA.
  User: Probe
  Date: 2023/10/15
  Time: 15:41
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div class="modal fade draggable-modal" id="record_add_div" tabindex="-1" role="basic" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                <h4 class="modal-title">添加记录</h4>
            </div>
            <div class="modal-body">
                <div class="portlet-body form">
                    <form class="form-horizontal" role="form">
                        <div class="form-body">
                            <div class="form-group">
                                <label class="col-md-3 control-label"> 车牌号：</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" id="car_code" name="car_code" placeholder="Enter text">
                                    <span class="help-block">
											请输入车牌号 </span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-md-3 control-label">车辆类型: </label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" id="vehicle_type" name="vehicle_type" placeholder="Enter text">
                                    <span class="help-block">
											A block of help text. </span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-md-3 control-label">违法行为：</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" id="illegal_status" name="illegal_status" placeholder="Enter text">
                                    <span class="help-block">
											A block of help text. </span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-md-3 control-label">抓拍时间：</label>
                                    <div class="col-md-5">
                                        <div class="input-group input-medium date date-picker" data-date="2023-01-01" data-date-format="yyyy-mm-dd" data-date-viewmode="years">
                                            <input type="text" class="form-control" readOnly="" id="capture_time">
                                            <span class="input-group-btn">
                                                <button class="btn default" type="button">
                                                    <i class="fa fa-calendar"></i>
                                                </button>
                                            </span>
                                        </div>
                                        <!-- /input-group -->
                                        <span class="help-block" id="endHelper">选择抓拍日期</span>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="input-group">
                                            <input type="text" class="form-control timepicker timepicker-24" id ="capture_time_sec">
                                            <span class="input-group-btn">
                                                <button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
                                            </span>
                                        </div>
                                    </div>

                            </div>


                            <div class="form-group">
                                <label class="col-md-3 control-label">速度：</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" id="speed" name="speed" placeholder="Enter text">
                                    <span class="help-block">
											A block of help text. </span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-md-3 control-label">抓拍路段：</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" id="lane_name" name="lane_name" placeholder="Enter text">
                                    <span class="help-block">
											A block of help text. </span>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn default" data-dismiss="modal">取消</button>
                <button type="button" class="btn blue" id="submit_button" name="submit_button">确认添加</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>