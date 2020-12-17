const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');
const dotenv = require('dotenv');


const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;
// create application/json parser
let jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(jsonParser);
app.use(urlencodedParser);

//middleware
app.use(compression({
    level: 6,
    threshold: 0,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
            return compression.filter(req, res);
    }
}));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
    credentials: true
}));

app.use(authRoutes);

//database connection

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser : true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false);

