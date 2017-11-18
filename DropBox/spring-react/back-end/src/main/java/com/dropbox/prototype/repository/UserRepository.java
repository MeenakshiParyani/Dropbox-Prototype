package com.dropbox.prototype.repository;

import com.dropbox.prototype.document.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserRepository extends MongoRepository<User, Integer>{

    public List<User> findByEmailAndPassword(String email, String password);
}
