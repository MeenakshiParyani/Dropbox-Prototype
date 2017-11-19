package com.dropbox.prototype.repository;

import com.dropbox.prototype.document.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;


import java.util.List;

public interface UserRepository extends MongoRepository<User, String>{

    public List<User> findByEmailAndPassword(String email, String password);

    @Query(value = "{ 'id' : ?0, 'files.currentPath' : ?1 }")
    List<User> findByIdAndFilesCurrentPath(String id, String currentPath);

}
