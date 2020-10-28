const app = require("../src/server.js");
const request = require("supertest");
require("dotenv").config();

const agent = request(app);

describe("Plan Tests", () => {
  test("Get Service Plan", (done) => {
    expect.assertions(2);
    agent
      .get("/plan")
      .set("X-API-KEY", process.env.API_JEST)
      .then((res) => {
        if (res.status === 404) {
          expect(typeof res.body).toBe("object");
          expect(Object.keys(res.body)).toContain("message");
        } else {
          expect(typeof res.body).toBe("object");
          expect(res.body).toEqual({
            id: expect.any(String),
            events: expect.any(Array),
            createdAt: expect.any(String),
            date: expect.any(String),
            admin: expect.any(String),
            heading: expect.any(String),
          });
        }
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
  });

  test("Get a list for manager", (done) => {
    expect.assertions(2);
    agent
      .get("/plan/manager")
      .set("X-API-KEY", process.env.API_JEST)
      .then((res) => {
        if (res.status === 404) {
          expect(typeof res.body).toBe("object");
          expect(Object.keys(res.body)).toContain("message");
        } else {
          expect(res.body).toEqual(expect.any(Array));
          expect(res.body[0]).toEqual({
            id: expect.any(String),
            events: expect.any(Array),
            createdAt: expect.any(String),
            date: expect.any(String),
            admin: expect.any(String),
            heading: expect.any(String),
          });
        }
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
  });
  /**
   * Get Plan By ID
   */

  test("Get a plan by ID", (done) => {
    expect.assertions(7);
    agent
      .get("/plan")
      .set("X-API-KEY", process.env.API_JEST)
      .then((res) => {
        if (res.status === 404) {
          expect(typeof res.body).toBe("object");
          expect(Object.keys(res.body)).toContain("message");
        } else {
          expect(typeof res.body).toBe("object");
        }

        return agent
          .get(`/plan/get/${res.body.id}`)
          .set("X-API-KEY", process.env.API_JEST);
      })
      .then((res) => {
        if (res.status === 404) {
          expect(typeof res.body).toBe("object");
          expect(Object.keys(res.body)).toContain("message");
        } else {
          expect(typeof res.body).toBe("object");
          expect(Object.keys(res.body)).toEqual(["plan", "teams"]);

          expect(typeof res.body.plan).toBe("object");
          expect(res.body.plan).toEqual({
            id: expect.any(String),
            events: expect.any(Array),
            createdAt: expect.any(String),
            date: expect.any(String),
            admin: expect.any(String),
            heading: expect.any(String),
          });
          expect(typeof res.body.teams).toBe("object");
          expect(res.body.teams).toEqual(
            expect.objectContaining({
              staff: expect.any(Array),
              worship: expect.any(Array),
              admin: expect.any(Array),
            })
          );
        }
        done();
      })
      .catch((err) => {
        done();
        console.log(err);
      });
  });
});

describe("Users Tests", () => {
  test("Should login", (done) => {
    expect.assertions(1);
    agent
      .post("/login")
      .send({ email: "414g@gmail.com", password: "123123" })
      .then((res) => {
        expect(Object.keys(res.body)).toContain("message");
        done();
      })
      .catch((err) => {
        done();
        console.log(err);
      });
  });

  test("Should get user info", (done) => {
    expect.assertions(2);
    agent
      .get("/users/current/info")
      .set("x-api-key", process.env.API_JEST)
      .then((res) => {
        expect(res.status).toBe(200);

        expect(res.body).toEqual({
          displayName: expect.any(String),
          email: expect.any(String),
          emailVerified: expect.any(Boolean),
          id: expect.any(String),
          leadership: expect.anything(),
          phoneNumber: expect.any(String),
          photoURL: expect.any(String),
          team: expect.any(Array),
          userHandle: expect.any(String),
        });
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
  });

  test("Get Al registered Users", (done) => {
    expect.assertions(1);
    agent
      .get("/users/all")
      .set("x-api-key", process.env.API_JEST)
      .then((res) => {
        expect(res.body).toEqual(expect.any(Object));
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
  });

  test("get User By ID", (done) => {
    expect.assertions(1);
    agent
      .get(`/users/${process.env.API_ID}`)
      .set("x-api-key", process.env.API_JEST)
      .then((res) => {
        expect(res.body).toEqual({
          displayName: expect.any(String),
          email: expect.any(String),
          emailVerified: expect.any(Boolean),
          id: expect.any(String),
          leadership: expect.anything(),
          phoneNumber: expect.any(String),
          photoURL: expect.any(String),
          team: expect.any(Array),
          userHandle: expect.any(String),
        });
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
  });
});
