const { admin, db } = require("../utils/admin");
const locale = require("../localization/EN");

// User Class export
module.exports = class User {
  // Constructor gets Firebase Auth response with User's info
  constructor({
    email,
    uid,
    id,
    userHandle,
    displayName,
    name,
    phone_number,
    phoneNumber,
    picture,
    photoURL,
    team,
    leadership,
  }) {
    this.email = email;
    this.uid = uid || id;
    this.userHandle = userHandle;
    this.name = name || displayName;
    this.phone = phone_number || phoneNumber;
    this.picture = picture || photoURL;
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
