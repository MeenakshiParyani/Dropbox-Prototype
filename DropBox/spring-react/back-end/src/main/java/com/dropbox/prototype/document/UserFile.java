package com.dropbox.prototype.document;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sun.tools.javac.code.Attribute;

import java.util.ArrayList;

public class UserFile {

    @JsonProperty("name")
    private String name;

    @JsonProperty("isDir")
    private Boolean isDir;

    @JsonProperty("isShared")
    private Boolean isShared;

    @JsonProperty("sharedWithUsers")
    private ArrayList<User> sharedWithUsers;

    @JsonProperty("sharedWithGroups")
    private ArrayList<UserGroup> sharedWithGroups;

    @JsonProperty("currentPath")
    private String currentPath;

    @JsonProperty("isStared")
    private Boolean isStared;




    public UserFile(){

    }

    public UserFile(String name, Boolean isDir, Boolean isShared, ArrayList<User> sharedWithUsers, ArrayList<UserGroup> sharedWithGroups, String currentPath, Boolean isStared) {
        this.name = name;
        this.isDir = isDir;
        this.isShared = isShared;
        this.sharedWithUsers = sharedWithUsers;
        this.sharedWithGroups = sharedWithGroups;
        this.currentPath = currentPath;
        this.isStared = isStared;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean isDir() {
        return isDir;
    }

    public void setDir(Boolean dir) {
        isDir = dir;
    }

    public Boolean getShared() {
        return isShared;
    }

    public void setShared(Boolean shared) {
        isShared = shared;
    }

    public ArrayList<User> getSharedWithUsers() {
        return sharedWithUsers;
    }

    public void setSharedWithUsers(ArrayList<User> sharedWithUsers) {
        this.sharedWithUsers = sharedWithUsers;
    }

    public ArrayList<UserGroup> getSharedWithGroups() {
        return sharedWithGroups;
    }

    public void setSharedWithGroups(ArrayList<UserGroup> sharedWithGroups) {
        this.sharedWithGroups = sharedWithGroups;
    }

    public String getCurrentPath() {
        return currentPath;
    }

    public void setCurrentPath(String currentPath) {
        this.currentPath = currentPath;
    }

    public Boolean getStared() {
        return isStared;
    }

    public void setStared(Boolean stared) {
        isStared = stared;
    }
}
