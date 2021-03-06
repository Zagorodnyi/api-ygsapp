const express = require("express");
const cookieAuth = require("../../utils/cookieAuth");
const router = express.Router();

// Require routes
const PostUsers = require("./PostUserRequests");
const GetUsers = require("./GetUserRequests");
const UserPermissions = require("./UserPermissionRequests");

// Authentication
const { signup, login, updateUser, createCookie, logout } = PostUsers;
router.post("/signup", signup);
router.post("/login", login, createCookie);
router.get("/logout", cookieAuth, logout);

// Get User
const { getUser, getMe, getPeople } = GetUsers;
router.get("/users/current/info", cookieAuth, getMe);
router.get("/users/all", cookieAuth, getPeople);
router.get("/users/:id", cookieAuth, getUser);

// User Actions
const {
  setCustomClaims,
  isAdmin,
  isLeader,
  setMemberClaims,
  deleteMemberClaims,
} = UserPermissions;

router.post("/users/:id", cookieAuth, updateUser);

// Admin and Leader Stuff

// Set any claims
router.post("/users/claims/:uid", cookieAuth, isAdmin, setCustomClaims);

// Add member to group
router.post("/users/team/set", cookieAuth, isLeader, setMemberClaims);

// Delete member from group
router.delete("/users/team/delete", cookieAuth, isLeader, deleteMemberClaims);

// router.get("/users/getTeams", cookieAuth, getTeams);

module.exports = router;
