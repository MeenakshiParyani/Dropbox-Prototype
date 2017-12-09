package com.dropbox.prototype.document;

import com.dropbox.prototype.repository.UserRepository;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;

public class UserGroup {

    @JsonProperty("name")
    private String groupName;

    @Field("sub")
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
}
