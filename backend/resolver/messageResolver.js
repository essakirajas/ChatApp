const Message = require('../models').messages;
const User = require('../models').users;
const { UserInputError } = require('apollo-server-errors');
const dateScalar = require('../custom-scalar/dateScalar');
const { to } = require('../responsehandler');
const { Op, where } = require('sequelize');
const { withFilter } = require('graphql-subscriptions');
const { pubsub } = require('../middleware/contextFunction')

const NEW_POSt = 'NEW_POST';


const message = {
  Date: dateScalar,

  Subscription: {
    Messages: {
      subscribe: withFilter(
        (parent, args, { pubsub }) => {
          console.log("Subscription triggered!");
          return pubsub.asyncIterator(NEW_POSt);
        },
        (payload, variables) => {
          // Ensure only relevant users receive messages
          return (
            (payload.Messages.userId === variables.userId && payload.Messages.receiverId === variables.receiverId) ||
            (payload.Messages.userId === variables.receiverId && payload.Messages.receiverId === variables.userId)
          );
        }
      ),
    },
  },
  Query: {
    messages: async function name(_, args) {
      const data = await Message.findAll({
        where: {
          [Op.or]: [
            { userId: args.sender },
            { userId: args.receiver }
          ]
        }
      });
      return data;
    },
    userDetails: async function (_, args) {
      return await User.findOne({ where: { id: args.receiverId } });
    }
  },

  Mutation: {
    postMessage: async function (_, args, { req, pubsub }) {
      msg = await Message.create(args);
      pubsub.publish(NEW_POSt, { Messages: msg, newMessage: msg })
      return args;
    }
  }
}

module.exports.message = message;