const { auth, admin, db } = require("./admin");
const User = require("../classes/userClass");
const locale = require("../localization/EN");

module.exports =
  // Aunthefication check Callback
  (req, res, next) => {
    let idToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      idToken = req.headers.authorization.split("Bearer ")[1];
    } else {
      console.log("No token found");
      return res.status(403).json({ error: locale.UNAUTHORIZED });
    }
    admin
      .auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        req.user = decodedToken;
        return db
          .collection("Users")
          .where("id", "==", req.user.uid)
          .limit(1)
          .get();
      })
      .then((data) => {
        req.user.userHandle = data.docs[0].data().userHandle;
        console.log(req.user);

        next();
      })
      .catch((err) => {
        console.error("Error while verifying token", err);
        return res.status(403).json({ error: locale.INVALID_TOKEN });
      });
  };
