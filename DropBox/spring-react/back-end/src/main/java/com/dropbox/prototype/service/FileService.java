package com.dropbox.prototype.service;

import com.dropbox.prototype.document.User;
import com.dropbox.prototype.document.UserFile;
import com.dropbox.prototype.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.List;

@Service
public class FileService {

    @Autowired
    private UserRepository userRepository;

    public List<UserFile> getUserFiles(String userId){
        User user = userRepository.findOne(userId);
        return user.getFiles();
    }
}
