const express = require("express");
const router = express.Router();
const cookieAuth = require("../../utils/cookieAuth");
const { isAdmin } = require("../Users/UserPermissionRequests");
const { createPlan, updatePlan, deletePlan } = require("./PlanPostRequests");
const {
  getPlanById,
  getCurrentPlan,
  planManager,
} = require("./PlanGetRequests");

// Plan actions
// Admin Only
router.post("/create", cookieAuth, isAdmin, createPlan);
router.post("/manager/:id", cookieAuth, isAdmin, updatePlan);
router.delete("/manager/:id", cookieAuth, isAdmin, deletePlan);

// Get Plan by ID
router.get("/get/:id", cookieAuth, getPlanById);

// Get current Plan
router.get("/", cookieAuth, getCurrentPlan);

// Plan Manager for Admin
router.get("/manager", cookieAuth, isAdmin, planManager);

module.exports = router;
