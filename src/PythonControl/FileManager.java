package PythonControl;
import monitor.dao.Data;
import monitor.dao.Db;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
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

    public void getBackResult(String filePath,JSONObject json)
    {
        String locations = null;
        String recordTime = null;
        String sql = null;
        List locationCoordinate = new ArrayList();


        List list = new ArrayList();
        try {
            // 读取文件内容
            Path path = Paths.get(filePath);
            List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);

            // 处理文件内容
            for (String line : lines) {

                String str = "[";
                int index= line.lastIndexOf(str)+str.length();
                int endIndex = line.lastIndexOf(']');
                locations=line.substring(index,endIndex);

                int beginIndex = 0;
                for(int i =0;i<locations.length()&&locationCoordinate.size()<4;i++)
                {
                    if(locations.charAt(i)==' ')
                    {
                        locationCoordinate.add(Integer.parseInt(locations.substring(beginIndex,i-1)));
                        beginIndex = i+1;
                    }

                    if(locationCoordinate.size() ==3)
                    {
                        locationCoordinate.add(Integer.parseInt(locations.substring(beginIndex)));
                    }
                }


                str ="逆行时间: ";
                index = line.lastIndexOf(str)+str.length();
                recordTime = line.substring(index);
                // 在这里处理每行的内容

                HashMap map = new HashMap();
                map.put("locationArrays",locationCoordinate);
                map.put("recordTime",recordTime);
                list.add(map);


            }
            json.put("backData",list);
            showDebug(json.toString());
        } catch (IOException | JSONException e) {
            // 处理读取文件时的异常
            e.printStackTrace();
        }
    }

    public String getFlowResult(String filePath,JSONObject json)
    {
        int totalNum = -1;
        String beginDatetime = null;
        String endDatetime = null;
        List list = new ArrayList();
        String sql = null;

        try {
            // 读取文件内容
            Path path = Paths.get(filePath);
            List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);
            HashMap map = new HashMap();
            // 处理文件内容
            for (String line : lines) {

                if(line.contains("总计车流量为："))
                {
                    int index= line.lastIndexOf('：');
                    totalNum=Integer.parseInt(line.substring(index+1));

                    map.put("totalNum",totalNum);

                }
                else if(line.contains("视频起始时间:"))
                {
                    int index= line.lastIndexOf(": ");
                    beginDatetime=line.substring(index+2);
                    map.put("beginDatetime", beginDatetime);
                }
                else if(line.contains("视频结束时间:"))
                {
                    int index= line.lastIndexOf(": ");
                    endDatetime=line.substring(index+2);
                    map.put("endDatetime",endDatetime);

                }

                // 在这里处理每行的内容

            }
            list.add(map);
            json.put("flowData",list);

            sql = "insert into count_of_lane"+ "(start_time,lane_id,end_time,total_num)";
            sql = sql + " select '" + beginDatetime + "'" + " ,1"
                    + " ,'" + endDatetime + "','" + totalNum + "'";

        } catch (IOException e) {
            // 处理读取文件时的异常
            e.printStackTrace();
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        showDebug(list.toString());
        return sql;
    }

    public void getCarIdResult(String filePath,JSONObject json)
    {
        String ID = null;
        String carCode = null;
        String recordTime = null;
        String sql = null;
        List list = new ArrayList();
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

               HashMap map = new HashMap();
               map.put("carID",ID);
               map.put("carCode",carCode);
               map.put("recordTime",recordTime);
               list.add(map);


            }
            json.put("carIDData",list);
            sql=ID+","+carCode+","+recordTime;


        } catch (IOException e) {
            // 处理读取文件时的异常
            e.printStackTrace();
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        showDebug(list.toString());

    }

    //
    public void getDoubleLineResult(String filePath,JSONObject json)
    {
        int locationX = -1;
        int locationY = -1;
        String recordTime = null;
        String sql = null;
        List list = new ArrayList();
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

                HashMap map = new HashMap();
                map.put("locationX",locationX);
                map.put("locationY",locationY);
                map.put("recordTime",recordTime);
                list.add(map);

            }
            json.put("doubleLineData",list);

            sql=recordTime+","+locationX+","+locationY;


        } catch (IOException e) {
            // 处理读取文件时的异常
            e.printStackTrace();
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        showDebug(list.toString());

    }

    public void getRedLightResult(String filePath,JSONObject json)
    {
        List list = new ArrayList();
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

                HashMap map = new HashMap();
                map.put("ID",ID);
                map.put("locationX",locationX);
                map.put("locationY",locationY);
                map.put("recordTime",recordTime);
                list.add(map);
            }

            json.put("redLineData",list);

            sql=recordTime+","+locationX+","+locationY+","+ID;


        } catch (IOException e) {
            // 处理读取文件时的异常
            e.printStackTrace();
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        showDebug(list.toString());

    }

    public void getImgCarIdResult(String filePath,JSONObject json)
    {
        String ID = null;
        String carCode = null;
        String color = null;
        String sql = null;
        List list = new ArrayList();
        try {
            // 读取文件内容
            Path path = Paths.get(filePath);
            List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);

            // 处理文件内容
            for (String line : lines) {

                String str = "ID:";
                int index= line.lastIndexOf(str)+str.length();
                int endIndex = line.lastIndexOf(" 车牌号");
                ID=line.substring(index,endIndex);

                str = "车牌号：";
                index = line.lastIndexOf(str)+str.length();
                endIndex = line.lastIndexOf(" 车牌颜色");
                carCode = line.substring(index,endIndex);

                str ="车牌颜色：";
                index = line.lastIndexOf(str)+str.length();
                color = line.substring(index);
                // 在这里处理每行的内容

                HashMap map = new HashMap();
                map.put("carID",ID);
                map.put("carCode",carCode);
                map.put("color",color);
                list.add(map);


            }
            json.put("imgData",list);


        } catch (IOException e) {
            // 处理读取文件时的异常
            e.printStackTrace();
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        showDebug(list.toString());

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


