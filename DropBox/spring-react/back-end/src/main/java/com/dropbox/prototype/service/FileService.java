package com.dropbox.prototype.service;

import com.dropbox.prototype.document.User;
import com.dropbox.prototype.document.UserFile;
import com.dropbox.prototype.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FileService {

    public static String mainFolder = "." + File.separator + "user_files";

    @Autowired
    private UserRepository userRepository;
    private static String userFileDir = "./user_files";

    public List<UserFile> getUserFiles(String userId, String currentPath){
        List<User> user = userRepository.findByIdAndFilesCurrentPath(userId, currentPath);
        List<UserFile> files = user.get(0).getFiles().stream().filter( file -> file.getCurrentPath().equals(currentPath)).collect(Collectors.toList());
        return files;
    }

    public File getUserFile(String userId, String filePath){
        String directory = userFileDir + File.separator + userId + File.separator + filePath;
        File file = new File(directory);
        return file;
    }

    public boolean uploadFiles(MultipartFile[] files, String userId, String path) {
        try{
            User user = userRepository.findOne(userId);
            for (MultipartFile file : files) {
                FileOutputStream fos = null;
                String fileName = file.getOriginalFilename();
                File convFile = new File(userFileDir + File.separator + userId + File.separator + path + File.separator + fileName);
                try {
                    convFile.createNewFile();
                    fos = new FileOutputStream(convFile);
                    fos.write(file.getBytes());
                    fos.close();
                    if(user.getFiles() != null)
                        user.getFiles().add(new UserFile(fileName, false, false, null, null, path ,false));
                    else{
                        ArrayList<UserFile> userfiles = new ArrayList<UserFile>();
                        userfiles.add(new UserFile(fileName, false, false, null, null, path ,false));
                        user.setFiles(userfiles);
                    }
                    System.out.println("Upload the file successfully at " + convFile.getCanonicalPath());
                } catch (FileNotFoundException e) {
                    System.out.println("Failed to upload the file");
                    e.printStackTrace();
                    return false;
                } catch (IOException e) {
                    System.out.println("Failed to upload the file");
                    e.printStackTrace();
                    return false;
                }
            }
            userRepository.save(user);
        }catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public boolean createDir(String userId, String dirPath, String dirName) {

        User user = userRepository.findOne(userId);
        try{
            String createdirPath = userFileDir + File.separator + userId + File.separator + dirPath + File.separator + dirName;
            File dir = new File(createdirPath);
            if (!dir.exists()) {
                if (dir.mkdirs()) {
                    System.out.println("Directory is created!");
                    if(user.getFiles() != null)
                        user.getFiles().add(new UserFile(dirName, true, false, null, null, dirPath ,false));
                    else{
                        ArrayList<UserFile> files = new ArrayList<UserFile>();
                        files.add(new UserFile(dirName, true, false, null, null, dirPath ,false));
                        user.setFiles(files);
                    }
                    userRepository.save(user);
                    return true;
                } else {
                    System.out.println("Failed to create directory!");
                    return false;
                }
            }else{
                return true;
            }

        }catch(Exception e){
            e.printStackTrace();
            return false;
        }

    }

    public boolean starFileOrDir(String userId, UserFile userFile) {
        User user = userRepository.findOne(userId);
        try{
            ArrayList<UserFile> files = user.getFiles();
            files.forEach(file -> {
                if(file.getCurrentPath().equals(userFile.getCurrentPath()) && file.getName().equals(userFile.getName()))
                    file.setStared(true);
            });
            user.setFiles(files);
            userRepository.save(user);
            return true;
        }catch(Exception e){
            e.printStackTrace();
            return false;
        }
    }
}
