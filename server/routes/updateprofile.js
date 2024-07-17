const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const User = require('../models/User');
const {body, validationResult} = require('express-validator');
router.put('/editprofile', fetchuser, [
    body('fname').isLength({min: 3}),
    body('lname').isLength({min: 3}),
    body('email').isEmail()
], async(req, res) => {
    let success = false;
    const {fname, lname, email} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try{
        const newUser = {};
        newUser.fname = fname;
        newUser.lname = lname;
        newUser.email = email;
        let newuser = await User.findById(req.user.id);
        if(!newuser){
            return res.status(401).send("No such user exists");
        }
        if(newuser.id.toString() !== req.user.id){
            return res.status(401).send("Access denied");
        }
        newuser = await User.findByIdAndUpdate(req.user.id, {$set : newUser}, {new: true});
        success = true;
        res.json({success});
    }
    catch(error){
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router;