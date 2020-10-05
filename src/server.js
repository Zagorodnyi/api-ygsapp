const express = require("express");
const app = express();
const helmet = require("helmet");
const compression = require("compression");

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
  // exposedHeaders: ["set-cookie"],
};
// MiddleWare
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser());
app.use(cors(corsOptions));

// User Auth Routes
const Users = require("./handlers/Users/User.js");
app.use("/", Users);

// Events routes
const Events = require("./handlers/WeekPlan/Events");
app.use("/week-events", Events);

//Songs Library routes
const Songs = require("./handlers/Songs/Songs");
app.use("/songs", Songs);

//Service Plan routes
const ServicePlan = require("./handlers/ServicePlans/ServicePlan");

app.use("/plan", ServicePlan);

app.get("/get", cookieAuth, (req, res) => {
  res.json(req.user);
});

const port = process.env.PORT || 3002;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
