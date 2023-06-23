const { Token, tokenJoiSchema } = require('../models/token.model');
const { generateToken } = require('../utils/imports');


// Create a new token
 exports.createToken = async (req, res) => {
  try {
    // Validate the request body
    const { error, value } = tokenJoiSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { amount, meterNumber } = value;

    // Calculate the token value days based on the amount
    const tokenValueDays = Math.floor(amount / 100);

    // Check if the token exceeds the maximum allowed duration (5 years)
    if (tokenValueDays > 365 * 5) {
      return res.status(400).json({ error: 'Token duration exceeds the maximum limit.' });
    }

    if (amount < 100 || amount % 100 !== 0) {
        return res.status(400).json({ error: 'Invalid amount. Amount should be a multiple of 100 and at least 100 Rwf.' });
      }

    const generatedToken=generateToken()
    // Create a new token
    const token = new Token({
      meterNumber,
      token: generatedToken,
      tokenStatus: 'NEW',
      tokenValueDays,
      amount
    });

    // Save the token to the database
    await token.save();

    return res.status(200).json({message:"Token generated successfully" , token });
  } catch (error) {
    console.error('Error creating token:', error);
    return res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

// Get all tokens by meter number
exports.getAllTokensByMeterNumber = async (req, res) => {
  try {
    const { meterNumber } = req.params;

    // Validate meter number length
    if (meterNumber.length !== 6) {
      return res.status(400).json({ error: 'Invalid meter number. Meter number should be 6 digits.' });
    }

    // Retrieve all tokens with the given meter number from the database
    const tokens = await Token.find({ meterNumber });

    // Update token statuses based on expiration date
    const currentDate = new Date();
    for (const token of tokens) {
      const daysPassed = Math.floor((currentDate - token.purchasedDate) / (1000 * 60 * 60 * 24));

      if (daysPassed < token.tokenValueDays && token.tokenStatus !== 'USED') {
        token.tokenStatus = 'USED';
      } else if (daysPassed > token.tokenValueDays && token.tokenStatus !== 'EXPIRED') {
        token.tokenStatus = 'EXPIRED';
      }

      await token.save();
    }

    return res.status(200).json({message:"tokens found", tokens });
  } catch (error) {
    console.error('Error getting tokens by meter number:', error);
    return res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

// List all tokens
 exports.getAllTokens = async (req, res) => {
  try {
    // Retrieve all tokens from the database
    const tokens = await Token.find();

    // Update token statuses based on expiration date
    const currentDate = new Date();
    for (const token of tokens) {
      const daysPassed = Math.floor((currentDate - token.purchasedDate) / (1000 * 60 * 60 * 24));

      if (daysPassed < token.tokenValueDays && token.tokenStatus !== 'USED') {
        token.tokenStatus = 'USED';
      } else if (daysPassed > token.tokenValueDays && token.tokenStatus !== 'EXPIRED') {
        token.tokenStatus = 'EXPIRED';
      }

      await token.save();
    }

    return res.status(200).json({ tokens });
  } catch (error) {
    console.error('Error listing tokens:', error);
    return res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

// Validate token
exports.validateToken = async (req, res) => {
    try {
      const { token } = req.params;
  
      // Retrieve the token from the database
      const foundToken = await Token.findOne({ token });
  
      // Check if the token exists
      if (!foundToken) {
        return res.status(404).json({ error: 'Token not found.' });
      }
  
      // Check if the token is expired
      const currentDate = new Date();
      const daysPassed = Math.floor((currentDate - foundToken.purchasedDate) / (1000 * 60 * 60 * 24));
      if (daysPassed >= foundToken.tokenValueDays) {
        return res.status(400).json({ error: 'Token expired.' });
      }
  
      // Calculate remaining days and amount
      const remainingDays = foundToken.tokenValueDays - daysPassed;
      const amount = foundToken.amount;
  
      // Return the validation message
      const message = `Token valid. Amount: ${amount} Rwf, Remaining days of lighting: ${remainingDays}`;
      return res.status(200).json({ message });
    } catch (error) {
      console.error('Error validating token:', error);
      return res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  };
