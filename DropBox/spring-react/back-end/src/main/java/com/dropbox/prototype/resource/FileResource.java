package com.dropbox.prototype.resource;

import com.dropbox.prototype.document.User;
import com.dropbox.prototype.document.UserFile;
import com.dropbox.prototype.service.FileService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.math.BigInteger;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000")
public class FileResource {

    @Autowired
    private FileService fileService;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> listDir(@RequestHeader String currentPath){
        List<UserFile> files = fileService.getUserFiles("5a1113ff9b7c9508e6328d6c", currentPath);
        if(files != null )
            return new ResponseEntity(files, HttpStatus.OK);
        else
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
    }
}
