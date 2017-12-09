package com.dropbox.prototype.service;

import com.dropbox.prototype.document.User;
import com.dropbox.prototype.document.UserGroup;
import com.dropbox.prototype.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class GroupService {

    @Autowired
    private UserRepository userRepository;

    public boolean createGroup(UserGroup userGroup, String userId) {
        try{
            User user = userRepository.findOne(userId);
            if(!groupExists(userGroup.getGroupName(),user)){
                user.addGroup(userGroup);
                userRepository.save(user);
                return true;
            }else{
                return true;
            }
        }catch(Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private boolean groupExists(String groupName, User user) {
        ArrayList<UserGroup> groups = user.getGroups();
        if(groups != null){
            for(UserGroup userGroup : groups){
                if(userGroup.getGroupName().equals(groupName))
                    return true;
            }
        }
        return false;
    }

    public boolean addGroupMembers(String groupName, String userId, ArrayList<String> memberIds) {
        User user = userRepository.findOne(userId);
        ArrayList<UserGroup> groups = user.getGroups();
        for(UserGroup userGroup : groups){
            if(userGroup.getGroupName().equals(groupName)){
                for(String groupMemberId : memberIds) {
                    User groupMember = userRepository.findOne(groupMemberId);
                    groupMember.setGroups(null);
                    groupMember.setFiles(null);
                    userGroup.addGroupMember(groupMember);
                }
                user.setGroups(groups);
                userRepository.save(user);
                return true;
            }else{
                return false;
            }

        }
        return false;
    }
}
