const { admin, db } = require("../utils/admin");
const locale = require("../localization/EN");

// User Class export
module.exports = class User {
  // Constructor gets Firebase Auth response with User's info
  constructor({
    email,
    uid,
    userHandle,
    name,
    phone_number,
    picture,
    team,
    leadership,
  }) {
    this.email = email;
    this.uid = uid;
    this.userHandle = userHandle;
    this.name = name;
    this.phone = phone_number;
    this.picture = picture;
    this.team = team;
    this.leadership = leadership;
  }

  // User Data
  get data() {
    return this;
  }

  //Check User's Admin permission
  isAdmin() {
    return this.team.includes("admin");
  }

  //Check User's Leader permission
  isLeader() {
    return this.team.includes("leader");
  }

  // Set permissions to any user bu ID
  static setClaims(uid = String, params = Object) {
    if (!uid || !params) {
      return;
    }

    // Combine Params into an object
    const claims = {
      team: params.team,
      leadership: params.leadership || false,
    };

    // Promise Creation
    return new Promise((resolve, reject) => {
      // Ask Firebase Auth
      admin
        .auth()
        .setCustomUserClaims(uid, params)
        .then(() => {
          // Update Firebase Database
          return db.collection("Users").doc(uid).update(claims);
        })
        .then(() => {
          // RESOLVE
          resolve(locale.SUCCESSFUL_CHANGES);
        })
        .catch((err) => {
          let error = {
            error: err,
            message: locale.UNKNOWN_ERROR,
          };

          // REJECT
          reject(error);
        });
    });
  }
};
