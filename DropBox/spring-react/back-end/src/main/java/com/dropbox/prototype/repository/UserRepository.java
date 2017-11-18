package com.dropbox.prototype.repository;

import com.dropbox.prototype.document.User;
import com.dropbox.prototype.document.UserFile;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;


import java.util.List;

public interface UserRepository extends MongoRepository<User, String>{

    public List<User> findByEmailAndPassword(String email, String password);

}
