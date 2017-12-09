package com.dropbox.prototype.resource;

import com.dropbox.prototype.document.UserGroup;
import com.dropbox.prototype.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import javax.servlet.http.HttpSession;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "http://localhost:3000")
public class GroupResource {

    @Autowired
    private GroupService groupService;

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public ResponseEntity<?> createGroup(HttpSession session, @RequestBody UserGroup userGroup) {
        String userId = session.getAttribute("userId").toString();
        if ( userId == null)
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        else {
            boolean groupCreated = groupService.createGroup(userGroup, userId);
            if(groupCreated)
                return new ResponseEntity<Object>(HttpStatus.CREATED);
            else
                return new ResponseEntity<Object>(HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/addMembers", method = RequestMethod.POST)
    public ResponseEntity<?> addMembers(HttpSession session, @RequestBody String groupName, @RequestBody ArrayList<String> userIds) {
        if(session != null){
            String userId = session.getAttribute("userId").toString();
            if ( userId == null)
                return new ResponseEntity(HttpStatus.UNAUTHORIZED);
            else {
                boolean membersAdded = groupService.addGroupMembers(groupName, userId, userIds);
                if(membersAdded)
                    return new ResponseEntity<Object>(HttpStatus.OK);
                else
                    return new ResponseEntity<Object>(HttpStatus.BAD_REQUEST);
            }

        }else{
            return new ResponseEntity<Object>(HttpStatus.UNAUTHORIZED);
        }

    }


}
