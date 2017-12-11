package com.dropbox.prototype.resource;

import com.dropbox.prototype.document.User;
import com.dropbox.prototype.document.UserGroup;
import com.dropbox.prototype.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Map;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "http://localhost:3000")
public class GroupResource {

    @Autowired
    private GroupService groupService;

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public ResponseEntity<?> createGroup(HttpSession session, @RequestBody UserGroup userGroup) {
        String userId = session.getAttribute("userId") != null ? session.getAttribute("userId").toString() : null;
        if ( userId == null)
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        else {
            boolean groupCreated = groupService.createGroup(userGroup, userId);
            if(groupCreated){
                ArrayList<UserGroup> groups = groupService.getUserGroups(userId);
                return new ResponseEntity<Object>(groups, HttpStatus.CREATED);
            }
            else
                return new ResponseEntity<Object>(HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/addMembers", method = RequestMethod.PUT)
    public ResponseEntity<?> addMembers(HttpSession session, @RequestBody Map<String, Object> payload) {
        String userId = session.getAttribute("userId") != null ? session.getAttribute("userId").toString() : null;
        if ( userId == null)
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        else {
            boolean membersAdded = groupService.addGroupMembers(payload.get("groupName").toString(), userId, (ArrayList<String>) payload.get("userIds"));
            if(membersAdded)
                return new ResponseEntity<Object>(HttpStatus.OK);
            else
                return new ResponseEntity<Object>(HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public ResponseEntity<?> deleteGroup(HttpSession session, @RequestBody Map<String, Object> payload) {
        String userId = session.getAttribute("userId") != null ? session.getAttribute("userId").toString() : null;
        if ( userId == null)
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        else {
            boolean groupDeleted = groupService.deleteGroup(userId, payload.get("name").toString());
            if(groupDeleted)
                return new ResponseEntity<Object>(HttpStatus.OK);
            else
                return new ResponseEntity<Object>(HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/deleteMembers", method = RequestMethod.PUT)
    public ResponseEntity<?> deleteMembers(HttpSession session, @RequestBody Map<String, Object> payload) {
        String userId = session.getAttribute("userId") != null ? session.getAttribute("userId").toString() : null;
        if ( userId == null)
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        else {
            boolean membersDeleted = groupService.deleteGroupMembers(payload.get("groupName").toString(), userId, (ArrayList<String>) payload.get("userIds"));
            if(membersDeleted)
                return new ResponseEntity<Object>(HttpStatus.OK);
            else
                return new ResponseEntity<Object>(HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/getMembers", method = RequestMethod.PUT)
    public ResponseEntity<?> getMembers(HttpSession session, @RequestBody Map<String, Object> payload) {
        String userId = session.getAttribute("userId") != null ? session.getAttribute("userId").toString() : null;
        if ( userId == null)
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        else {
            ArrayList<User> members = groupService.getGroupMembers(payload.get("groupName").toString(), userId);
            return new ResponseEntity<Object>(members, HttpStatus.OK);
        }
    }

    @RequestMapping(value = "/getGroups", method = RequestMethod.GET)
    public ResponseEntity<?> getUserGroups(HttpSession session) {
        String userId = session.getAttribute("userId") != null ? session.getAttribute("userId").toString() : null;
        if ( userId == null)
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        else {
            ArrayList<UserGroup> groups = groupService.getUserGroups(userId);
            return new ResponseEntity<Object>(groups, HttpStatus.OK);
        }
    }


}
