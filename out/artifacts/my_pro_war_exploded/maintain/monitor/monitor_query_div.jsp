<%--
  Created by IntelliJ IDEA.
  User: Probe
  Date: 2023/10/15
  Time: 15:41
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div class="modal fade draggable-modal" id="record_query_div" tabindex="-1" role="basic" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                <h4 class="modal-title">查询记录</h4>
            </div>
            <div class="modal-body">
                <div class="portlet-body form">
                    <form class="form-horizontal" role="form">
                        <div class="form-body">

                            <div class="form-group">
                                <label class="col-md-3 control-label">序号: </label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" id="id" name="id" placeholder="Enter text">
                                    <span class="help-block">
											A block of help text. </span>
                                </div>
                            </div>

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
                                    <select class="form-control" id="illegal_status" name="illegal_status">
                                        <option></option>
                                        <option>正常行驶</option>
                                        <option>违停</option>
                                        <option>闯红灯</option>
                                        <option>压双黄线</option>
                                        <option>逆行</option>
                                    </select>
                                    <span class="help-block">
											A block of help text. </span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-md-3 control-label">开始时间：</label>
                                <div class="col-md-5">
                                    <div class="input-group input-medium date date-picker" data-date="2023-01-01" data-date-format="yyyy-mm-dd" data-date-viewmode="years">
                                        <input type="text" class="form-control" readOnly="" id="capture_time_from">
                                        <span class="input-group-btn">
                                                <button class="btn default" type="button">
                                                    <i class="fa fa-calendar"></i>
                                                </button>
                                            </span>
                                    </div>
                                    <!-- /input-group -->
                                    <span class="help-block" id="endHelper_from">选择开始时间</span>
                                </div>

                                <div class="col-md-4">
                                    <div class="input-group">
                                        <input type="text" class="form-control timepicker timepicker-24" id ="capture_time_sec_from">
                                        <span class="input-group-btn">
                                                <button class="btn default" type="button"><i class="fa fa-clock-o"></i></button>
                                            </span>
                                    </div>
                                </div>

                            </div>

                            <div class="form-group">
                                <label class="col-md-3 control-label">截止时间：</label>
                                <div class="col-md-5">
                                    <div class="input-group input-medium date date-picker" data-date="2023-01-01" data-date-format="yyyy-mm-dd" data-date-viewmode="years">
                                        <input type="text" class="form-control" readOnly="" id="capture_time_to">
                                        <span class="input-group-btn">
                                                <button class="btn default" type="button">
                                                    <i class="fa fa-calendar"></i>
                                                </button>
                                            </span>
                                    </div>
                                    <!-- /input-group -->
                                    <span class="help-block" id="endHelper_to">选择截止时间</span>
                                </div>

                                <div class="col-md-4">
                                    <div class="input-group">
                                        <input type="text" class="form-control timepicker timepicker-24" id ="capture_time_sec_to">
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
                <button type="button" class="btn blue" id="query_button" name="query_button">查询</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>