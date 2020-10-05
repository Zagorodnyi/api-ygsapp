const { db } = require("../../utils/admin");
const locale = require("../../localization/EN");

/// --- Create new Week Event --- ///
exports.newEvent = (req, res) => {
  // Create an Object from request
  const Event = {
    date: req.body.date,
    description: req.body.description || null,
    eventName: req.body.eventName,
    type: req.body.type,
    createdBy: req.user.name,
    photoURL: req.user.picture,
    createdAt: new Date().toUTCString(),
  };

  // Create Db Files
  db.collection("WeekEvents")
    .add(Event)
    // Response Success
    .then(() => {
      res.json({ message: locale.EVENT_CREATE });
    })
    .catch((err) => {
      console.log(err);
      res.json({ error: locale.UNKNOWN_ERROR });
    });
};

/// --- Edit Week Event --- ///
exports.editEvent = (req, res) => {
  // Form an Object from request
  const Event = {
    date: req.body.date,
    description: req.body.description || null,
    eventName: req.body.eventName,
    type: req.body.type, // Recieves an Array
    editedBy: req.user.name,
  };

  // Update DB Files
  db.collection("WeekEvents")
    .doc(req.params.id)
    .update(Event)

    // Respond Success
    .then(() => {
      res.status(201).json({ message: locale.EVENT_EDIT });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: locale.UNKNOWN_ERROR });
    });
};

/// --- Delete Week Event --- ///
exports.deleteEvent = (req, res) => {
  // Delete DB files by ID in params
  db.collection("WeekEvents")
    .doc(req.params.id)
    .delete()

    // Respond Success
    .then(() => {
      res.status(201).json({ message: locale.EVENT_DELETE });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: locale.UNKNOWN_ERROR });
    });
};
