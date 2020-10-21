const { admin, db } = require("../../utils/admin");
const User = require("../../classes/userClass");
const locale = require("../../localization/EN");

/// --- Set any permission --- ///

exports.setCustomClaims = (req, res) => {
  // Form object from request
  let newMember = req.params.uid;
  let options = {
    team: req.body.team,
    leadership: req.body.leadership,
  };
  // Check for leader flag
  if (options.team["leader"] && !options.leadership) {
    res.status(400).json({ error: locale.INVALID_LEADER });
  }
  // Check if leader is a part of own team
  if (options.leadership && !options.team.includes(options.leadership)) {
    res.status(400).json({ error: locale.PRETENDER });
  }
  // Set permissions
  User.setClaims(newMember, options)
    .then(() => {
      return db.runTransaction(async (t) => {
        try {
          // Get team from DB doc
          const doc = await t.get(db.doc("/Users/ChurchTeams"));
          const newTeam = {};

          // Iterate Object with teams
          for (let [key, value] of Object.entries(doc.data())) {
            console.log(key);
            // If new member exists in DB and new options are not include him
            if (value.members.includes(newMember)) {
              if (!options.team.includes(key)) {
                // Delete DB record for member
                let index = value.members.indexOf(newMember);
                value.members.splice(index, 1);
                newTeam[key] = value;
              }
            }
            // If member not exists but new options include this team
            else if (options.team.includes(key)) {
              // Check for dublicates
              if (!value.members.includes(newMember)) {
                // Push mmber into Array
                value.members.push(newMember);
                newTeam[key] = value;
              }
            }
          }
          // Update DB doc with all changes
          t.update(db.doc("/Users/ChurchTeams"), newTeam);
        } catch (e) {
          console.log(e);
        }
      });
    })

    // RESPOND Success
    .then(() => {
      res.status(200).json({ message: locale.SUCCESSFUL_CHANGES });
      admin.auth().revokeRefreshTokens(newMember);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: locale.UNKNOWN_ERROR });
    });
};

/// --- Add members to Own team --- ///

exports.setMemberClaims = async (req, res) => {
  let newMember = req.body.newMember;
  let churchTeam = req.user.leadership;

  // Check if leader
  if (!req.user.leadership) {
    res.status(403).json({ error: locale.NOT_ALOOWED });
  }

  // Get target User info
  admin
    .auth()
    .getUser(newMember)
    // Dublication check
    .then((user) => {
      let claims = user.customClaims.team;
      if (claims.includes(churchTeam)) {
        return res.status(200).json({ message: locale.SUCCESSFUL_CHANGES });

        // Else set permissions to Firebase Auth
      } else {
        claims.push(churchTeam);
        return User.setClaims(newMember, { team: claims });
      }
    })

    // DB Files update
    .then(() => {
      return db.runTransaction(async (t) => {
        try {
          const newTeam = {};

          // Get team from DB doc
          const doc = await t.get(db.doc("/Users/ChurchTeams"));
          const team = doc.data()[churchTeam];

          // Check if member not exists
          if (!team.members.includes(newMember)) {
            team.members.push(newMember);
            newTeam[churchTeam] = team;

            // Update Doc with changes
            t.update(db.doc("/Users/ChurchTeams"), newTeam);
          } else return;
        } catch (e) {
          console.log(e);
        }
      });
    })

    // Response
    .then(() => {
      res.status(201).json({ message: locale.SUCCESSFUL_CHANGES });
      admin.auth().revokeRefreshTokens(newMember);
    })
    .catch((e) => {
      res.status(500).json({ error: locale.UNKNOWN_ERROR });
    });
};

/// --- Delete members from Own team --- ///

exports.deleteMemberClaims = async (req, res) => {
  let churchTeam = req.user.leadership;
  let newMember = req.body.newMember;

  // Check permission
  if (!req.user.leadership) {
    res.status(403).json({ error: locale.NOT_ALOOWED });
  }

  // Get target User info from Firebase AUTH
  admin
    .auth()
    .getUser(newMember)

    // Dublication check
    .then((user) => {
      let claims = user.customClaims.team;
      if (!claims.includes(churchTeam)) {
        return res.status(200).json({ message: locale.SUCCESSFUL_CHANGES });
      }

      // Else set permissions to Firebase Auth
      else {
        let i = claims.indexOf(churchTeam);
        claims.splice(i, 1);
        return User.setClaims(newMember, { team: claims });
      }
    })

    // Edit DB files
    .then(() => {
      db.runTransaction(async (t) => {
        try {
          const newTeam = {};

          // Get team from DB doc
          const doc = await t.get(db.doc("/Users/ChurchTeams"));
          const team = doc.data()[churchTeam];

          // Check if member exists
          if (team.members.includes(newMember)) {
            let i = team.members.indexOf(newMember);

            // Delete member
            team.members.splice(i, 1);
            newTeam[churchTeam] = team;

            // Update file in DB
            t.update(db.doc("/Users/ChurchTeams"), newTeam);
          } else return;
        } catch (e) {
          console.log(e);
        }
      });
    })

    // RESPOND Success
    .then(() => {
      res.status(201).json({ message: locale.SUCCESSFUL_CHANGES });
    })
    .catch((e) => {
      res.status(500).json({ error: locale.UNKNOWN_ERROR });
    });
};

/// --- Get User Claims --- ///
exports.getClaims = (req, res) => {
  admin
    .auth()
    .getUser(req.user.uid)
    .then((user) => {
      const access = user.customClaims;
      res.json({ access });
    });
};

//// --- MiddleWares --- ////

// Admin check
exports.isAdmin = (req, res, next) => {
  if (req.user.isAdmin()) {
    return next();
  } else {
    res.status(403);
    return res.json({ error: locale.NOT_ALOOWED });
  }
};

// Leader Check
exports.isLeader = (req, res, next) => {
  if (req.user.isAdmin() || req.user.isLeader()) {
    return next();
  } else {
    res.status(403);
    return res.json({ error: locale.NOT_ALOOWED });
  }
};
