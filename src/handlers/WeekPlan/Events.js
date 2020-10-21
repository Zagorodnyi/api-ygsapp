const express = require("express");
const router = express.Router();

const cookieAuth = require("../../utils/cookieAuth");
const handleEvents = require("./WeekEventsRequests");
const handleWeekPlan = require("./GetWeekPlanRequests");
const { isLeader } = require("../Users/userPermissions");

// Events Actions
const { newEvent, editEvent, deleteEvent } = handleEvents;

router.post("/create", cookieAuth, isLeader, newEvent);
router.post("/edit/:id", cookieAuth, isLeader, editEvent);
router.delete("/delete/:id", cookieAuth, isLeader, deleteEvent);

// Get Actual Events or History
const { getAllEvents, getHistoryEvents, getFutureEvents } = handleWeekPlan;

router.get("/", cookieAuth, getAllEvents);
router.get("/history", cookieAuth, getHistoryEvents);
router.get("/all", cookieAuth, getFutureEvents);

module.exports = router;
