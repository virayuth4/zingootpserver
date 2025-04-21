// SMS OTP Service
// Handles the actual OTP sending functionality

const axios = require('axios');
const crypto = require('crypto');
const express = require("express");
const router = express.Router();



// Add basic authentication middleware for security
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Use a simple API key approach - store this securely in environment variables
    if (token !== process.env.API_KEY) {
        return res.status(403).json({ message: 'Invalid API key' });
    }
    
    next();
};

router.get('/get-otp', (req, res) => {
    console.log("-----Get OTP Route Hit-----")
    res.status(200).json({ 
        success: true, 
        message: 'OTP GET Route hit successfully' 
    });
});


router.post('/send-otp',  async (req, res) => {
    console.log("-----Send OTP Route Hit-----")
    try {
        const {phoneNumber, otp, fullName} = req.body;
        console.log("Fullname:", fullName);
        console.log("Phone Number:", phoneNumber);
        console.log("OTP:", otp);
        console.log("=======Sending OTP=========");
        
        if (!phoneNumber || !otp) {
            return res.status(400).json({ 
                message: 'Missing required parameters: phoneNumber and otp'
            });
        }
        
        const result = await sendOTP(phoneNumber, otp);
        console.log("OTP Result:", result);
        console.log("=======Finnished Sending OTP=========");
       
        
        res.status(200).json({ 
            success: true, 
            message: 'OTP sent successfully' 
        });
    } catch (error) {
        console.error(`Error sending OTP: ${error.message}`);
        res.status(500).json({
            message: 'Failed to send SMS',
            error: error.message
        });
    }
});



async function sendOTP(phoneNumber, otp) {
    console.log("Sending OTP");


    console.log("otp", otp);
    
    // Clean the phone number: replace initial 855 with 0
    let cleanedPhoneNumber = phoneNumber;
    if (phoneNumber.startsWith('855')) {
        cleanedPhoneNumber = '0' + phoneNumber.substring(3);
    }
    
    const md5Password = crypto.createHash("md5").update(process.env.MEKONG_PASSWORD).digest("hex");
    console.log("md5Password", md5Password);
    const apiUrl = process.env.MEKONG_API_POST_URL;
    console.log("apiUrl", apiUrl);
    console.log("gsm ", cleanedPhoneNumber);

    const message = `OTP code: ${otp}. Do not share it or use it elsewhere!`;
    
    // Prepare request parameters
    const postData = new URLSearchParams();
    postData.append('username', process.env.MEKONG_USERNAME);
    postData.append('pass', process.env.MEKONG_PASSWORD);
    postData.append('sender', process.env.MEKONG_SENDER);
    postData.append('smstext', message);
    postData.append('gsm', cleanedPhoneNumber);
    postData.append('int', "0");
    postData.append('cd', "Test Data" || "");

    // Send the SMS request
    const response = await axios.post(apiUrl, postData);
    console.log("response status", response.status);
    console.log("response", response.data);

    return response.data; // Return the response data
}

module.exports = router;