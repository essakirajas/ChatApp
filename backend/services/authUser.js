const bcrypt = require('bcrypt');
const User = require('../models').users;
const { ERROR } = require('../constants/messages');
const { to, TE } = require('../responsehandler');
/**
 * Author: Essakiraja
 * Created On: 06.03.2025
 * Modified On: 06.03.2025
 * Reviewed By: -
 * Description: Method which is used to authorize the user whether the user is found or not and compare the password is matched.
 * And also it is used to check whwther the mail verification is verified or not.
 * If it is done ,it returns the user.
 * @param req To define the HTTPS request.
 * @param res To define the HTTPS response.
 * @returns If error occurs then return error response.
 * Otherwise return the success response.
 */
const authUser = async (data) => {
  let err, user, passwordMatch;
  [err, user] = await to(User.findOne({
    where: { email: data.email }
  }));
  if (!user || data.password == null) return TE("No User Found in the Email");
  [err, passwordMatch] = await to(bcrypt.compare(data.password, user.password));
  if (!passwordMatch) TE("Invalid password");
  if (passwordMatch) return user;
  return TE(err.message);
};
module.exports = { authUser };
