package servletControl;

import DBControl.DB;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
public class UploadControl extends HttpServlet  {

    private String file ="servletControl/UploadControl";
    public void service(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        request.setCharacterEncoding("utf-8");
        HttpSession session = request.getSession(true);
        String uid = session.getAttribute("uid").toString();
        String path = "F:/Amusement/Capture/pictures/avatar/"; // 我的upload的实际路径是F:/Amusement/Capture/pictures，故我的path是实际路径加上一个avatar文件夹
        String fileName = uid + ".jpg";
        try {
            File file1 = new File(path);
            if(!file1.exists())
            {
                file1.mkdir();
            }
            // 获取上传的文件
            Part filePart = request.getPart("avatar");
            InputStream fileContent = filePart.getInputStream();
            byte[] buffer = new byte[fileContent.available()];
            fileContent.read(buffer);


            DB db = new DB("101.35.232.25:3306","tmxq","123456","yjykfsj8");
            db.Connect();
            JSONObject params = new JSONObject();
            params.put("avatar","/upload/avatar/" + fileName);
            session.setAttribute("avatar","/upload/avatar/" + fileName);
            params.put("username",session.getAttribute("user_name"));
            db.UpdatetoDB(params,request.getSession());
            db.Close();
            // 保存文件到本地
            FileOutputStream outputStream = new FileOutputStream(path + fileName);
            outputStream.write(buffer);
            outputStream.close();
            showDebug("service",path + fileName);
            response.sendRedirect("/main/userManage/extra_profile_account.jsp");
        }catch (Exception e)
        {
            e.printStackTrace();
        }
    }
    public void showDebug(String method,String message) {
        System.out.println("["+(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date())+"]["+file+"/"+method+"]"+message);
    }

}
