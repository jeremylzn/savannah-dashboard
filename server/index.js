const express = require('express')
const cors = require('cors') // Allows our server to receive requests from clients on a different origins
var cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv') 
dotenv.config() // Makes environment variables available




// Import routes
const excelRouter = require('./routes/excel')

console.log(`API_KEY => ${process.env.API_KEY}`)
console.log(`API_URL => ${process.env.API_URL}`)



// Initialize server
const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors())

// CORS configuration
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

  
app.use(express.static(path.resolve(__dirname,"../")));

const port = process.env.PORT || 3000

// Use routes
app.use(excelRouter)

app.get('/', (req,res) => {
    res.sendFile(path.resolve(__dirname,"../"))
});

// rewrite virtual urls to angular app to enable refreshing of internal pages
app.get('*', function (req, res, next) {
    res.sendFile(path.resolve(__dirname,"../index.html"));
});

// Listening for incoming connections
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})