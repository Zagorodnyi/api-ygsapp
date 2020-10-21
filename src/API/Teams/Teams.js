const router = require("express").Router();
const cookieAuth = require("../../utils/cookieAuth");
const { isLeader } = require("../Users/UserPermissionRequests");
const GetTeamsRequests = require("./GetTeamsRequests");

const { getServiceTeamsByServiceId, updateServiceTeamById } = GetTeamsRequests;
router.get("/:id", cookieAuth, isLeader, getServiceTeamsByServiceId);
router.put("/:id", cookieAuth, isLeader, updateServiceTeamById);

module.exports = router;
