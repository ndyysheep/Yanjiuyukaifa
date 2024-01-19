package PythonControl;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Path;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;


public class FileManager {


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
        System.out.println("文件复制完成");

    }
}


