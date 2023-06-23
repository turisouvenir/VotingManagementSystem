const {
    createToken,
    getAllTokensByMeterNumber,
    getAllTokens,
    validateToken,
  } = require('../controllers/tokens.controller');
  const { auth } = require('../middlewares/auth.middleware');
  
  module.exports = (app) => {
    var router = require("express").Router();
  
    /**
   * @swagger
   * /token:
   *   post:
   *     summary: Create a new token
   *     tags: [Token]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         schema:
   *           type: string
   *         required: true
   *         description: Bearer token for authentication
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/Token'
   *     responses:
   *       '200':
   *         description: Token created successfully
   *       '401':
   *         description: Unauthorized
   */
  router.post('/', auth,createToken);
  
    /**
     * @swagger
     * /token/meter/{meterNumber}:
     *   get:
     *     summary: Get all tokens by meter number
     *     tags: [Token]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: meterNumber
     *         schema:
     *           type: string
     *         required: true
     *         description: Meter number
     *     responses:
     *       '200':
     *         description: Successfully retrieved tokens
     *       '401':
     *         description: Unauthorized
     */
    router.get('/meter/:meterNumber', auth, getAllTokensByMeterNumber);
  
    /**
     * @swagger
     * /token:
     *   get:
     *     summary: List all tokens
     *     tags: [Token]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       '200':
     *         description: Successfully retrieved tokens
     *       '401':
     *         description: Unauthorized
     */
    router.get('/', auth, getAllTokens);
  
    /**
     * @swagger
     * /token/validate/{token}:
     *   get:
     *     summary: Validate token
     *     tags: [Token]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: token
     *         schema:
     *           type: string
     *         required: true
     *         description: Token to validate
     *     responses:
     *       '200':
     *         description: Token is valid
     *       '401':
     *         description: Unauthorized
     *       '404':
     *         description: Token not found
     */
    router.get('/validate/:token', auth, validateToken);
  
    app.use("/api/token", router);
  };
  