const { admin, db } = require("./admin");
const User = require("../classes/userClass");
const locale = require("../localization/EN");

module.exports =
  // Aunthefication check
  (req, res, next) => {
    let sessionCookie;

    // Check cookie presense
    if (req.cookies.session) {
      sessionCookie = req.cookies.session;
    }

    // Unauthorized
    else {
      console.log(locale.COOKIE_ERROR);
      return res.status(403).json({ error: locale.UNAUTHORIZED });
    }

    // Verify cookie request
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true)

      // Create User Class with response info
      .then((decodedCookie) => {
        req.user = new User(decodedCookie);
        return db
          .collection("Users")
          .where("id", "==", req.user.uid)
          .limit(1)
          .get();
      })

      // Get Handle (just in case)
      .then((data) => {
        req.user.userHandle = data.docs[0].data().userHandle;

        // Next
        return next();
      })
      .catch((err) => {
        // Error
        console.log(locale.INVALID_COOKIE, err);
        return res.status(403).json({ error: locale.INVALID_COOKIE });
      });
  };
