const express = require("express");
const cookieAuth = require("../../utils/cookieAuth");

const router = express.Router();
const {
  addSong,
  editSong,
  deleteSong,
  songList,
  getSong,
} = require("./SongsRequests");

// Get Songs
router.get("/list", songList);
router.get("/:id", getSong);

// Songs Actons
router.post("/add", cookieAuth, addSong);
router.put("/:id", cookieAuth, editSong);
router.delete("/:id", cookieAuth, deleteSong);

module.exports = router;
