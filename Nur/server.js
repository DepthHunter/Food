const express = require('express');
const cors = require('cors');
const aiRoutes = require('./aiRoutes.js');
const aiController = require('./aiController.js');

require('dotenv').config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/recommendations', aiController.getMealRecommendations);

app.listen(8000, () => console.log('Server running on port 8000'));
