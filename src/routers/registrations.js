const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma.js');
const { user } = require('../utils/prisma.js');

router.post('/', async (req, res) => {
    // Get the username and password from request body
   const {username, password} = req.body
    // Hash the password: https://github.com/kelektiv/node.bcrypt.js#with-promises
    const salt = bcrypt.genSaltSync(saltRounds)
   const hash = bcrypt.hashSync(password, salt)
   console.log("1. hash", hash)
    try {
        const user = await prisma.user.create({
             data: {
                 username: username,
                 password: hash
             }
        })
        res.status(201).json({ user: {id: user.id, username: user.username}})
    } catch(e) {
        console.log(e)
        res.status(400).json({error: e.message})
    }
    
    // Respond back to the client with the created users username and id
});

module.exports = router;
