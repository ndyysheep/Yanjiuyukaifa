package PythonControl;
import monitor.dao.Data;
import monitor.dao.Db;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;


public class FileManager {

    String dbName = "yjykfsj8";

    /**
     * 生成调试信息
     * @param msg 接收的第一个参数,主要调试信息
     */
    public void showDebug(String msg) {
        System.out.println(
                "[" + (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date()) + "][FileManager]" + msg);
    }

    /**
     * 这是一个样板的函数，可以拷贝做修改用
     * 修改数据库数据时调用
     */
    private void updateRecord(Data data, JSONObject json) throws JSONException {
        /*--------------------获取变量 开始--------------------*/
        JSONObject param = data.getParam();
        int resultCode = 0;
        String resultMsg = "ok";
        /*--------------------获取变量 完毕--------------------*/
        /*--------------------数据操作 开始--------------------*/
        Db updateDb = new Db(dbName);
        String sql = data.getParam().getString("sql");
        showDebug("[updateRecord]" + sql);
        updateDb.executeUpdate(sql);
        updateDb.close();
        /*--------------------数据操作 结束--------------------*/
        /*--------------------返回数据 开始--------------------*/
        json.put("result_msg", resultMsg); // 如果发生错误就设置成"error"等
        json.put("result_code", resultCode); // 返回0表示正常，不等于0就表示有错误产生，错误代码
        /*--------------------返回数据 结束--------------------*/
    }



    public void copyFile(String source,String target)
    {
        Path sourcePath = Paths.get(source);
        Path targetPath = Paths.get(target);


        // 执行文件复制
        try {
            Files.copy(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
        showDebug("文件复制完成,文件地址:"+target);

    }

    public void getResult(String filePath)
    {

        try {
            // 读取文件内容
            Path path = Paths.get(filePath);
            List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);

            // 处理文件内容
            for (String line : lines) {
                // 在这里处理每行的内容
                System.out.println(line);
            }
        } catch (IOException e) {
            // 处理读取文件时的异常
            e.printStackTrace();
        }
    }

    public String getFlowResult(String filePath)
    {
        int totalNum = -1;
        String beginDatetime = null;
        String endDatetime = null;
        String sql = null;

        try {
            // 读取文件内容
            Path path = Paths.get(filePath);
            List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);

            // 处理文件内容
            for (String line : lines) {

                if(line.contains("总计车流量为："))
                {
                    int index= line.lastIndexOf('：');
                    totalNum=Integer.parseInt(line.substring(index+1));
                }
                else if(line.contains("视频起始时间:"))
                {
                    int index= line.lastIndexOf(": ");
                    beginDatetime=line.substring(index+2);
                }
                else if(line.contains("视频结束时间:"))
                {
                    int index= line.lastIndexOf(": ");
                    endDatetime=line.substring(index+2);
                }

                // 在这里处理每行的内容

            }

            sql = "insert into count_of_lane"+ "(start_time,lane_id,end_time,total_num)";
            sql = sql + " select '" + beginDatetime + "'" + " ,1"
                    + " ,'" + endDatetime + "','" + totalNum + "'";

        } catch (IOException e) {
            // 处理读取文件时的异常
            e.printStackTrace();
        }
        showDebug(sql);
        return sql;
    }

