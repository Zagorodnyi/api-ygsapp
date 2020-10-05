const { admin, db } = require("../../utils/admin");
const { validatePlan, validateEvent } = require("../../utils/validators");
const locale = require("../../localization/EN");

//
// Create new service Plan with validation
//
exports.createPlan = (req, res) => {
  // Form Object from request
  const plan = {
    heading: req.body.heading,
    date: req.body.date.split("T")[0],
    createdAt: new Date().toISOString(),
    admin: req.body.admin,
    id: Buffer.from(`${new Date().valueOf()}`, "binary").toString("base64"),
  };
  const volunteers = req.body.teams;

  // Start of Validation

  // Validate Events
  const { errors, valid } = validateEvent(req.body.events);
  if (!valid) return res.status(400).json(errors);

  // Sort Events by time
  const OrderedEvents = req.body.events.sort((a, b) => {
    if (a.time > b.time) return 1;
    if (a.time < b.time) return -1;
    return 0;
  });
  plan.events = OrderedEvents;

  // Validate Plan
  const { validPlan, errorsPlan } = validatePlan(plan);
  if (!validPlan) return res.status(400).json(errorsPlan);
  // End of Validation

  // DB files creation
  const batch = db.batch();
  const planRef = db.doc(`/ServicePlans/${plan.id}`);
  const teamsRef = db.doc(`/ServiceTeams/${plan.id}`);

  // Create plan file
  batch.set(planRef, plan);

  // Create Teams file
  batch.set(teamsRef, volunteers);

  // Commit batch
  batch
    .commit()
    .then(() => res.status(200).json({ message: locale.PLAN_CREATED }))
    .catch((err) => {
      console.log(err);
      res.json({ error: locale.UNKNOWN_ERROR });
    });
};

//
// Update existing Plan by ID in request params with validation
//
exports.updatePlan = (req, res) => {
  // Form Object from request
  const plan = {
    heading: req.body.heading,
    date: req.body.date.split("T")[0],
    admin: req.body.admin,
  };
  const volunteers = req.body.teams;

  // Start of Validation

  // Events validation
  const { errors, valid } = validateEvent(req.body.events);
  if (!valid) return res.status(400).json(errors);

  // Sort Events
  const OrderedEvents = req.body.events.sort((a, b) => {
    if (a.time > b.time) return 1;
    if (a.time < b.time) return -1;
    return 0;
  });
  plan.events = OrderedEvents;

  // Plan validation
  const { validPlan, errorsPlan } = validatePlan(plan);
  if (!validPlan) return res.status(400).json(errorsPlan);
  // End of Validation

  // DB files creation
  const batch = db.batch();
  const planRef = db.doc(`/ServicePlans/${req.params.id}`);
  const teamsRef = db.doc(`/ServiceTeams/${req.params.id}`);

  // Update plan file
  batch.update(planRef, plan);

  // Update Teams file
  batch.update(teamsRef, volunteers);

  // Commin batch
  batch
    .commit()
    .then(() => res.status(200).json({ message: locale.PLAN_CHANGED }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: locale.UNKNOWN_ERROR });
    });
};

//
// DELETE Plan by ID in requset params
//
exports.deletePlan = (req, res) => {
  const batch = db.batch();
  const planRef = db.doc(`/ServicePlans/${req.params.id}`);
  const teamsRef = db.doc(`/ServiceTeams/${req.params.id}`);

  // Delete Plan file
  batch.delete(planRef);

  // Delete Team file
  batch.delete(teamsRef);

  // Commit batch
  batch
    .commit()
    .then(() => res.status(200).json({ message: locale.PLAN_DELTED }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: locale.UNKNOWN_ERROR });
    });
};
