package com.dropbox.prototype.document;

import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;

public class UserGroup {

    private String groupName;
    @Field("sub")
    private ArrayList<User> groupMembers;

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
}
