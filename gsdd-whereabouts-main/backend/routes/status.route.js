const sequelize = require("../server");

module.exports = function (wss) {
  const express = require("express");
  const Status = require("../model/status.model");
  const User = require("../model/account.model");
  const { QueryTypes } = require("sequelize");

  const app = express();

  app.post("/set_status", async (req, res) => {
    const { user_Id, status } = req.body;

    if (!user_Id || !status) {
      return res.status(400).json({ error: "Invalid Body" });
    }

    try {
      const setStatus = await Status.create({
        user_Id: user_Id,
        status: status,
        date_and_time: new Date(),
      });

      const findUser = await User.findOne({
        where: {
          Id: user_Id,
        },
      });

      if (!findUser) {
        return res.status(401).json({ message: "User not found." });
      }

      const first_name = findUser.first_name;
      const last_name = findUser.last_name;

      if (setStatus) {
        wss.clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(JSON.stringify({ setStatus, first_name, last_name }));
          }
        });
      }

      const { createdAt, updatedAt, ...data } = await setStatus.toJSON();

      res.status(200).json({ data, first_name, last_name });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "An error occurred." });
    }
  });

  app.get("/all_latest_status", async (req, res) => {
    try {
      const all_latest_status = await sequelize.query(
        "SELECT s.*, u.first_name, u.last_name, u.position FROM statuses s INNER JOIN (SELECT user_Id, MAX(date_and_time) AS max_date_and_time FROM statuses WHERE CONVERT(DATE, date_and_time) = CONVERT(DATE, GETDATE()) GROUP BY user_Id ) sub ON s.user_Id = sub.user_Id AND s.date_and_time = sub.max_date_and_time INNER JOIN Users u ON s.user_Id = u.Id WHERE CONVERT(DATE, s.date_and_time) = CONVERT(DATE, GETDATE());",
        {
          type: QueryTypes.SELECT,
        },
      );

      if (!all_latest_status || all_latest_status.length === 0) {
        return res.status(400).json;
      }

      const users = all_latest_status.map((status) => {
        return {
            first_name: status.first_name,
            last_name: status.last_name,
            status: status.status,
          
        };
      });

      res.json(users);
    } catch (err) {
      return res.status(500).json({ error: "An error occurred." });
    }
  });

  return app;
};
