package com.dropbox.prototype.service;

import com.dropbox.prototype.document.User;
import com.dropbox.prototype.document.UserFile;
import com.dropbox.prototype.repository.UserRepository;

import net.lingala.zip4j.core.ZipFile;
import net.lingala.zip4j.exception.ZipException;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.lang.reflect.Array;
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
        User user = userRepository.findOne(userId);
        List<UserFile> files = user.getFiles().stream().filter( file -> file.getCurrentPath().equals(currentPath)).collect(Collectors.toList());
        return files;
    }

    public File getUserFile(String userId, String filePath, String fileName, boolean isDir){
        String fileOrDir = userFileDir + File.separator + userId + File.separator + filePath + File.separator + fileName;
        if(!isDir){
            File file = new File(fileOrDir);
            return file;
        }else{
            ZipFile zip = null;
            try{
                // Zip the directory and send it
                zip = new ZipFile("./tmp"+ File.separator + fileName+ ".zip");
                zip.addFolder(fileOrDir, null);
                System.out.println("Created the zip file");
            }catch(ZipException e){
                e.printStackTrace();
            }
            return zip.getFile();
        }



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
                    file.setStared(!file.getStared());
            });
            user.setFiles(files);
            userRepository.save(user);
            return true;
        }catch(Exception e){
            e.printStackTrace();
            return false;
        }
    }

    public boolean shareFileOrDirWithUsers(String userId, UserFile userFile, ArrayList<String> sharewithuserids) {
        User user = userRepository.findOne(userId);
        for(String sharewithuserid : sharewithuserids) {
            try {
                User shareWithUser = userRepository.findOne(sharewithuserid);
                setFileAsSharedWithUser(userFile, user, shareWithUser);
                shareFileBetweenUsers(userId, sharewithuserid, userFile);
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        }
        return true;
    }

    private UserFile getUpdatedUserFile(String userId, UserFile file){
        User user = userRepository.findOne(userId);
        ArrayList<UserFile> files = user.getFiles();
        for(UserFile userFile : files){
            if(userFile.getName().equals(file.getName()) && userFile.getCurrentPath().equals(file.getCurrentPath()))
                return userFile;
        }
        return file;
    }



    private void setFileAsSharedWithUser(UserFile userFile, User user, User shareWithUser) {
        // Save the file in db with isShared = True for the owner
        ArrayList<UserFile> files = user.getFiles();
        for (UserFile file : files) {
            if (file.getCurrentPath().equals(userFile.getCurrentPath()) && file.getName().equals(userFile.getName())) {
                file.setShared(true);
                ArrayList<User> sharedWithUsers = file.getSharedWithUsers();
                if (sharedWithUsers == null) {
                    sharedWithUsers = new ArrayList<>();
                    shareWithUser.setFiles(null);
                    sharedWithUsers.add(shareWithUser);
                } else {
                    sharedWithUsers.add(shareWithUser);
                }
                file.setSharedWithUsers(sharedWithUsers);
            }
        }
        user.setFiles(files);
        userRepository.save(user);
    }

    private void shareFileBetweenUsers(String fromUserId, String toUserId, UserFile file) throws IOException {
        User toUser = userRepository.findOne(toUserId);
        file.setStared(false);
        FileOutputStream fos = null;
        File sourceFile = new File(userFileDir + File.separator + fromUserId + File.separator + file.getCurrentPath() + File.separator + file.getName());
        File destFile = new File(userFileDir + File.separator + toUserId + File.separator + file.getCurrentPath() + File.separator + file.getName());
        if(file.isDir())
            FileUtils.copyDirectory(sourceFile, destFile);
        else
            org.apache.commons.io.FileUtils.copyFile(sourceFile, destFile);
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

    public boolean deleteDir(String userId, String dirPath, String dirName) {

        User user = userRepository.findOne(userId);
        try{
            String dirRelativePath = ((dirPath.equals("/")) ? "" : dirPath ) + File.separator + dirName;
            String deletedirPath = userFileDir + File.separator + userId + File.separator + dirPath + File.separator + dirName;
            File fileOrDir = new File(deletedirPath);
            if(fileOrDir.exists()){
                if (fileOrDir.isDirectory()) {
                    FileUtils.deleteDirectory(fileOrDir);
                    System.out.println("Directory is Deleted at " + fileOrDir.getAbsolutePath());
                    ArrayList<UserFile> childFiles = new ArrayList<UserFile>();
                    if (user.getFiles() != null){
                        for(UserFile file : user.getFiles()){
                            if(file.getCurrentPath().contains(dirRelativePath)){
                                childFiles.add(file);
                            }
                        }
                    }
                    user.getFiles().removeAll(childFiles);
                }else{
                    fileOrDir.delete();
                    System.out.println("File is Deleted at " + fileOrDir.getAbsolutePath());
                }
            }

            user.getFiles().remove(user.getFileByPathAndName(dirPath, dirName));
            userRepository.save(user);
            return true;
        }catch(IOException e){
            e.printStackTrace();
            return false;
        }catch(Exception e){
            e.printStackTrace();
            return false;
        }

    }
}
