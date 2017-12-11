package com.dropbox.prototype.resource;

import com.dropbox.prototype.document.User;
import com.dropbox.prototype.repository.UserRepository;
import com.dropbox.prototype.service.UserService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    @GetMapping("/listAllExceptSelf")
    public ResponseEntity<?> getAllExceptSelf(HttpSession session){
        String userId = session.getAttribute("userId") != null ? session.getAttribute("userId").toString() : null;
        List<User> users  = userService.getAllUsers().stream().filter(user -> !user.getId().equals(userId)).collect(Collectors.toList());
        return new ResponseEntity(users, HttpStatus.OK);
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

    @RequestMapping(value = "/isLoggedIn", method = RequestMethod.GET)
    public ResponseEntity<?> isLoggedIn(HttpSession session){
        String userId = session.getAttribute("userId") != null ? session.getAttribute("userId").toString() : null;
        if(userId == null)
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        else{
            User user = new User();
            user.setId(userId);
            return new ResponseEntity(user, HttpStatus.OK);
        }
    }

    @RequestMapping(value = "/logout", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> logout(HttpSession session){
        System.out.println("Invalidating user " + session.getAttribute("userId"));
        session.invalidate();
        return new ResponseEntity(HttpStatus.OK);
    }

}
