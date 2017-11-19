package com.dropbox.prototype.service;

import com.dropbox.prototype.document.User;
import com.dropbox.prototype.document.UserFile;
import com.dropbox.prototype.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.math.BigInteger;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FileService {

    public static String mainFolder = "." + File.separator + "user_files";

    @Autowired
    private UserRepository userRepository;

    public List<UserFile> getUserFiles(String userId, String currentPath){
        List<User> user = userRepository.findByIdAndFilesCurrentPath(userId, currentPath);
        List<UserFile> files = user.get(0).getFiles().stream().filter( file -> file.getCurrentPath().equals(currentPath)).collect(Collectors.toList());
        return files;
    }
}
