package com.dropbox.prototype.service;

import com.dropbox.prototype.document.User;
import com.dropbox.prototype.document.UserActivity;
import com.dropbox.prototype.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    @Autowired
    private UserRepository userRepository;

    public User signupUser(User user){
        user.setFullname();
        System.out.println("Sign Up Completed for User " + user.getFullname());
        return userRepository.save(user);
    }

    public User loginUser(User user){
        List<User> users = userRepository.findByEmailAndPassword(user.getEmail(), user.getPassword());
        if(users != null && users.size() >0){
            System.out.println("User " + users.get(0).getFullname() + " Signed In !");
            return users.get(0);
        }
        return null;
    }

    public List<UserActivity> getActivities(String userId) {
        User user = userRepository.findOne(userId);
        System.out.println("Getting Activities for User " + user.getFullname());
        return user.getActivities();
    }
}
