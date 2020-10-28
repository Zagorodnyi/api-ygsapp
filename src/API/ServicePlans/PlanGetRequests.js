const { admin, db } = require("../../utils/admin");
const locale = require("../../localization/EN");

// Get Plan by ID. Returns an object with Plan info
exports.getPlanById = (req, res) => {
  const teamsRef = db.doc(`/ServiceTeams/${req.params.id}`);
  let plan, teams;
  // DB Request
  db.doc(`ServicePlans/${req.params.id}`)
    .get()
    .then((doc) => {
      plan = doc.data();
      return teamsRef.get();
    })
    .then((doc) => {
      if (!doc.data()) {
        res.status(404).json({ message: locale.NO_PLANS });
        return;
      } else {
        teams = doc.data();
        res.status(200).json({ plan, teams });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: locale.UNKNOWN_ERROR });
    });
};

// Get closest Plan to the current date. Returns One Object with Data
exports.getCurrentPlan = (req, res) => {
  let today = new Date().toISOString().split("T")[0];

  // DB Request
  db.collection("ServicePlans")
    .where("date", ">=", today)
    .orderBy("date", "asc")
    .limit(1)
    .get()
    .then((data) => {
      // Response if Empty
      if (data.docs.length === 0) {
        res.status(404).json({ message: locale.NO_PLANS });
      }

      // ELSE Response with plan
      else {
        res.json(data.docs[0].data());
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: locale.UNKNOWN_ERROR });
    });
};

// Get all Plans for Admin Plan Manager. Returns Array with Plans data in ascending order
exports.planManager = (req, res) => {
  let documents = [];
  db.collection("ServicePlans")
    .where("date", ">", "0")
    .orderBy("date", "asc")
    .get()
    .then((data) => {
      // Response if Empty
      if (data.docs.length === 0) {
        res.status(404).json({ message: locale.NO_PLANS_MANAGER });
      }

      // Map docs Data to an Array
      else {
        data.docs.map((doc) => {
          documents.push(doc.data());
        });

        // Response with Array
        res.json(documents);
      }
    })
    .catch((err) => {
      // Response Error
      console.log(err);
      res.status(500).json({ error: locale.UNKNOWN_ERROR });
    });
};
