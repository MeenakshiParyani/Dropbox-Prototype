package com.dropbox.prototype.resource;

import com.dropbox.prototype.document.User;
import com.dropbox.prototype.repository.UserRepository;
import com.dropbox.prototype.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/user")
public class UserResource {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/signup", headers = "Accept=application/json", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> signup(@RequestBody User user){
        return new ResponseEntity(userService.signupUser(user), HttpStatus.OK);
    }

    @GetMapping("/listAll")
    public ResponseEntity<?> getAll(){
        return new ResponseEntity(userService.getAllUsers(), HttpStatus.OK);
    }

    @RequestMapping(value = "/login", headers = "Accept=application/json", method = RequestMethod.POST, produces = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> login(@RequestBody User user, HttpSession session){
        User dbUser = userService.loginUser(user);
        if(dbUser != null) {
            session.setAttribute("userId", dbUser.getId());
            return new ResponseEntity(dbUser, HttpStatus.OK);
        }
        else
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
    }
}
