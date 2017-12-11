package com.dropbox.prototype.document;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;

public class UserActivity {

    @JsonProperty("operation")
    private String operation;

    @JsonProperty("target")
    private String target;

    @JsonProperty("date")
    private Date date;

    public UserActivity(){
    }

    public UserActivity(String operation, String target, Date date) {
        this.operation = operation;
        this.target = target;
        this.date = date;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
