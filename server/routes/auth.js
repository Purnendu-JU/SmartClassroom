const {body, validationResult} = require('express-validator');
const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
require('dotenv').config();
router.post('/signup', [
    body('fname').isLength({min: 3}),
    body('lname').isLength({min: 3}),
    body('email').isEmail(),
    body('password').isLength({min: 5})
], async (req, res)=>{
    let success = false;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }
    try{
        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({error: "Already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: secPass
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, process.env.JWT_SECRET);
        success = true;
        res.json({authtoken, success});
    }
    catch(error){
        res.status(500).send("Some error occured");
    }
});
router.post('/login', [
    body('email', 'Enter a valid email id').isEmail(),
    body('password', 'Password cannot be blanck').exists()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }
    const {email, password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "Please enter correct credentials"});
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({error: "Please enter correct credentials"});
        }
        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, process.env.JWT_SECRET);
        success = true;
        res.json({authtoken, success});
    }
    catch(error){
        res.status(500).send("Some error occured");
    }
})
router.post('/getuser', fetchuser, async (req, res)=>{
    try{
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    }
    catch(error){
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
})
module.exports = router;