const mongoose = require('mongoose');
const Joi = require('joi');

// Define the schema for the purchased tokens
const tokenSchema = new mongoose.Schema({
  meterNumber: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 6
  },
  token: {
    type: String,
    minlength: 8,
    maxlength: 8
  },
  tokenStatus: {
    type: String,
    enum: ['USED', 'NEW', 'EXPIRED'],
    required: true
  },
  tokenValueDays: {
    type: Number,
    required: true
  },
  purchasedDate: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  }
});

// Define the Joi schema for validation
const tokenJoiSchema = Joi.object({
  meterNumber: Joi.string().length(6).required(),
  amount: Joi.number().required()
});

// Create the model
const Token = mongoose.model('Token', tokenSchema);

// Export the model and Joi schema
module.exports = {
  Token,
  tokenJoiSchema
};

// Swagger Model Definition
/**
 * @swagger
 * definitions:
 *     Token:
 *       type: object
 *       properties:
 *         meterNumber:
 *           type: string
 *           minLength: 6
 *           maxLength: 6
 *           example: "123456"
 *         token:
 *           type: string
 *           minLength: 8
 *           maxLength: 8
 *           example: "abcdefgh"
 *         tokenStatus:
 *           type: string
 *           enum: ["USED", "NEW", "EXPIRED"]
 *           example: "USED"
 *         tokenValueDays:
 *           type: number
 *           example: 5
 *         purchasedDate:
 *           type: string
 *           format: date-time
 *           example: "2023-06-23T08:43:27.934Z"
 *         amount:
 *           type: number
 *           example: 500
 */