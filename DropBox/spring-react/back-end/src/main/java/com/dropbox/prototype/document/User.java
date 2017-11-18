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

    @JsonProperty("email")
    private String email;

    @JsonProperty( value = "password" ,access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @JsonProperty("files")
    private ArrayList<UserFile> files;

    @JsonProperty("groups")
    private ArrayList<UserGroup> groups;

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
}
