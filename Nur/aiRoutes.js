const express = require('express');
const router = express.Router();
const aiController = require('./aiController.js');


router.post('/recommendations', aiController.getMealRecommendations);