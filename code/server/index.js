const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler= require('./middleware/errorHandler');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
app.use(express.json());
app.use(morgan('dev'));

//routes are prefixed with /api
app.use('/api', routes); 

app.use(errorHandler); // custom error handler

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));