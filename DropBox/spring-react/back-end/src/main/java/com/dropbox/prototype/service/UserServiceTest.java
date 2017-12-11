//package com.dropbox.prototype.service;
//
//import com.dropbox.prototype.document.User;
//import com.dropbox.prototype.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.data.mongodb.core.mapping.TextScore;
//import org.springframework.stereotype.Controller;
//import org.springframework.stereotype.Service;
//import org.springframework.test.context.junit4.SpringRunner;
//
//import java.util.ArrayList;
//import java.util.List;
//
//public class UserServiceTest {
//
//    @Autowired
//    private UserService userService;
//
//    User sampleUser = null;
//
//    @Before
//    public void prepareUser(){
//        sampleUser = new User(null, "Paul", "Nyguen", "paul.nuyguen@sjsu.edu", "password");
//    }
//
//    @Test
//    public void testUserSignup(){
//        User returnedUser = userService.signupUser(sampleUser);
//        Assert.assertNotNull(returnedUser);
//    }
//
////    @Test
////    public void testUserLogin(){
////       User resturnedUser = userServiceloginUser
////        User signedUpUser = null;
////        List<User> users = userRepository.findByEmailAndPassword(sampleUser.getEmail(), sampleUser.getPassword());
////        if(users != null && users.size() >0){
////            signedUpUser = users.get(0);
////        }
////        Assert.assertNotNull(signedUpUser);
////    }
//
//
//}
