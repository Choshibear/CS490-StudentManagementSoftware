const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler= require('./middleware/errorHandler');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//routes are prefixed with /api
app.use('/api', routes); 

app.use(errorHandler); // custom error handler

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));