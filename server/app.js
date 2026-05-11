const express = require ('express'); 

const app = express(); 
 
const logger = require('./src/middleware/logger')
const errorhandler = require('./src/middleware/errorHandler'); 
const registrationRoute = require ('./src/routes/registrationRoute')

// logger 
app.use(logger)


// Set the request Body 
app.use(express.json())
app.use(express.urlencoded({extended : true}))


// Res header set
app.use((req, res, next) => {
    res.set('my-custom-header', 'genC-2026')
    next(); 
})

// Public Routes
//app.use('/login', <login_route> )
app.use('/registration', registrationRoute)


// Protected Routes  -- Authentication + authorization

// Error handling 
app.use(errorhandler)

module.exports = app ; 


