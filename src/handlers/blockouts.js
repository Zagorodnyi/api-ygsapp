const { admin, db } = require("../utils/admin");

const from = new Date("04/03/2020");
const till = new Date("04/10/2020");

const blockout = {
  createdAt: new Date().toUTCString(),
  from: from.toUTCString(),
  till: till.toUTCString(),
};

addBlockout = (req, res) => {
  let UserId = req.user.uid;

  db.collection("BlockOuts")
    .doc(`${from.getUTCMonth()}-${from.getFullYear()}`)
    .get()
    .then((doc) => {
      return (document = [...doc.data().uid, blockout]);
    })
    .then((doc) => {
      db.collection("BlockOuts")
        .doc(`${from.getUTCMonth()}-${from.getFullYear()}`)
        .update({ UserId: doc });
    });
};

deleteBlockout = (req, res) => {
  let index = req.index;

  db.collection("BlockOuts")
    .doc(`${from.getUTCMonth()}-${from.getFullYear()}`)
    .get()
    .then((doc) => {
      const document = doc.data().uid;
      document.splice(index, 1);
      return document;
    })
    .then((doc) => {
      console.log(doc);
      db.collection("BlockOuts")
        .doc(`${from.getUTCMonth()}-${from.getFullYear()}`)
        .update({ uid: doc });
    });
};

module.exports = { deleteBlockout, addBlockout };
