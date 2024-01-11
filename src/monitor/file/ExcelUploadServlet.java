package monitor.file;

import monitor.dao.Db;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.fileupload.*;
import org.apache.poi.ss.usermodel.*;

import javax.resource.spi.work.WorkAdapter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@WebServlet("/uploadExcel")
public class ExcelUploadServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        if (!ServletFileUpload.isMultipartContent(request)) {
            throw new ServletException("Content type is not multipart/form-data");
        }
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        DiskFileItemFactory factory = new DiskFileItemFactory();
        ServletFileUpload upload = new ServletFileUpload(factory);
        try {
            List<FileItem> formItems = upload.parseRequest(request);

            if (formItems != null && formItems.size() > 0) {
                // 在循环外初始化数据库连接
                Db updateDb = new Db("yjykfsj8");

                for (FileItem item : formItems) {
                    if (!item.isFormField()) {
                        InputStream fileContent = item.getInputStream();
                        Workbook workbook = WorkbookFactory.create(fileContent);
                        Sheet sheet = workbook.getSheetAt(0);
                        for (Row row : sheet) {
                            if (row.getRowNum() == 0) { // 假设第一行是标题行
                                continue; // 跳过标题行
                            }
                            int type = Integer.parseInt(request.getParameter("type"));
                            String sql="";
                            if(type==0){ //表示微博热榜
                                Object index = getCellValue(row.getCell(1)); // 坐标
                                Object title = getCellValue(row.getCell(2)); // 标题
                                Object hot = getCellValue(row.getCell(3)); // 热度
                                Object url = getCellValue(row.getCell(4)); // 地址
                                sql = "INSERT INTO `yjykfsj8`.`weibohot`(`index`,`title`, `hot`, `url`) VALUES ('" + index + "','" + title + "', '" + hot + "', '" + url + "')";
                            } else if (type==1) { //表示道路
                                Object lane_id = getCellValue(row.getCell(0)); // 道路id
                                Object lane_name = getCellValue(row.getCell(1)); // 道路名称
                                Object speed_limit = getCellValue(row.getCell(2)); // 速度限制
                                Object speed_limit_for_others = getCellValue(row.getCell(3)); // 车速限制
                                Object park_limit_tag = getCellValue(row.getCell(4)); // 是否禁停
                                sql="INSERT INTO `yjykfsj8`.`lane_data`(`lane_id`,`lane_name`, `speed_limit`," +
                                        " `speed_limit_for_others`, `park_limit_tag`) " +
                                        "VALUES ('"+lane_id+"','"+lane_name+"', '"+speed_limit+"', '"+speed_limit_for_others+"', '"+park_limit_tag+"')";
                            }else { //表示车
                                String create_time = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date());
                                Object code = getCellValue(row.getCell(1)); // 车牌
                                Object vehicle_type = getCellValue(row.getCell(2)); // 车型
                                String createTime = create_time; //创建时间
                                Object captureTime=getCellValue(row.getCell(3)); //抓拍时间
                                Object  illegalStatus=getCellValue(row.getCell(4));//违法状态
                                Object  speed=getCellValue(row.getCell(5));//抓拍速度
                                sql="INSERT INTO `yjykfsj8`.`monitoring_data`(`car_code`, `vehicle_type`," +
                                        " `capture_time`, `illegal_status`, `speed`, `create_time`) " +
                                        "VALUES ('"+code+"', '"+vehicle_type+"', '"+captureTime+"', '"+illegalStatus+"', '"+speed+"', '"+createTime+"')";
                            }
                            // 执行SQL语句
                            updateDb.executeUpdate(sql);
                        }
                        // 关闭数据库连接
                        updateDb.close();
                        out.println(0);
                    }
                }
            }
        } catch (Exception ex) {
            out.println(1);
        }

    }


    private Object getCellValue(Cell cell) {
        CellType cellType = cell.getCellType();
        switch (cellType) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return cell.getNumericCellValue();
            case BOOLEAN:
                return cell.getBooleanCellValue();
            case FORMULA:
                // 处理公式
                return evaluateCellFormula(cell);
            default:
                return null;
        }
    }

    private Object evaluateCellFormula(Cell cell) {
        FormulaEvaluator evaluator = cell.getSheet().getWorkbook().getCreationHelper().createFormulaEvaluator();
        CellValue cellValue = evaluator.evaluate(cell);
        switch (cellValue.getCellType()) {
            case STRING:
                return cellValue.getStringValue();
            case NUMERIC:
                return cellValue.getNumberValue();
            case BOOLEAN:
                return cellValue.getBooleanValue();
            default:
                return null;
        }
    }
}
