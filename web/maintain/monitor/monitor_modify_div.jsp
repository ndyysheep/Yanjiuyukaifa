<%--
  Created by IntelliJ IDEA.
  User: Probe
  Date: 2023/10/15
  Time: 15:41
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div class="modal fade draggable-modal" id="record_modify_div" tabindex="-1" role="basic" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                <h4 class="modal-title">修改记录</h4>
            </div>
            <div class="modal-body">id:
                <div id="_id"></div>
                <div class="portlet-body form">
                    <form class="form-horizontal" role="form">
                        <div class="form-body">
                            <div class="form-group">
                                <label class="col-md-3 control-label"> 车牌号：</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" id="car_code" name="car_code" placeholder="Enter text">
                                    <span class="help-block">
											A block of help text. </span>
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
                                <label class="col-md-3 control-label">违法类型：</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" id="illegal_status" name="illegal_status" placeholder="Enter text">
                                    <span class="help-block">
											A block of help text. </span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-md-3 control-label">抓拍时间：</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" id="capture_time" name="capture_time" placeholder="Enter text">
                                    <span class="help-block">
											A block of help text. </span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-md-3 control-label">车速：</label>
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
                <button type="button" class="btn blue" id="submit_button" name="submit_button">确认修改</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>