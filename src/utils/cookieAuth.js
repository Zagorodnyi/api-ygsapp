const { admin, db } = require("./admin");
const User = require("../classes/userClass");
const locale = require("../localization/EN");
require("dotenv").config();

module.exports =
  // Aunthefication check
  (req, res, next) => {
    let sessionCookie;
    let api = "";
    // Check cookie presense
    if (req.cookies.session) {
      sessionCookie = req.cookies.session;
    }
    // Check CHAI API
    else if (req.headers["x-api-key"]) {
      api = req.headers["x-api-key"];
      if (api === process.env.API_CHAI) {
        db.collection("Users")
          .where("id", "==", process.env.API_ID)
          .limit(1)
          .get()
          .then((res) => {
            req.user = new User(res.docs[0].data());
            return next();
          })
          .catch((err) => {
            console.log("API chai error");
          });
      } else console.log("Api not match");
    }

    // Unauthorized
    else {
      console.log(locale.COOKIE_ERROR);
      return res.status(403).json({ error: locale.UNAUTHORIZED });
    }
    //
    //
    //
    //

    // Verify cookie request if no api provided
    if (!api) {
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
    }
  };
