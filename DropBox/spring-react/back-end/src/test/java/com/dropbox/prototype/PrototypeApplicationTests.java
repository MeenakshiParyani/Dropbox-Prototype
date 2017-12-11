//package com.dropbox.prototype;
//
//import com.dropbox.prototype.document.User;
//import com.dropbox.prototype.document.UserFile;
//import com.dropbox.prototype.document.UserGroup;
//import com.dropbox.prototype.service.FileService;
//import com.dropbox.prototype.service.GroupService;
//import com.dropbox.prototype.service.UserService;
//import org.junit.Assert;
//import org.junit.Before;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.context.junit4.SpringRunner;
//
//import java.util.ArrayList;
//
//@RunWith(SpringRunner.class)
//@SpringBootTest
//public class PrototypeApplicationTests {
//
//	@Test
//	public void contextLoads() {
//	}
//
//	@Autowired
//	private UserService userService;
//
//    @Autowired
//    private FileService fileService;
//
//
//    @Autowired
//    private GroupService groupService;
//
//
//    User sampleUser1 = null;
//    User sampleUser2 = null;
//    User signedUpUser = null;
//    UserGroup sampleGroup = null;
//    UserFile sampleFile = null;
//
//	@Before
//	public void prepareUser(){
//		sampleUser1 = new User(null, "Paul", "Nyguen", "paul.nuyguen@sjsu.edu", "password");
//        sampleUser2 = new User(null, "David", "Anastasiu", "david.a@sjsu.edu", "password");
//        ArrayList<User> groupUsers = new ArrayList<User>();
//        groupUsers.add(sampleUser1);
//		sampleGroup = new UserGroup("Work", groupUsers);
//	}
//
//	@Test
//	public void testUserSignup(){
//		User returnedUser = userService.signupUser(sampleUser1);
//		signedUpUser = returnedUser;
//		Assert.assertNotNull(returnedUser);
//	}
//
//    @Test
//    public void testUserLogin(){
//        User returnedUser = userService.loginUser(sampleUser1);
//        Assert.assertNotNull(returnedUser);
//    }
//
//    @Test
//    public void testCreateDir(){
//        boolean created = fileService.createDir("5a2b3f7705925f1996cae989", "/", "myFiles");
//        Assert.assertTrue(created);
//    }
//
//    @Test
//    public void testCreateGroup(){
//        boolean created = groupService.createGroup(sampleGroup, sampleUser1.getId());
//        Assert.assertTrue(created);
//    }
//
//    @Test
//    public void testaddGroupMembers(){
//        ArrayList<String> newUsers = new ArrayList<String>();
//        newUsers.add(sampleUser2.getId());
//        boolean created = groupService.addGroupMembers(sampleGroup.getGroupName(), sampleUser1.getId(), newUsers);
//        Assert.assertTrue(created);
//    }
//
//    @Test
//    public void testDeleteGroup(){
//        boolean deleted = groupService.deleteGroup(sampleUser1.getId(), sampleGroup.getGroupName());
//        Assert.assertTrue(deleted);
//    }
//
//    @Test
//    public void testdeleteGroupMembers(){
//        ArrayList<String> newUsers = new ArrayList<String>();
//        newUsers.add(sampleUser2.getId());
//        boolean membersDeleted = groupService.deleteGroupMembers(sampleGroup.getGroupName(), sampleUser1.getId(), newUsers);
//        Assert.assertTrue(membersDeleted);
//    }
//
//    @Test
//    public void testGetUSerGroups(){
//        ArrayList<UserGroup> groups = groupService.getUserGroups(sampleUser1.getId());
//        Assert.assertTrue(groups.size()==1);
//    }
//
//    @Test
//    public void testshareFileOrDirWithUsers(){
//        ArrayList<String> users = new ArrayList<String>();
//        users.add(sampleUser2.getId());
//        boolean fileShared = fileService.shareFileOrDirWithUsers(sampleUser1.getId(), sampleFile, users);
//        Assert.assertTrue(fileShared);
//    }
//
//
//}
