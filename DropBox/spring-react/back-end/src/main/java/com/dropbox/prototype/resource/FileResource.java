package com.dropbox.prototype.resource;

import com.dropbox.prototype.document.User;
import com.dropbox.prototype.document.UserFile;
import com.dropbox.prototype.service.FileService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
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
    public ResponseEntity<?> listDir(@RequestHeader String currentPath, HttpSession session){
        if(session.getAttribute("userId") == null)
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        else{
            String userId = session.getAttribute("userId").toString();
            List<UserFile> files = fileService.getUserFiles(userId, currentPath);
            return new ResponseEntity(files, HttpStatus.OK);
        }

    }
}
