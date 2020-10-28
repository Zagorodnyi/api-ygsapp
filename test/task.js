const chai = require("chai");
const http = require("http");
const app = require("../src/server.js");
const request = require("supertest");
require("dotenv").config();

// Assertion Style
chai.should();
const expect = chai.expect;
const assert = chai.assert;

// const server = http.createServer(app);
const agent = request(app);

describe("Songs tests", () => {
  it("Get list of songs and by id", async (done) => {
    agent
      .get("/songs/list")
      .set("X-API-KEY", process.env.API_CHAI)
      .then((res) => {
        expect(res.body)
          .to.be.an("object")
          .and.to.haveOwnProperty("songsList")
          .to.be.an("array");
        this.songID = res.body.songsList[0].id;

        return agent.get(`/songs/${res.body.songsList[0].id}`);
      })
      .then((res) => {
        assert.isObject(res.body);
        expect(res.body).to.have.all.keys(
          "author",
          "addedBy",
          "hasPlayback",
          "lyrics",
          "chords",
          "songName",
          "shortName",
          "createdAt",
          "bpm",
          "key"
        );
      })
      .catch((err) => {
        console.log(err);
      });
    done();
  });
});
