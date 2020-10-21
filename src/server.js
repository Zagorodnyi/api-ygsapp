const express = require("express");
const app = express();
const helmet = require("helmet");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cookieAuth = require("./utils/cookieAuth");

require("dotenv").config();

const corsOptions = {
  //To allow requests from client
  origin: [
    "http://localhost:3001",
    "http://127.0.0.1",
    "http://localhost:3000",
  ],
  credentials: true,
};
// MiddleWare
app.use(helmet());
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(cors(corsOptions));

// User Auth Routes
const Users = require("./API/Users/User");
app.use("/", Users);

// Events routes
const Events = require("./API/WeekPlan/Events");
app.use("/week-events", Events);

//Songs Library routes
const Songs = require("./API/Songs/Songs");
app.use("/songs", Songs);

//Service Plan routes
const ServicePlan = require("./API/ServicePlans/ServicePlan");
app.use("/plan", ServicePlan);

const Teams = require("./API/Teams/Teams");
app.use("/teams", Teams);

app.get("/get", cookieAuth, (req, res) => {
  res.json(req.user);
});

const port = process.env.PORT || 3002;

module.exports = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
