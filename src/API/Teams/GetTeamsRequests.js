const { admin, db } = require("../../utils/admin");
const EN = require("../../localization/EN");

exports.getServiceTeamsByServiceId = async (req, res) => {
  const serviceID = req.params.id;
  const teamsRef = db.doc(`/ServiceTeams/${serviceID}`);

  try {
    const teams = await teamsRef.get();

    if (!teams.data()) {
      res.status(404).json({ error: EN.NO_SERVICE_FOUND });
    }
    res.status(200).json(teams.data());
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: EN.UNKNOWN_ERROR });
  }
};

// Update One Team by Service ID and team ID
exports.updateServiceTeamById = async (req, res) => {
  const serviceID = req.params.id;
  const teamToUpdate = req.body;
  const teamsRef = db.doc(`/ServiceTeams/${serviceID}`);

  if (!(teamToUpdate?.members instanceof Array)) {
    res.status(400).json({ error: EN.NO_MEMBERS_ARRAY_PROVIDED });
    return;
  }

  try {
    const teams = await teamsRef.update({
      [teamToUpdate.id]: teamToUpdate.members,
    });

    res.status(201).json({ message: EN.SUCCESSFUL_CHANGES });
  } catch (err) {
    if (err.code === 5) {
      res.status(404).json({ error: EN.NO_SERVICE_FOUND });
    } else {
      console.log(err);
      res.status(500).json({ error: EN.UNKNOWN_ERROR });
    }
  }
};
