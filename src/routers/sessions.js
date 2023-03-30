const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma.js')

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    // Get the username and password from the request body
    const foundUser = await prisma.user.findUnique({
        where: {username: username}
    })
    const match = await bcrypt.compare(password, foundUser.password)
    
    if (!foundUser || !match) {
        res.status(401).json({message: 'invalid username or password'})
    } else {
        const token = jwt.sign(foundUser.username, process.env.JWT_SECRET)
        res.status(200).json({token})
    }
    
    // If the user exists and the passwords match, create a JWT containing the username in the payload
    // Use the JWT_SECRET environment variable for the secret key

    // Send a JSON object with a "token" key back to the client, the value is the JWT created
});

module.exports = router;
