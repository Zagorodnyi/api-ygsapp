const { admin, db } = require("../../utils/admin");
const { validateSongInfo } = require("../../utils/validators");
const locale = require("../../localization/EN");

/// --- Add new Song in DB with Validation --- ///
exports.addSong = (req, res) => {
  // Form Object from request
  let song = {
    author: req.body.author,
    key: req.body.key,
    chords: req.body.chords,
    lyrics: req.body.lyrics,
    addedBy: req.user.name,
    hasPlayback: req.body.hasPlayback || false,
    songName: req.body.name,
    shortName: `${req.body.name} by ${req.body.author}`,
    createdAt: new Date().toISOString(),
    bpm: req.body.bpm,
  };

  // Validation
  const { errors, valid } = validateSongInfo(song);
  if (!valid) return res.status(400).json(errors);

  // Create DB Files
  const batch = db.batch();
  let id;

  // Add Empty Doc to get ID
  db.collection("Songs")
    .add({})

    // Update Doc by ID and Update File with Songs list
    .then((doc) => {
      let listRec = {};
      id = doc.id;
      const ref = db.collection("Songs").doc(id);
      const refList = db.collection("Songs").doc("SongsList");

      // Song File
      batch.set(ref, song);
      listRec[id] = song.shortName;

      // Songs List Record
      batch.update(refList, listRec);

      // Commit Batch
      batch
        .commit()
        .then(() => res.status(200).json({ message: locale.SONG_ADDED }))
        .catch((err) => {
          db.collection("Songs").doc(`${id}`).delete();
          console.log(err);
          res.status(500).json({ error: locale.UNKNOWN_ERROR });
        });
    });
};

/// --- Edit Song by ID in params with Validation. --- ///
exports.editSong = (req, res) => {
  // Form Object from request
  let song = {
    author: req.body.author,
    key: req.body.key,
    chords: req.body.chords,
    lyrics: req.body.lyrics,
    addedBy: req.user.name,
    hasPlayback: req.body.hasPlayback,
    songName: req.body.name,
    shortName: `${req.body.name} by ${req.body.author}`,
    createdAt: new Date().toISOString(),
    bpm: req.body.bpm,
  };

  // Validation
  const { errors, valid } = validateSongInfo(song);
  if (!valid) return res.status(400).json(errors);

  // Create DB Files
  const batch = db.batch();
  let id = req.params.id;
  let listRec = {};
  const ref = db.collection("Songs").doc(id);
  const refList = db.collection("Songs").doc("SongsList");

  // Update Song file
  batch.update(ref, song);

  // Update Songs List
  listRec[id] = song.shortName;
  batch.update(refList, listRec);

  // Commit Batch
  batch
    .commit()
    .then(() => res.status(200).json({ message: locale.SONG_CHANGED }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: locale.UNKNOWN_ERROR });
    });
};

/// --- Delete Song from DB by ID in request params --- ///
exports.deleteSong = (req, res) => {
  let id = req.params.id;
  let list = {};
  let batch = db.batch();
  list[id] = admin.firestore.FieldValue.delete();
  const ref = db.doc(`Songs/${id}`);
  const refList = db.doc(`Songs/SongsList`);

  // Detele Song File
  batch.delete(ref);

  // Delete Song from Songs List
  batch.update(refList, list);

  // Commit batch
  batch
    .commit()
    .then(() => res.status(201).json({ message: locale.SONG_DELETED }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: locale.UNKNOWN_ERROR });
    });
};

/// --- Get List of existing songs in DB. Returns an Array with --- ///
exports.songList = (req, res) => {
  // Get DB File with List
  db.doc("Songs/SongsList")
    .get()
    .then((doc) => {
      // Check if empty
      if (!doc.exists || doc.length === 0) {
        res.status(200).json({ message: locale.NO_SONGS });
      }

      // Create an Array with name and id.
      let songsList = [];
      Object.keys(doc.data()).map((key) => {
        songsList.push({ name: doc.data()[key], id: key });
      });

      // Sort Songs by name a-z
      songsList.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });

      // Response
      res.status(200).json({ songsList });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: locale.UNKNOWN_ERROR });
    });
};

/// --- Get Specific song by ID in request params. Returns an object with song data. --- ///
exports.getSong = (req, res) => {
  // DB request
  db.doc(`Songs/${req.params.id}`)
    .get()

    // Response
    .then((song) => {
      res.status(200).json(song.data());
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: locale.UNKNOWN_ERROR });
    });
};
