package jp.go.ndl.lab.common.utils;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import org.apache.commons.io.IOUtils;

public class CreateZip {

    public static void createZip(File zip, File[] files) throws IOException {
        try (ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zip))) {
            for (File file : files) {
                ZipEntry entry = new ZipEntry(file.getName());
                zos.putNextEntry(entry);
                try (BufferedInputStream fis = new BufferedInputStream(new FileInputStream(file))) {
                    IOUtils.copy(fis, zos, 1000);
                }
            }
        }
    }
}
