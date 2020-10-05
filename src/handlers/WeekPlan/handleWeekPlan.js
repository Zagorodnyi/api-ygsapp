const { db } = require("../../utils/admin");
const Date = require("../../classes/DateClass");
const locale = require("../../localization/EN");

/// --- Get All Events of the week. Returns Array with docs --- ///

exports.getAllEvents = (req, res) => {
  // Get First and Last date of the week
  let sunday = new Date().sunday.get();
  let monday = new Date().monday.get();

  // Search in DB
  db.collection("WeekEvents")
    .where("date", ">=", monday)
    .where("date", "<=", sunday)
    .orderBy("date", "asc")
    .get()

    // Returns all Events between monday and sunday
    .then((data) => {
      // If no events
      if (data.docs.length === 0) {
        res.status(200).json({ message: locale.NO_EVENT });
      }
      // Map docs to add an Id in each object
      else {
        let docs = [];
        data.docs.map((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        return docs;
      }
    })
    .then((docs) => {
      if (!docs) {
        return;
      }
      // Define User permissions/team
      let usrTeam = req.user.team;

      // Filter Docs only related to User
      return (teamRelatedDocs = docs.filter((doc) => {
        // Global filter status
        let status = false;

        // Map through types of event
        doc.type.map((type) => {
          // If type of Event is General or User is  Admin - return true
          if (type === "general" || req.user.isAdmin()) {
            return (status = true);
          } else {
            // Else compare User team to type of Event
            return usrTeam.includes(type) && (status = true);
          }
        });
        // Return result from filter callback
        return status;
      }));
    })

    // Respond with Docs Array
    .then((docs) => {
      if (!docs) {
        return;
      }
      res.json({ docs });
    })
    .catch((err) => {
      console.log(err);
      res.json({ error: locale.UNKNOWN_ERROR });
    });
};

//

/// --- Get past Events. Returns an Array with all history Events found. Can be very large, maybe) --- ///
exports.getHistoryEvents = (req, res) => {
  // Get the Start of the week
  let monday = new Date().monday.get();

  // Search through the DB collection
  db.collection("WeekEvents")
    .where("date", "<", monday)
    .orderBy("date", "desc")
    .get()

    // Returns All Events older than monday of current week
    .then((data) => {
      // If Empty
      if (data.docs.length === 0) {
        res.status(200).json({ message: locale.NO_HISTORY });
      }
      // Map docs to add an Id in each object
      let docs = [];
      data.docs.map((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      return docs;
    })
    .then((docs) => {
      // Define User team/permissions
      let usrTeam = req.user.team;

      // Filter only Events related to User
      return (teamRelatedDocs = docs.filter((doc) => {
        // Global filter status
        let status = false;

        // Map through event type
        doc.type.map((type) => {
          // If type General or User is Admin - return true
          if (type === "general" || req.user.isAdmin()) {
            return (status = true);
          } else {
            // Else compare event type to User teams
            return usrTeam.includes(type) && (status = true);
          }
        });

        // Return status to filter callback
        return status;
      }));
    })
    // Respond Success
    .then((docs) => {
      res.status(200).json({ docs });
    })
    .catch((err) => {
      console.log(err);
      res.json({ error: locale.UNKNOWN_ERROR });
    });
};
