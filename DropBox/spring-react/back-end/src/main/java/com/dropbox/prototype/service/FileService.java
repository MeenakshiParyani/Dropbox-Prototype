package com.dropbox.prototype.service;

import com.dropbox.prototype.document.User;
import com.dropbox.prototype.document.UserFile;
import com.dropbox.prototype.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
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

            }
            userRepository.save(user);
        }catch (FileNotFoundException e) {
            System.out.println("Failed to upload the file");
            e.printStackTrace();
            return false;
        } catch (IOException e) {
            System.out.println("Failed to upload the file");
            e.printStackTrace();
            return false;
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

    public boolean shareFileOrDir(String userId, UserFile userFile, String sharewithuserid) {
        User user = userRepository.findOne(userId);
        try{
            setFileAsShared(userFile, user);
            shareFileBetweenUsers(userId, sharewithuserid, userFile);
        }catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    private void setFileAsShared(UserFile userFile, User user) {
        // Save the file in db with isShared = True for the owner
        ArrayList<UserFile> files = user.getFiles();
        UserFile sharedFile = new UserFile();
        for (UserFile file : files) {
            if (file.getCurrentPath().equals(userFile.getCurrentPath()) && file.getName().equals(userFile.getName())) {
                file.setShared(true);
                sharedFile = file;
            }
        }
        user.setFiles(files);
        userRepository.save(user);
    }

    private void shareFileBetweenUsers(String fromUserId, String toUserId, UserFile file) throws IOException {
        User toUser = userRepository.findOne(toUserId);
        FileOutputStream fos = null;
        File sourceFile = new File(userFileDir + File.separator + fromUserId + File.separator + file.getCurrentPath() + File.separator + file.getName());
        File destFile = new File(userFileDir + File.separator + toUserId + File.separator + file.getCurrentPath() + File.separator + file.getName());
        org.apache.commons.io.FileUtils.copyFile(sourceFile, destFile);
        file.setShared(true);
        if(toUser.getFiles() != null)
            toUser.getFiles().add(file);
        else{
            ArrayList<UserFile> userFiles = new ArrayList<UserFile>();
            userFiles.add(file);
            toUser.setFiles(userFiles);
        }
        System.out.println("Upload the file successfully at " + destFile.getCanonicalPath());
        userRepository.save(toUser);
    }
}
