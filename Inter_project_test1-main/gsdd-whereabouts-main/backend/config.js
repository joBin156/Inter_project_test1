require("dotenv").config();

module.exports = {
  database: {
    user: process.env.DB_USER || "New" ,
    password: process.env.DB_PASSWORD || "11241999",
    database: process.env.DB || "gsdd_personnel_tracking",
    server: process.env.DB_SERVER || "localhost",
    options: {
      trustServerCertificate: true,
    },
    dialectOptions: {
      useUTC: false,
    },
    timezone: "+08:00",
  },

  nodemail: {
    user: process.env.GMAIL_USER_AUTH,
    password: process.env.GMAIL_PW_AUTH,
  },

  base_url: {
    url: process.env.BASE_URL,
  },
};
