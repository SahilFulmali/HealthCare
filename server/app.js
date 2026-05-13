require("dotenv").config()
const express = require ('express'); 
const app = express();

// Set the request Body 
app.use(express.json());
app.use(express.urlencoded({extended : true}))

//MIDDLEWARES
const logger = require('./src/middleware/logger')
const errorhandler = require('./src/middleware/errorHandler');

//ROUTES
const authRoutes = require ('./src/routes/authRoutes');
const registrationRoutes = require ('./src/routes/registrationRoutes');
const patientRoutes = require ('./src/routes/patientRoutes');
const doctorRoutes = require ('./src/routes/doctorRoutes');

//LOGGER 
app.use(logger)

//Sujay
app.use('/login', authRoutes);
app.use('/registration', registrationRoutes);

//Devang + Sai
app.use('/patient',patientRoutes);

//Sahil
app.use('/doctor',doctorRoutes);


// Error handling
app.use(errorhandler)

module.exports = app ; 


