<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div class="modal fade draggable-modal" id="record_view_div" tabindex="-1" role="basic" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                <h4 class="modal-title">查看记录</h4>
            </div>
            <div class="modal-body">
                <div id="_id"></div>
                <div class="portlet-body form">
                    <form class="form-horizontal" role="form">
                        <div class="form-body">
                            <div class="form-group">
                                <label class="col-md-3 control-label"> 道路名称：</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" id="lane_name" name="lane_name" placeholder="Enter text"  disabled>

                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-md-3 control-label">速度限制：</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" id="speed_limit" name="speed_limit" placeholder="Enter text" disabled>

                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label">车速限制：</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" id="speed_limit_for_others" name="speed_limit_for_others" placeholder="Enter text" disabled>

                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label">是否禁停：</label>
                                <div class="col-md-9">
                                    <select class="form-control" id="park_limit_tag" name="park_limit_tag" disabled>
                                        <option>是</option>
                                        <option>否</option>
                                    </select>

                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>