    public void getCarIdResult(String filePath)
    {
        String ID = null;
        String carCode = null;
        String recordTime = null;
        String sql = null;

        try {
            // 读取文件内容
            Path path = Paths.get(filePath);
            List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);

            // 处理文件内容
            for (String line : lines) {

                String str = "车辆ID: ";
                int index= line.lastIndexOf("车辆ID: ")+str.length();
                int endIndex = line.lastIndexOf(", 车牌号");
                ID=line.substring(index,endIndex);

                str = "车牌号: ";
                index = line.lastIndexOf(str)+str.length();
                endIndex = line.lastIndexOf(',');
                carCode = line.substring(index,endIndex);

                str ="记录时间";
                index = line.lastIndexOf(str)+str.length();
                recordTime = line.substring(index);
                // 在这里处理每行的内容

            }

            sql=ID+","+carCode+","+recordTime;


        } catch (IOException e) {
            // 处理读取文件时的异常
            e.printStackTrace();
        }
        showDebug(sql);

    }

    public void getDoubleLineResult(String filePath)
    {
        int locationX = -1;
        int locationY = -1;
        String carCode = null;
        String recordTime = null;
        String sql = null;

        try {
            // 读取文件内容
            Path path = Paths.get(filePath);
            List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);

            // 处理文件内容
            for (String line : lines) {

                String str = "压线时间：";
                int index= line.lastIndexOf(str)+str.length();
                int endIndex = line.lastIndexOf("压线位置：(");
                recordTime=line.substring(index,endIndex);

                str = "压线位置：(";
                index = line.lastIndexOf(str)+str.length();
                endIndex = line.lastIndexOf(", ");
                locationX = Integer.parseInt(line.substring(index,endIndex));

                str =", ";
                index = line.lastIndexOf(str)+str.length();
                endIndex = line.lastIndexOf(')');
                locationY = Integer.parseInt(line.substring(index,endIndex));
                // 在这里处理每行的内容

            }

            sql=recordTime+","+locationX+","+locationY;


        } catch (IOException e) {
            // 处理读取文件时的异常
            e.printStackTrace();
        }
        showDebug(sql);

    }

    public void getRedLightResult(String filePath)
    {
        int locationX = -1;
        int locationY = -1;
        String ID = null;
        String recordTime = null;
        String sql = null;

        try {
            // 读取文件内容
            Path path = Paths.get(filePath);
            List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);

            // 处理文件内容
            for (String line : lines) {

                String str = "车辆ID:";
                int index= line.lastIndexOf(str)+str.length();
                int endIndex = line.lastIndexOf(" 闯红灯位置");
                ID=line.substring(index,endIndex);

                str = "闯红灯位置:(X:";
                index = line.lastIndexOf(str)+str.length();
                endIndex = line.lastIndexOf(", Y:");
                locationX = Integer.parseInt(line.substring(index,endIndex));

                str =", Y:";
                index = line.lastIndexOf(str)+str.length();
                endIndex = line.lastIndexOf(')');
                locationY = Integer.parseInt(line.substring(index,endIndex));
                // 在这里处理每行的内容

                str = "闯红灯时间:";
                index= line.lastIndexOf(str)+str.length();
                recordTime=line.substring(index);
            }

            sql=recordTime+","+locationX+","+locationY+","+ID;


        } catch (IOException e) {
            // 处理读取文件时的异常
            e.printStackTrace();
        }
        showDebug(sql);

    }


    public void saveUploadFileRecord(JSONObject json, Data data) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的查询条件参数
        // 首先分析json里有多少文件，多个文件需要用循环构造多个sql语句
        showDebug("[saveUploadFileRecord]保存文件后，文件和字段信息json是：" + json.toString());
        /*--------------------sql语句 开始--------------------*/

        Data videoData = new Data();
        videoData.setParam(json);

        // 构造sql语句，根据传递过来的条件参数

        JSONArray jsonFileList = videoData.getParam().getJSONArray("upload_files");

        String file_path_name = jsonFileList.getJSONObject(0).has("file_path_name")
                ? jsonFileList.getJSONObject(0).get("file_path_name").toString()
                : null;

        String visual_path_name = jsonFileList.getJSONObject(0).has("file_url_name")
                ? jsonFileList.getJSONObject(0).get("file_url_name").toString()
                : null;

        String upload_time = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date());

        if (file_path_name != null)
        {
            String sql = "insert into " + "video_info" + "(upload_time,video_attachment,video_url)";

            sql = sql + " values('" + upload_time + "','" + file_path_name + "','" + visual_path_name + "')";
            data.getParam().put("sql", sql);
            updateRecord(data, json);

            showDebug("[saveUploadFileRecord]保存文件后，构造的sql是：" + sql);
        }
        else
        {
            showDebug("[saveUploadFileRecord]保存文件后,没有得到数据" + file_path_name);
        }

    }
}


