package com.dropbox.prototype.document;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigInteger;
import java.util.ArrayList;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    @JsonProperty("firstname")
    private String firstname;

    @JsonProperty("lastname")
    private String lastname;

    @JsonProperty("fullname")
    private String fullname;

    @JsonProperty("email")
    private String email;

    @JsonProperty( value = "password" ,access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @JsonProperty("files")
    private ArrayList<UserFile> files;

    @JsonProperty("groups")
    private ArrayList<UserGroup> groups;

    public enum Permissions {
        READ("Read"), WRITE("Write"), OWNER("Owner");
        private String name; // price of each apple

        // Constructor
        Permissions(String n) { name = n; }

        // Overloaded constructor
        Permissions() { name = ""; }

        String getName() { return name; }
    };

    public User(){
    }

    public User(String id, String firstname, String lastname, String email, String password) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }


    public void setFullname() {
        this.fullname = this.getFirstname() + " " + this.getLastname();
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public ArrayList<UserFile> getFiles() {
        return files;
    }

    public void setFiles(ArrayList<UserFile> files) {
        this.files = files;
    }

    public ArrayList<UserGroup> getGroups() {
        return groups;
    }

    public void setGroups(ArrayList<UserGroup> groups) {
        this.groups = groups;
    }

    public void addGroup(UserGroup group){
        if(this.getGroups() == null){
            ArrayList<UserGroup> groups = new ArrayList<UserGroup>();
            groups.add(group);
            this.setGroups(groups);
        }else{
            this.getGroups().add(group);
        }
    }

    public UserFile getFileByPathAndName(String dirPath, String dirName){
        if(files != null){
            for(UserFile file : files){
                if(file.getCurrentPath().equals(dirPath) && file.getName().equals(dirName)){
                    return file;
                }
            }
        }
        return null;
    }
}
