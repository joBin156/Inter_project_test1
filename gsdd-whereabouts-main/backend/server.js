require("dotenv").config();

const express = require("express");
const Sequelize = require("sequelize");
const db_config = require("./config").database;
const bodyParser = require("body-parser");
const cors = require("cors");
const history = require("connect-history-api-fallback");
const cookieParser = require("cookie-parser");
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const port = process.env.PORT || 80;
const server = http.createServer(app);

const wss = new WebSocket.Server({server});

wss.on('error', console.error);

wss.on('connection', function connection(ws){
    console.log("A new client connected");
    ws.send("WS SEND Welcome new client!");

    ws.on('message', function message(status) {
        console.log('received: %s', status);
        ws.send("Got your message its from WS: " + message)
    });
})

const allowedOrigin = ["http://localhost:80", "http://localhost:4200"];

const corsOptions = {
  origin: allowedOrigin,
  methods: "GET,POST,PUT",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());

// app.use(history());

// Remove timezone at the end of the creationAt and updateAt
Sequelize.DATE.prototype._stringify = function (date, options) {
  date = this._applyTimezone(date, options);
  // Z here means current timezone, _not_ UTC
  // return date.format('YYYY-MM-DD HH:mm:ss.SSS Z');
  return date.format("YYYY-MM-DD HH:mm:ss.SSS");
};

const sequelize = new Sequelize(
  db_config.database,
  db_config.user,
  db_config.password,
  {
    host: db_config.server,
    dialect: "mssql",
    timezone: db_config.timezone,
    dialectOptions: {
      useUTC: db_config.dialectOptions.useUTC,
    },
  },
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully");
  })
  .catch((err) => {
    console.error("Unable to connect to the db: " + err);
  });

module.exports = sequelize;

// const User = require("./model/account.model");
// const TimeInAndOut = require("./model/time_in_out.model");

// app.get("/test", (req, res) => {
//   User.findAll().then((users) => {
//     res.json(users);
//   });
// });

//Routes
const account_routes = require("./routes/account.routes");
app.use("/", account_routes);

const time_in_out_routes = require("./routes/time_in_time_out");
app.use("/", time_in_out_routes);

const status_route = require("./routes/status.route")(wss);
app.use("/", status_route);

const status_value_route = require("./routes/status_value");
app.use("/", status_value_route);

app.use('/', express.static(path.join(__dirname, 'dist/gsdd-whereabouts')));

app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname,
      'dist/gsdd-whereabouts/index.html'));
});

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
