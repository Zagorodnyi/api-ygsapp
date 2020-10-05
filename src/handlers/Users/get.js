const { admin, db, auth } = require("../../utils/admin");
const locale = require("../../localization/EN");

// Get User by id in params. Returns an Object with Usr Info
exports.getUser = (req, res) => {
  let user = {};

  // DB Request
  db.collection("Users")
    .where("id", "==", req.params.id)
    .get()

    // Response
    .then((data) => {
      user = data.docs[0].data();
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: locale.UNKNOWN_ERROR });
    });
};

exports.getMe = (req, res) => {
  db.collection("Users")
    .doc(`${req.user.uid}`)
    .get()
    .then((doc) => {
      res.json({ ...doc.data(0) });
    });
};
