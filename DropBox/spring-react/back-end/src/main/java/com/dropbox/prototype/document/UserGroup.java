package com.dropbox.prototype.document;

import com.dropbox.prototype.repository.UserRepository;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;

public class UserGroup {

    @JsonProperty("name")
    private String groupName;

    @JsonProperty("members")
    private ArrayList<User> groupMembers;

    public UserGroup(){

    }

    public UserGroup(String groupName, ArrayList<User> groupMembers) {
        this.groupName = groupName;
        this.groupMembers = groupMembers;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }


    public ArrayList<User> getGroupMembers() {
        return groupMembers;
    }

    public void setGroupMembers(ArrayList<User> groupMembers) {
        this.groupMembers = groupMembers;
    }

    public void addGroupMembers(ArrayList<User> newGroupMembers){
        if(this.groupMembers == null){
            this.groupMembers = newGroupMembers;
        }else{
            for(User user : newGroupMembers){
                if(!this.groupMembers.contains(user))
                    this.groupMembers.add(user);
            }
        }
    }

    public void addGroupMember(User newGroupMember){
        if(this.groupMembers == null){
            this.groupMembers = new ArrayList<User>();
            this.groupMembers.add(newGroupMember);
        }else{
            if(!groupHasMember(this.groupMembers,newGroupMember))
                this.groupMembers.add(newGroupMember);
        }
    }

    private boolean groupHasMember(ArrayList<User> groupMembers, User newGroupMember) {
        if(groupMembers != null){
            for(User member : groupMembers){
                if(member.getId().equals(newGroupMember.getId()))
                    return true;
            }
            return false;
        }else{
            return false;
        }

    }
}
