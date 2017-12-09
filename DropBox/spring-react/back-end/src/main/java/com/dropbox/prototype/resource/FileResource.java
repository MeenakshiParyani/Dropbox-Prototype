package com.dropbox.prototype.resource;

import com.dropbox.prototype.document.UserFile;
import com.dropbox.prototype.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000")
public class FileResource {

    @Autowired
    private FileService fileService;


    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> listDir(@RequestHeader String currentPath, HttpSession session) {
        if (session.getAttribute("userId") == null)
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        else {
            String userId = session.getAttribute("userId").toString();
            List<UserFile> files = fileService.getUserFiles(userId, currentPath);
            return new ResponseEntity(files, HttpStatus.OK);
        }

    }

    @RequestMapping(value = "/download", method = RequestMethod.GET)
    public ResponseEntity<?> downloadFile(HttpSession session, @RequestParam String filepath) {
        if (session.getAttribute("userId") == null)
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        else {

            // Define the headers
            HttpHeaders headers = new HttpHeaders();
            headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
            headers.add("Pragma", "no-cache");
            headers.add("Expires", "0");
            String userId = session.getAttribute("userId").toString();
            File file = fileService.getUserFile(userId, filepath);
            InputStreamResource resource = null;
            try {
                resource = new InputStreamResource(new FileInputStream(file));
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(file.length())
                    .contentType(MediaType.parseMediaType("application/octet-stream"))
                    .body(resource);

        }
    }

    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    public ResponseEntity<?> uploadFile(HttpSession session, @RequestBody MultipartFile[] files, @RequestHeader String currentpath) {
        String userId = session.getAttribute("userId").toString();
        if ( userId == null)
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        else {
            boolean fileUploaded = fileService.uploadFiles(files, userId, currentpath);
            if(fileUploaded)
                return new ResponseEntity(HttpStatus.OK);
            else
                return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/createDir", method = RequestMethod.POST)
    public ResponseEntity<?> createDir(HttpSession session,@RequestBody  Map<String, Object> payload) {
        String userId = session.getAttribute("userId").toString();
        if ( userId == null)
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        else {
            boolean dirCreated = fileService.createDir(userId, payload.get("dirpath").toString(), payload.get("dirname").toString());
            return new ResponseEntity(HttpStatus.CREATED);
        }
    }

    @RequestMapping(value = "/star", method = RequestMethod.PUT)
    public ResponseEntity<?> starFileOrDir(HttpSession session,@RequestBody  UserFile userFile) {
        String userId = session.getAttribute("userId").toString();
        if ( userId == null)
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        else {
            boolean fileOrdirStared = fileService.starFileOrDir(userId, userFile);
            if(fileOrdirStared)
                return new ResponseEntity(HttpStatus.OK);
            else
                return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/shareWithUser", method = RequestMethod.PUT)
    public ResponseEntity<?> shareFileOrDirWithUser(HttpSession session, @RequestBody  UserFile file, @RequestHeader ArrayList<String> sharewithuserids) {
        String userId = session.getAttribute("userId").toString();
        if ( userId == null)
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        else {
            boolean fileOrDirShared = fileService.shareFileOrDirWithUsers(userId, file, sharewithuserids);
            if(fileOrDirShared)
                return new ResponseEntity(HttpStatus.OK);
            else
                return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
    }
}