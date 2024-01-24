var module="monitor";
var sub="data";
var check = 0;
document.domain="localhost";
/*================================================================================*/
jQuery(document).ready(function() {
    // initiate layout and plugins
    Metronic.init(); // init metronic core components
    Layout.init(); // init current layout
    Demo.init(); // init demo features
    ComponentsPickers.init();//选择时间
    Page.init();//页面初始化

});
/* ================================================================================ */


//关于页面的控件生成等操作都放在Page里
var Page = function() {
    /*----------------------------------------入口函数  开始----------------------------------------*/
    var initPageControl=function(){
        pageId = $("#page_id").val();
        if(pageId==="imageUpload"){
            $("#img_analysis").addClass("active");
            //设备列表页面
            initImgControl();
        }

    };
    /*----------------------------------------入口函数  结束----------------------------------------*/
var filePaths=[];
    /*----------------------------------------业务函数  开始----------------------------------------*/
    /*------------------------------针对各个页面的入口  开始------------------------------*/
    var initImgControl=function(){

        initImageControlEvent();
    }

    /*------------------------------针对各个页面的入口 结束------------------------------*/

    //事件处理初始化--开始
    var initImageControlEvent=function(){
        $("#upload_button").click(function(){onAjaxUploadFile()});
        $("#file_input").change(function(){
            $("#upload_button").prop("disabled", false);
            var files = this.files;
            var imageContainer = $("#image-container");

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();

                reader.onload = (function(file) {
                    return function(e) {
                        var imageUrl = e.target.result;
                        var img = $('<img>').attr('src', imageUrl).css({
                            width: '640px',
                            height: '360px'
                        });
                        imageContainer.append(img);
                    };
                })(file);

                reader.readAsDataURL(file);
                }
        });
        $("#cancel_button").click(function(){
            $("#image-container").html("");
            $("#file_input").val(null);
            $("#upload_button").prop("disabled", true);

        });
        $("#recognize_button").click(function(){getImageRecognition()});
    }

    //事件处理初始化--结束

    var getImageRecognition= function()
    {
        var url = "../../video_data_servlet_action"
        var data = {};
        data.action="get_image_analysis";
        data.file_path_name= filePaths[0];
        $.post(url,data,function(json){

            console.log(JSON.stringify(json));
            if(json.result_code===0)
            {
                console.log(JSON.stringify(json));
                if(json.result_code===0)
                {
                    console.log(JSON.stringify(json));
                    if(json.file_path!==null){
                        var fileUrl = json.file_path;
                        var html="";
                        html+="<img src=\""+fileUrl+"\" width=\"640\" height=\"360\">"
                        $("#result_div").html(html);
                        console.log("[onAjaxUploadFile]fileUrl="+fileUrl);



                        var tableHtml = "";
                        tableHtml+="<th>车辆序号</th>\n" +
                            "<th>车牌号</th>\n" +
                            "<th>识别颜色</th>\n" ;

                        $("#tableHead").html(tableHtml);
                        getImgResDatatable(json.imgData);
                        $("#row_res").hide();
                        $("#row_res").show();

                    }else{
                        alert("[onAjaxUploadFile]没有上传文件结果返回！");
                    }
                }else{
                    alert("[onAjaxUploadFile]没有上传文件结果返回！");
                }
            }
            else
            {
                alert("failed! code="+json.errMsg);
            }
        });
    }

    var getImgResDatatable =function(full){


        table =$('.datatable').DataTable( {

            "paging":true,
            "searching":false,
            "oLanguage": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "sProcessing":   "处理中...",
                "sLengthMenu":   "_MENU_ 记录/页",
                "sZeroRecords":  "没有匹配的记录",
                "sInfo":         "显示第 _START_ 至 _END_ 项记录，共 _TOTAL_ 项",
                "sInfoEmpty":    "显示第 0 至 0 项记录，共 0 项",
                "sInfoFiltered": "(由 _MAX_ 项记录过滤)",
                "sInfoPostFix":  "",
                "sSearch":       "过滤:",
                "oPaginate": {
                    "sFirst":    "首页",
                    "sPrevious": "上页",
                    "sNext":     "下页",
                    "sLast":     "末页"
                }
            },
            "data": full,
            "columns": [
                {
                    "data": "carID",
                    "render": function(data, type, row, meta) {
                        // 在渲染函数中访问完整的行数据
                        return '<div>' + row.carID + '</div>';
                    },"orderable": true
                },
                {
                    "data": "carCode","render": function(data, type, row, meta) {
                        // 在渲染函数中访问完整的行数据
                        return '<div>' + row.carCode + '</div>';
                    },
                    "orderable": true
                },
                {
                    "data": "recordTime",
                    "render": function(data, type, row, meta) {
                        // 在渲染函数中访问完整的行数据
                        return '<div>' + row.color + '</div>';
                    },
                    "orderable": true
                }
            ],
            "aLengthMenu": [[5,10,15,20,25,40,50],[5,10,15,20,25,40,50]],
            "fnDrawCallback": function(){$(".checkboxes").uniform();$(".group-checkable").uniform();},
        });

        $('.datatable').find('.group-checkable').change(function () {
            var set = jQuery(this).attr("data-set");
            var checked = jQuery(this).is(":checked");
            jQuery(set).each(function () {
                if (checked) {
                    $(this).attr("checked", true);
                    $(this).parents('tr').addClass("active");
                } else {
                    $(this).attr("checked", false);
                    $(this).parents('tr').removeClass("active");
                }
            });
            jQuery.uniform.update(set);
        });
        $('.datatable').on('change', 'tbody tr .checkboxes', function () {
            $(this).parents('tr').toggleClass("active");
        });

        var tableWrapper = $('#sample_1_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper

        tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        table.draw();
    }
    var onAjaxUploadFile=function(){
        console.log("[onAjaxUploadFile]====");

        var options = {
            type : 'post', /*设置表单以post方法提交*/
            url : '../../video_data_servlet_action?action=upload_file', /*设置post提交到的页面*/
            success : function(json) {
                console.log("[onAjaxUploadFile]上传文件返回结果="+JSON.stringify(json));
                if(json.upload_files.length>0){
                    for(var i =0;i<json.upload_files.length;i++)
                    {
                        var record = json.upload_files[i];
                        filePaths.push(record.file_url_name);
                    }
                    alert("上传成功!");
                    $("#file_upload_div").hide();
                     $("#hide_button_div").show();
                    console.log(filePaths);
                }else{
                    alert("[onAjaxUploadFile]没有上传文件结果返回！");
                }
            },
            error : function(error) {
                alert(error);
            },
            dataType : "json" /*设置返回值类型为文本*/
        };
        $("#ajax_form").ajaxSubmit(options);
    }

    //Page return 开始
    return {
        init: function() {
            initPageControl();
        }
    }
}();//Page
/*================================================================================*/
