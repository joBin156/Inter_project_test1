const Sequelize = require("sequelize");
const sequelize = require("../server");

const UserModel = require("./account.model");

const TimeInAndOut = sequelize.define(
  "TimeInAndOut",
  {
    Id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    user_Id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "Id",
      },
    },
    time_in: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    time_out: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    total_time: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  { timestamps: true },
);

UserModel.hasMany(TimeInAndOut, { foreignKey: "user_Id" });
TimeInAndOut.belongsTo(UserModel, { foreignKey: "user_Id" });

module.exports = TimeInAndOut;
