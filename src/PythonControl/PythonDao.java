package PythonControl;
import PythonControl.FileManager;
import monitor.dao.Data;
import monitor.dao.Db;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.Date;

public class PythonDao {

    private String dbName = "yjykfsj8";
    private String selectionPath = "C:\\Users\\15509\\.conda\\envs\\demo\\python.exe";
    private String workingDirectory = System.getProperty("user.dir")+"\\src\\PythonControl";
    /**
     * 生成调试信息
     *
     * @param msg 接收的第一个参数,主要调试信息
     */
    public void showDebug(String msg) {
        System.out.println(
                "[" + (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date()) + "][PythonControl/PythonDao]" + msg);
    }

    public void setPath(String path)
    {
        workingDirectory = path;
    }

    /**
     * 这是一个样板的函数，可以拷贝做修改用
     * 修改数据库数据时调用
     */
    private void operateAttachment(Data data, JSONObject json, String type) throws JSONException {
        /*--------------------获取变量 开始--------------------*/
        JSONObject param = data.getParam();
        int resultCode = 0;
        String resultMsg = "ok";
        String target = workingDirectory + "\\src\\PythonControl\\Data\\"+type+"\\test.mp4";
        /*--------------------获取变量 完毕--------------------*/
        /*--------------------数据操作 开始--------------------*/
        // 构造sql语句，根据传递过来的查询条件参数
        // 首先分析json里有多少文件，多个文件需要用循环构造多个sql语句
        showDebug("[operateAttachment]处理后，文件和字段信息json是：" + json.toString());
        /*--------------------sql语句 开始--------------------*/


        String file_path_name = param.has("file_path_name")
                ? param.getString("file_path_name")
                : null;

        if (file_path_name == null)
        {
            showDebug("[saveUploadFileRecord]保存文件后,没有得到数据" + file_path_name);
        }
        else
        {
            file_path_name = workingDirectory+file_path_name;
            FileManager myFile = new FileManager();
            myFile.copyFile(file_path_name,target);
        }

//        Db updateDb = new Db(dbName);
//        String sql = data.getParam().getString("sql");
//        showDebug("[updateRecord]" + sql);
//        updateDb.executeUpdate(sql);
//        updateDb.close();
        /*--------------------数据操作 结束--------------------*/
        /*--------------------返回数据 开始--------------------*/
        json.put("result_msg", resultMsg); // 如果发生错误就设置成"error"等
        json.put("result_code", resultCode); // 返回0表示正常，不等于0就表示有错误产生，错误代码
        /*--------------------返回数据 结束--------------------*/
    }
    public void getBack(Data data,JSONObject json) {


        try {
            operateAttachment(data,json,"Back");
            String pythonScriptPath = "Back.py";
            // 构建命令
            String[] command = {selectionPath, pythonScriptPath};
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.directory(new File(workingDirectory+"\\src\\PythonControl"));

            // 启动进程
            Process process = pb.start();

            //========此处读取处理数据========

            //========读取完毕========

            // 等待进程执行完成
            int exitCode = process.waitFor();

            System.out.println("进程执行完成，退出码: " + exitCode);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }

    public void getFlow(Data data,JSONObject json) {

        try {
            operateAttachment(data,json,"Flow");
            String pythonScriptPath = "Flow.py";
            // 构建命令
            String[] command = {selectionPath, pythonScriptPath};
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.directory(new File(workingDirectory+"\\src\\PythonControl"));

            // 启动进程
            Process process = pb.start();

            //========此处读取处理数据========

            //========读取完毕========

            // 等待进程执行完成
            int exitCode = process.waitFor();
            System.out.println("进程执行完成，退出码: " + exitCode);

        } catch (IOException | JSONException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void getCarId(Data data,JSONObject json) {

        try {
            operateAttachment(data,json,"CarId");
            String pythonScriptPath = "CarId.py";
            // 构建命令
            String[] command = {selectionPath, pythonScriptPath};
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.directory(new File(workingDirectory+"\\src\\PythonControl"));

            // 启动进程
            Process process = pb.start();

            //========此处读取处理数据========

            //========读取完毕========

            // 等待进程执行完成
            int exitCode = process.waitFor();
            System.out.println("进程执行完成，退出码: " + exitCode);

        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }

    public static void main(String[] arg){

        try {

            String selectionPath = "C:\\Users\\15509\\.conda\\envs\\demo\\python.exe";
            String workingDirectory = System.getProperty("user.dir");
            System.out.println(workingDirectory);
            workingDirectory+="\\src\\PythonControl";
            String pythonScriptPath = "red.py";
            // 构建命令
            String[] command = {selectionPath, pythonScriptPath};
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.directory(new File(workingDirectory));
            // 启动进程
            Process process = pb.start();

            // 等待进程执行完成
            int exitCode = process.waitFor();

            FileManager myFile = new FileManager();

            myFile.copyFile(workingDirectory+"\\Data\\light\\output.mp4",System.getProperty("user.dir")+"\\upload\\red\\1.mp4");

            System.out.println("进程执行完成，退出码: " + exitCode);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
