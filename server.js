// SMS Proxy Server
// This minimal server handles SMS OTP sending with a static IP address
// Main server file

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const config = require('./config/config')

const otpRoutes = require('./api/otpRoutes')

const PORT = 3001;


const app = express();
// Middleware
app.use(express.json());
app.use(cors());

const corsOptions = {
    origin: config.CORS_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'x-client-type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      '*',
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204
  };






// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});


app.use("/api", otpRoutes)
// SMS OTP sending endpoint


// Start the server
app.listen(PORT, () => {
    console.log(`SMS Proxy Server running on port ${PORT}`);
});