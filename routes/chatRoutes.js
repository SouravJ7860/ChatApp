const express = require('express');
const { authenticateSocket } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticateSocket);

module.exports = router;
