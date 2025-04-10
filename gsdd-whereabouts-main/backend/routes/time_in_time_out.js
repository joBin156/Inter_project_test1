const express = require("express");
const TimeInAndOut = require("../model/time_in_out.model");
const { QueryTypes} = require("sequelize");
const sequelize = require("../server");

const app = express();

app.post("/time_in", async (req, res) => {
  const { user_Id, time_in } = req.body;

  if (!user_Id) {
    return res.status(400).json({ error: "No User ID" });
  }

  try {
    const timeIn = await TimeInAndOut.create({
      user_Id,
      time_in: time_in,
    });

    return res.status(201).json(timeIn);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "An error occurred while trying to time in" });
  }
});

app.put("/time_out/:id", async (req, res) => {
  try {
    const time_out_Id = req.params.id;
    // const time_out = new Date();
    const { time_out } = req.body;

    const updated_data = await TimeInAndOut.update(
      { time_out: time_out },
      {
        where: {
          Id: time_out_Id,
        },
      },
    );

    if (updated_data[0] === 0) {
      res.status(404).json({ message: "Update failed. Record not found." });
    } else {
      res.status(200).json({ message: "Record updated successfully." });
    }
  } catch (err) {
    res.status(500).json({ message: "An error occured" + err });
  }
});

app.get("/total_time/:time_out_Id", async (req, res) => {
  const time_out_Id = req.params.time_out_Id;

  try {
    const total_time_query = await TimeInAndOut.findOne({
      where: {
        Id: time_out_Id,
      },
    });

    let total_time = 0;

    if (!total_time_query) {
      return res.status(404).json({ message: "No record found" });
    }

    const time_in = new Date(total_time_query.time_in);
    const time_out = new Date(total_time_query.time_out);

    const diff = time_out.getTime() - time_in.getTime();

    total_time = total_time + diff / (1000 * 60 * 60);

    const formatted_total_time = convertToHHMM(total_time);

    res.json({ total_time: formatted_total_time });
  } catch (err) {
    res.status(500).json({ message: "An error occured" + err });
  }
});

app.put("/set_total_time/:id", async (req, res) => {
  try {
    const time_out_Id = req.params.id;
    const { total_time } = req.body;

    if (!total_time) {
      return res.status(400).json({ error: "No Time Out Data" });
    }

    const total_time_query = await TimeInAndOut.update(
      { total_time: total_time },
      {
        where: {
          Id: time_out_Id,
        },
      },
    );

    if (total_time_query[0] === 0) {
      res.status(404).json({ message: "Update failed. Record not found." });
    } else {
      res.status(200).json({ message: "Record updated successfully." });
    }
  } catch (err) {
    console.error(err);
  }
});

app.get("/check_time_in_today/:id", async (req, res) => {
  try {
    const user_Id = req.params.id;

    if (!user_Id) {
      return res.status(400).json({ error: "No User Id Data" });
    }

    const data = await TimeInAndOut.findOne({
      where: {
        user_Id: user_Id,
      },
      order: [["createdAt", "DESC"]],
    });

    if (data) {
      const time_in_record = data.time_in;

      const date_of_time_in = time_in_record;

      const today = new Date();

      // const time_in_formatted = date_of_time_in.toISOString().split('T')[0];
      const time_in_formatted = date_of_time_in.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      });

      const time_in_formatted_time = date_of_time_in.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      // const today_formatted = today.toISOString().split('T')[0];
      const today_formatted = today.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      });

      const isFromToday = time_in_formatted === today_formatted;

      // res.json({"rawTime": data.time_in.toISOString() , "dataOfTimeIn": time_in_formatted, "todayTime": today_formatted, "isFromToday": isFromToday});

      dataId = data.Id;

      if (isFromToday) {
        res.json({
          Id: dataId,
          dataOfTimeIn: date_of_time_in
            .toISOString()
            .split("T")[1]
            .split(".")[0],
        });
        return;
      }
    }

    res.status(200).json({ message: "Data Unavailable" });
    // res.json({"isFromToday": isFromToday, "time_in": data.time_in});
  } catch (err) {
    // res.status(500).json({ error: 'An error occurred' });
  }
});

