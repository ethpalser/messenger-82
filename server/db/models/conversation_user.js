const { Sequelize, Op } = require("sequelize");
const db = require("../db");
const User = require("./user");
const Conversation = require("./conversation");

const Conversation_User = db.define("Conversation_User", {
    unreadCount: {
        type: Sequelize.INTEGER.
        allowNuil: false,
        defaultValue: 0,
    },
    lastReadMessage: {
        type: Sequelize.INTEGER,
        allowNuil: false,
        defaultValue: -1,
    }
});
User.belongsToMany(Conversation, { through: Conversation_User });
Conversation.belongsToMany(User, { through: Conversation_User });

module.exports = Conversation_User;