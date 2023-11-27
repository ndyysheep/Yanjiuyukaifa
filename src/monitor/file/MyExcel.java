package monitor.file;

import monitor.dao.Data;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;

public class MyExcel {

    public MyExcel() {

    }
    public void exportData(Data data, JSONObject json) throws JSONException, IOException
    {
        //创建excel对象
        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet("sheet0");
        //创建json数组对象
        JSONArray titleArray = json.getJSONArray("aaColumn");

        HSSFRow rowTitle = sheet.createRow(0);
        HashMap<String,Integer> map = new HashMap();

        for(int i =0;i<titleArray.length();i++)
        {
            HSSFCell cell = rowTitle.createCell(i);
            cell.setCellValue(titleArray.getString(i));
            System.out.println("表头字段"+titleArray.getString(i));
            map.put(titleArray.getString(i),i);
        }

        JSONArray array = json.getJSONArray("aaData");

        for(int i =1;i<array.length()+1;i++)
        {
            HSSFRow row = sheet.createRow(i);

            HashMap<String,String> record = (HashMap<String,String>)array.get(i-1);
            for(HashMap.Entry<String,String> entry:record.entrySet())
            {
                int line=map.get(entry.getKey());
                String value=entry.getValue()+'\0';

                if(i==1&&!value.isEmpty())
                {
                    int width = value.length();

                    if(sheet.getColumnWidth(line)<width*256)
                    {
                        sheet.setColumnWidth(line,width*256);
                    }

                }

                HSSFCell cell = row.createCell(line);
                cell.setCellValue(entry.getValue());
                System.out.println("Value1="+cell.getStringCellValue());

            }
        }

        /*
        *输出excel文件
        */
        System.out.println("路径是:"+"D:"+json.getString("file_path"));
        FileOutputStream output = new FileOutputStream("D:"+json.getString("file_path"));
        wb.write(output);
        output.flush();
        output.close();

    }
}
