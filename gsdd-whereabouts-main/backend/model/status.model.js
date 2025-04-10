const Sequelize = require("sequelize");
const sequelize = require("../server");

const UserModel = require("./account.model");
const { timestamp } = require("rxjs");
const User = require("./account.model");

const Status = sequelize.define("Status",{
    Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        reference:{
            model: "Users",
            key: "Id",
        }
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date_and_time: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, {timestamps: true},);

UserModel.hasMany(Status, { foreignKey: "user_Id"});
Status.belongsTo(UserModel, { foreignKey: "user_Id"});

module.exports = Status;