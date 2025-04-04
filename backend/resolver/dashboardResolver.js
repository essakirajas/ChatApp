const { Op } = require('sequelize');

const User = require('../models').users;
const Message = require('../models').messages;

const NEW_POSt = 'NEW_POST';

const dashboard = {
  Subscription: {
    newMessage: {
      subscribe: (parent, args, { pubsub }) => {
        console.log("🔄 Subscription triggered for new messages!");
        return pubsub.asyncIterator(NEW_POSt);
      }
    }
  },

  Query: {
    friends: async function (_, args) {
      return await User.findAll({
        where: {
          id: { [Op.ne]: args.userId } // ✅ Correct usage of Op.ne
        }
      });
    }
  },

  friendsDetails: {
    async message(parent) {
      console.log(`Fetching latest message for userId: ${parent.id}`);
      return await Message.findOne({
        order: [['createdAt', 'DESC']],
        where: { userId: parent.id }
      });
    }
  }
};

module.exports.dashboard = dashboard;
