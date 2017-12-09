package com.dropbox.prototype.document;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;

public class UserFile {
    @JsonProperty("name")
    private String name;

    @JsonProperty("isDir")
    private Boolean isDir;

    @JsonProperty("isShared")
    private Boolean isShared;

    @JsonProperty("sharedWithUsers")
    private ArrayList<String> sharedWithUsers;

    @JsonProperty("sharedWithGroups")
    private ArrayList<String> sharedWithGroups;

    @JsonProperty("currentPath")
    private String currentPath;

    @JsonProperty("isStared")
    private Boolean isStared;

    public UserFile(){

    }

    public UserFile(String name, Boolean isDir, Boolean isShared, ArrayList<String> sharedWithUsers, ArrayList<String> sharedWithGroups, String currentPath, Boolean isStared) {
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

    public Boolean getDir() {
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

    public ArrayList<String> getSharedWithUsers() {
        return sharedWithUsers;
    }

    public void setSharedWithUsers(ArrayList<String> sharedWithUsers) {
        this.sharedWithUsers = sharedWithUsers;
    }

    public ArrayList<String> getSharedWithGroups() {
        return sharedWithGroups;
    }

    public void setSharedWithGroups(ArrayList<String> sharedWithGroups) {
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
