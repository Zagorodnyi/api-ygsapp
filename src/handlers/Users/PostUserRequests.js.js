const { admin, db, auth } = require("../../utils/admin");
const { validateSignupData } = require("../../utils/validators");
const Date = require("../../classes/DateClass");
const locale = require("../../localization/EN");

/// --- Cookie creation --- ///
exports.createCookie = (req, res) => {
  const expiresIn = new Date().Days.toMillis(14);

  // Create cookie
  admin
    .auth()
    .createSessionCookie(req.token, { expiresIn })

    // Response with SET-COOKIE Header, Secure, HTML Only
    .then((session) => {
      const options = {
        maxAge: expiresIn,
        httpOnly: true,
        sameSite: "none",
        secure: true,
        domain: "api-ygs-staff.herokuapp.com",
        path: "/",
      };
      return res
        .cookie("session", session, options)
        .json({ message: "Welcome" });
    });
};

/// --- Registration ---///

exports.signup = (req, res) => {
  // Form object from request
  const newUserCredentials = {
    email: req.body.email,
    userHandle: req.body.userHandle,
    displayName: req.body.displayName || "Who are you, stranger...",
    photoURL:
      req.body.photo ||
      "https://firebasestorage.googleapis.com/v0/b/ygs-staff-app.appspot.com/o/noImage.png?alt=media&token=c9ed3215-c425-4d9e-ad76-4db470142cf6",
    phoneNumber: req.body.phoneNumber,
    team: [],
    leadership: false,
  };

  // Start Validation

  // Inputs
  const { valid, errors } = validateSignupData(newUserCredentials);
  if (!valid) res.json(errors);

  // Validate Handler to be uniqe
  db.collection("Users")
    .where("userHandle", "==", req.body.userHandle)
    .get()
    .then((data) => {
      if (data.docs[0]) {
        document = data.docs[0].data();
        if (document.userHandle === req.body.userHandle) {
          res.status(400).json({ errorHandler: locale.HANDLER_EXISTS });
        }
      }
    })

    // Registration
    .then(() => {
      return admin
        .auth()
        .createUser({ ...newUserCredentials, password: req.body.password });
    })

    // Create DB Files
    .then((user) => {
      const batch = db.batch();
      const UserFile = db.collection("Users").doc(`${user.uid}`);
      const PeopleFile = db.collection("Users").doc("People");

      const ShortInfo = {};
      ShortInfo[user.uid] = {
        name: user.displayName,
        id: user.uid,
        picture: user.photoURL,
      };

      // Create User File
      batch.set(UserFile, { ...newUserCredentials, id: user.uid });

      // Add short info to People file
      batch.update(PeopleFile, ShortInfo);

      // Commit Batch
      batch.commit();
      return user;
    })

    // Set custom claims to default
    .then((user) => {
      admin
        .auth()
        .setCustomUserClaims(user.uid, { team: [], leadership: false });
    })

    // Response
    .then(() =>
      res.status(201).json({ message: locale.REGISTRATION_SUCCESSFUL })
    )
    .catch((err) => {
      console.error(err);
      switch (err.code) {
        case "auth/email-already-exists":
          res.json({ errorEmail: locale.EMAIL_EXISTS });
        case "auth/invalid-phone-number":
          res.json({ errorPhone: locale.INVALID_PHONE });
        case "auth/phone-number-already-exists":
          res.json({ errorPhone: locale.PHONE_EXISTS });
        default:
          res.json({ error: err });
      }
    });
};

/// --- LOGIN with next() to create cookie  ---///

exports.login = (req, res, next) => {
  console.log("Gotcha");
  // Form Object from request params
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  // Login
  auth
    .signInWithEmailAndPassword(user.email, user.password)

    // Return Id token
    .then((data) => {
      return data.user.getIdToken();
    })

    // Send Token to Cookie Creation
    .then((Token) => {
      req.token = Token;
      next();
    })
    .catch((err) => {
      console.error(err.code);
      res.json({ error: locale.WRONG_CREDENTIALS });
    });
};

exports.logout = (req, res) => {
  admin.auth().revokeRefreshTokens(req.user.uid);
  res.json({ message: "Logout" });
};

/// --- Updating USER INFO ---///

exports.updateUser = (req, res) => {
  // Check if updating personal info
  if (req.user.uid !== req.params.id) {
    return res.status(401).json({ error: locale.NOT_ALOOWED });
  }

  // Old user info in case failure
  const oldUserCredentials = {
    email: req.user.email,
    emailVerified: false,
    displayName: req.user.name,
    photoURL: req.user.picture,
    phoneNumber: req.user.phone_number,
  };

  // Form new object with info from request
  const newUserCredentials = {
    email: req.body.email || oldUserCredentials.email,
    emailVerified: false,
    displayName: req.body.displayName || oldUserCredentials.displayName,
    photoURL:
      req.body.photo ||
      "https://firebasestorage.googleapis.com/v0/b/ygs-staff-app.appspot.com/o/noImage.png?alt=media&token=c9ed3215-c425-4d9e-ad76-4db470142cf6",
    phoneNumber: req.body.phoneNumber || oldUserCredentials.phoneNumber,
  };

  // Update User
  const batch = db.batch();
  const UserFile = db.collection("Users").doc(`${req.user.uid}`);
  const PeopleFile = db.collection("Users").doc("People");

  const ShortInfo = {};
  ShortInfo[req.user.uid] = {
    name: req.body.displayName || oldUserCredentials.displayName,
    id: req.user.uid,
    picture:
      req.body.photo ||
      "https://firebasestorage.googleapis.com/v0/b/ygs-staff-app.appspot.com/o/noImage.png?alt=media&token=c9ed3215-c425-4d9e-ad76-4db470142cf6",
  };

  // Update User File
  batch.update(UserFile, newUserCredentials);

  // Update User record in People file
  batch.update(PeopleFile, ShortInfo);

  // Commit batch
  batch
    .commit()

    // if Success - update User info in Firebase AUTH
    .then(() => {
      return admin.auth().updateUser(req.user.uid, { ...newUserCredentials });
    })
    .then((res) => {
      console.log(res);
    })

    // RESPONSE
    .then(() => {
      res.status(201).json({ message: locale.USER_UPDATED });
    })
    .catch((err) => {
      console.error(err);
      switch (err.code) {
        case "auth/email-already-exists":
          res.json({ errorEmail: locale.EMAIL_EXISTS });
        case "auth/invalid-phone-number":
          res.json({ errorPhone: locale.INVALID_PHONE });
        case "auth/phone-number-already-exists":
          res.json({ errorPhone: locale.PHONE_EXISTS });
        default:
          // Backup  to Old INFO in DB
          batch.update(UserFile, oldUserCredentials);
          batch.update(PeopleFile, {
            name: req.user.name,
            id: req.user.uid,
            picture: req.user.picture,
          });

          // Batch Commit
          batch.commit();
          res.status(500).json({ error: locale.UNKNOWN_ERROR });
      }
    });
};