app.get("/check_time_out_today/:id", async (req, res) => {
  try {
    const user_Id = req.params.id;

    if (!user_Id) {
      return res.status(400).json({ error: "No User Id Data" });
    }

    const data = await TimeInAndOut.findOne({
      where: {
        user_Id: user_Id,
      },
      order: [["createdAt", "DESC"]],
    });

    if (!data) {
      return res.status(200).json({ message: "Data Unavailable" });
    }
    const time_out_record = data.time_out;
    const date_of_time_out = time_out_record;

    const today = new Date();

    const time_out_formatted = date_of_time_out.toISOString().split("T")[0];

    const today_formatted = today.toISOString().split("T")[0];
    const isFromToday = time_out_formatted === today_formatted;

    dataId = data.Id;

    if (!isFromToday) {
      return res.status(200).json({
        message: "Data Not Match",
        "time out formatated": time_out_formatted,
        today: today_formatted,
      });
    }

    res.status(200).json({
      dataOfTimeOut: date_of_time_out.toISOString().split("T")[1].split(".")[0],
    });
  } catch (err) {
    // res.status(500).json({ error: 'An error occurred' });
  }
});

app.get("/get_time_in_and_out/:id", async (req, res) => {
  const user_Id = req.params.id;

  if (!user_Id) {
    return res.status(400).json({ error: "No User Id Data" });
  }

  try {
    let data = await TimeInAndOut.findAll({
      where: {
        user_Id: user_Id,
      },
      order: [["createdAt", "DESC"]],
    });

    if (!data) {
      return res.status(200).json({ message: "Data Unavailable" });
    }

    data = data.map(item => {
        const formattedItem = { ...item.dataValues};

        formattedItem.time_in = new Date(formattedItem.time_in).toISOString().replace(/:\d{2}\.\d{3}Z$/, '').replace('T', ' ');;
        
        if(formattedItem.time_out != null){
            formattedItem.time_out = new Date(formattedItem.time_out).toISOString().replace(/:\d{2}\.\d{3}Z$/, '').replace('T', ' ');;
        }
        delete formattedItem.createdAt;
        
        return formattedItem;
    })

    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: 'An error occurred' + err })
  }
});

app.put("/update_data/:id", async (req, res) => {
    try {
      const Id = req.params.id;
      const { time_in, time_out } = req.body;
  
      const updated_data = await TimeInAndOut.update(
        { time_in: time_in, time_out: time_out },
        {
          where: {
            Id: Id,
          },
        },
      );
  
      if (updated_data[0] === 0) {
        res.status(404).json({ message: "Update failed. Record not found." });
      } else {
        res.status(200).json({ message: "Record updated successfully." });
      }
    } catch (err) {
      res.status(500).json({ message: "An error occured" + err });
    }
  });

 app.get("/all_latest_time_in", async(req, res) =>{
    try {
        const all_time_in_today = await sequelize.query("SELECT U.first_name, U.last_name, T.* FROM Users U JOIN TimeInAndOuts T ON U.Id = T.user_Id WHERE CAST(T.createdAt AS DATE) = CAST(GETDATE() AS DATE)ORDER BY T.createdAt DESC",
          {
            type: QueryTypes.SELECT,
          },
        );
  
        if (!all_time_in_today || all_time_in_today.length === 0) {
          return res.status(400).json;
        }
  
  
        res.json(all_time_in_today);
      } catch (err) {
        console.error(err)
        return res.status(500).json({ error: "An error occurred." });
      }
 });

 app.get('/get_all_data_time_in_out', async(req, res)=>{
    try{
        const all_data = await sequelize.query("SELECT t.Id, t.user_Id, t.time_in, t.time_out, t.total_time, u.first_name, u.last_name FROM TimeInAndOuts t INNER JOIN Users u ON t.user_Id = u.Id ORDER BY t.time_in DESC",
            {
                type: QueryTypes.SELECT,
            },
        );
        res.json(all_data);
    }catch(err){
        console.error(err)
        return res.status(500).json({ error: "An error occurred." });
    }
 })

function convertToHHMM(time) {
  const hours = Math.floor(time);
  const minutes = Math.floor((time - hours) * 60);

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}
module.exports = app;
