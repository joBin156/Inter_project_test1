const Sequelize = require("sequelize");
const sequelize = require("../server");


const StatusValue = sequelize.define(
  "StatusValue",
  {
    Id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    label: {
      type: Sequelize.STRING,
      allowNull: false,
    }, 
    value: {
        type: Sequelize.STRING,
        allowNull: false,
    },
  },
  { timestamps: false },
);


module.exports = StatusValue;
