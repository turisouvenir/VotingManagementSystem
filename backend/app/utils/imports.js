const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')

/***
 * @param id
 * @returns {boolean}
 */
 exports.validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 *  Encrypt password
 * @param {String} password 
 */
 exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(password, salt)
  return hashed;
}

exports.generateToken = () => {
  const tokenLength = 8;
  const chars = '0123456789';
  let token = '';
  for (let i = 0; i < tokenLength; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Decode a token and get the number of days bought and the corresponding amount
exports.decodeToken = (token) => {
  // Validate token length
  if (token.length !== 8) {
    throw new Error('Invalid token. Token length should be 8 characters.');
  }

  // Extract the value from the token
  const tokenValueDays = parseInt(token, 10);

  // Calculate the amount based on token value days
  const amount = tokenValueDays * 100;

  // Calculate the number of days bought
  const daysBought = tokenValueDays;

  return { daysBought, amount };
};
