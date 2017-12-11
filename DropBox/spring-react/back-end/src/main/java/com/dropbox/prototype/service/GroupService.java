package com.dropbox.prototype.service;

import com.dropbox.prototype.document.User;
import com.dropbox.prototype.document.UserActivity;
import com.dropbox.prototype.document.UserGroup;
import com.dropbox.prototype.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;

@Service
public class GroupService {

    @Autowired
    private UserRepository userRepository;

    public boolean createGroup(UserGroup userGroup, String userId) {
        try{
            User user = userRepository.findOne(userId);
            if(!groupExists(userGroup.getGroupName(),user)){
                user.addGroup(userGroup);
                user.addActivity(new UserActivity("You Created the Group " , userGroup.getGroupName(), new Date()));
                userRepository.save(user);

                System.out.println("Created group " + userGroup.getGroupName() + " for " + user.getFullname());
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
                    user.addActivity(new UserActivity("You added " + groupMember.getFullname() + " to the group " , groupName, new Date()));
                    System.out.println("Added " + groupMember.getFullname() + " to the " + userGroup.getGroupName() + " group");
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

    public boolean deleteGroup(String userId, String groupName) {
        User user = userRepository.findOne(userId);
        ArrayList<UserGroup> groups = user.getGroups();
        UserGroup groupToRemove = new UserGroup();
        for(UserGroup group: groups){
            if(group.getGroupName().equals(groupName)){
                groupToRemove = group;
                groups.remove(groupToRemove);
                user.addActivity(new UserActivity("You Deleted the group " + groupToRemove.getGroupName() , groupName, new Date()));
                System.out.println("Group " + groupName + " Deleted");
            }
        }
        user.setGroups(groups);
        userRepository.save(user);
        return true;
    }

    public boolean deleteGroupMembers(String groupName, String userId, ArrayList<String> userIds) {
        User user = userRepository.findOne(userId);
        ArrayList<UserGroup> groups = user.getGroups();
        for(UserGroup userGroup : groups){
            if(userGroup.getGroupName().equals(groupName)){
                for(String groupMemberId : userIds) {
                    User groupMember = userRepository.findOne(groupMemberId);
                    userGroup.removeGroupMember(groupMember);
                    user.addActivity(new UserActivity("You Removed " + groupMember.getFullname() + " from the group " , groupName, new Date()));
                    System.out.println(groupMember.getFullname() + " removed from " + userGroup.getGroupName());
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

    public ArrayList<User> getGroupMembers(String groupName, String userId) {
        User user = userRepository.findOne(userId);
        ArrayList<UserGroup> groups = user.getGroups();
        for(UserGroup userGroup : groups){
            if(userGroup.getGroupName().equals(groupName)){
                return userGroup.getGroupMembers();
            }
        }
        return null;
    }

    public ArrayList<UserGroup> getUserGroups(String userId) {
        User user = userRepository.findOne(userId);
        ArrayList<UserGroup> groups = user.getGroups();
        return groups;
    }
}
