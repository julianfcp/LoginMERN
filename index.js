const express = require('express');
const app = express();
require('dotenv').config();

//Database
require('./database');

// Routes
const authRoute = require('./routes/auth');

// Middlewares
app.use(express.json());

// Route middlewares
app.use('/api/user/', authRoute);





app.listen(3000, () => console.log('Server up and Running'));
