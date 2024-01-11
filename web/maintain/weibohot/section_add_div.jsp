
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
                                <label class="col-md-3 control-label"> 热榜名字：</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" id="title" name="title" placeholder="Enter text">
                                    <span class="help-block">
											请输入热榜 </span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-md-3 control-label">热度：</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" id="hot" name="hot" placeholder="Enter text">
                                    <span class="help-block">
											请输入热度. </span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 control-label">热度地址：</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" id="url" name="url" placeholder="Enter text">
                                    <span class="help-block">
											请输入热度地址. </span>
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
