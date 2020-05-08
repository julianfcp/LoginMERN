const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const cookieParser = require("cookie-parser");
const session = require('express-session')
//Database
require('./database');

// Routes
const authRoute = require('./routes/auth');
const notesRoute = require('./routes/notes');


// Middlewares
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());


// Route middlewares
app.use('/api/user', authRoute);
app.use('/api/notes', notesRoute);




app.listen(4000, () => console.log('Server up and Running'));
